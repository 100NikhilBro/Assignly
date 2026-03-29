import { Request, Response } from "express";
import mongoose from "mongoose";
import * as assignmentService from "./assignement.service";
import { cleanText } from "../../utils/sanitize";
import { assignmentQueue } from "../../queue/assignment.queue";
import { User } from "../user/user.model";
import { handleGuestCredits, getGuestCreditsInfo } from "../../utils/credits";
import { createAssignmentSchema } from "../../schema/assignment.schema";
import { Assignment } from "./assignment.model";
import { getRedisConnection } from "../../config/redis";


const getOrCreateGuestSession = (req: Request, res: Response): string => {
  let sessionId = req.cookies?.guestId as string | undefined;

  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // res.cookie("guestId", sessionId, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });


  res.cookie("guestId", sessionId, {
  httpOnly: true,
  secure: true,       // REQUIRED for HTTPS (Vercel + Render)
  sameSite: "none",   //  for cross-domain
  maxAge: 24 * 60 * 60 * 1000,
});
   
  }

  return sessionId;
};

export const createAssignmentController = async (req: Request, res: Response) => {
  try {
    const parsed = createAssignmentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
    }

    const data = parsed.data;
    const user = (req as any).user;

    let creditsRemaining = 0;
    let userId: string | null = null;
    let sessionId: string | null = null;

 
    if (!user) {
      sessionId = getOrCreateGuestSession(req, res);

      const success = await handleGuestCredits(sessionId);

      if (!success) {
        const info = await getGuestCreditsInfo(sessionId);
        return res.status(403).json({
          success: false,
          message: "Guest credits exhausted",
          requiresLogin: true,
          creditsRemaining: info.credits,
        });
      }

      const info = await getGuestCreditsInfo(sessionId);
      creditsRemaining = info.credits;

    } else {
      userId = user.id;

      const dbUser = await User.findById(userId);

      if (!dbUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (dbUser.credits <= 0) {
        return res.status(403).json({
          success: false,
          message: "No credits left",
        });
      }

      dbUser.credits -= 1;
      await dbUser.save();

      creditsRemaining = dbUser.credits;
    }


    const assignment = await assignmentService.createAssignment({
      ...data,
      schoolName: data.schoolName ? cleanText(data.schoolName) : "School Name",
      topic: cleanText(data.topic),
      subject: cleanText(data.subject),
      class: cleanText(data.class),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      concepts: Array.isArray(data.concepts)
        ? data.concepts.map((c: string) => cleanText(c))
        : [],
      instructions: data.instructions ? cleanText(data.instructions) : undefined,
      questionTypes: Array.isArray(data.questionTypes)
        ? data.questionTypes.map((q: string) => cleanText(q))
        : [],
      status: "pending",
      userId: userId ? new mongoose.Types.ObjectId(userId) : null,
      guestSessionId: sessionId,
    });


    await assignmentQueue.add(
      "generate-paper",
      {
        assignmentId: assignment._id.toString(),
        isRegenerate: false,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    return res.status(201).json({
      success: true,
      message: "Assignment created. Processing started.",
      data: {
        id: assignment._id.toString(),
        status: assignment.status,
      },
      creditsRemaining,
      isGuest: !user,
    });

  } catch (error) {
    console.error("Create Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const regenerateAssignmentController = async (req: Request, res: Response) => {
  try {
    const assignmentId = req.params.id as string;
    const user = (req as any).user;

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Login required for regeneration",
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const dbUser = await User.findById(user.id);

    if (!dbUser || dbUser.credits <= 0) {
      return res.status(403).json({
        success: false,
        message: "No credits left",
      });
    }

    dbUser.credits -= 1;
    await dbUser.save();

    assignment.status = "pending";
    assignment.paper = undefined as any;
    await assignment.save();

    const redis = await getRedisConnection();
    if (redis) {
      await redis.del(`assignment:${assignmentId}`);
    }

    await assignmentQueue.add("generate-paper", {
      assignmentId: assignment._id.toString(),
      isRegenerate: true,
    });

    return res.status(200).json({
      success: true,
      message: "Regeneration started",
      creditsRemaining: dbUser.credits,
    });

  } catch (error) {
    console.error("Regenerate error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getAssignmentController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID",
      });
    }

    const redis = await getRedisConnection();
    const cacheKey = `assignment:${id}`;

    if (redis) {
      const cached = await redis.get(cacheKey);

      if (cached) {
        return res.status(200).json({
          success: true,
          data: typeof cached === "string" ? JSON.parse(cached) : cached,
          cached: true,
        });
      }
    }

    const assignment = await assignmentService.getAssignmentById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(assignment), { ex: 300 });
    }

    return res.status(200).json({
      success: true,
      data: assignment,
      cached: false,
    });

  } catch (error) {
    console.error("Get Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// export const getGuestCreditsController = async (req: Request, res: Response) => {
//   try {
//     const sessionId = getOrCreateGuestSession(req, res);

//     const info = await getGuestCreditsInfo(sessionId);

//     return res.status(200).json({
//       success: true,
//       credits: info.credits,
//       ttl: info.ttl,
//       isGuest: true,
//     });

//   } catch (error) {
//     console.error("Guest credits error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get guest credits",
//     });
//   }
// };


export const getGuestCreditsController = async (req: Request, res: Response) => {
  try {
   
     res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store"
    });

    const sessionId = getOrCreateGuestSession(req, res);

    const info = await getGuestCreditsInfo(sessionId);

    return res.status(200).json({
      success: true,
      credits: info.credits,
      ttl: info.ttl,
      isGuest: true,
    });

  } catch (error) {
    console.error("Guest credits error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get guest credits",
    });
  }
};
