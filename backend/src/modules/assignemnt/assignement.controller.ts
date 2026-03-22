// // import { Request, Response } from "express";
// // import mongoose from "mongoose";
// // import * as assignmentService from "./assignement.service";
// // import { cleanText } from "../../utils/sanitize";
// // import { assignmentQueue } from "../../queue/assignment.queue";
// // import { User } from "../user/user.model";
// // import { handleGuestCredits, getGuestCreditsInfo } from "../../utils/credits";
// // import { createAssignmentSchema } from "../../schema/assignment.schema";
// // import { Assignment } from "./assignment.model";

// // export const createAssignmentController = async (req: Request, res: Response) => {
// //   try {

// //     const parsed = createAssignmentSchema.safeParse(req.body);
// //     if (!parsed.success) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Validation failed",
// //         errors: parsed.error.flatten(),
// //       });
// //     }

// //     const data = parsed.data;
// //     const user = (req as any).user;

// //     let sessionId = req.headers["x-session-id"] as string | undefined;

// //     if (!sessionId && !user) {
// //       sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
// //     }

// //     let userId: string | null = null;
// //     let creditsRemaining = 0;

    
// //     if (!user) {
// //       const hasCredits = await handleGuestCredits(sessionId!);

// //       if (!hasCredits) {
// //         const info = await getGuestCreditsInfo(sessionId!);
// //         return res.status(403).json({
// //           success: false,
// //           message: "Guest credits exhausted",
// //           requiresLogin: true,
// //           creditsRemaining: info.credits,
// //         });
// //       }

// //       const info = await getGuestCreditsInfo(sessionId!);
// //       creditsRemaining = info.credits;

// //     } else {
     
// //       userId = user.id;

// //       const dbUser = await User.findById(userId);
// //       if (!dbUser) {
// //         return res.status(404).json({ success: false, message: "User not found" });
// //       }

// //       if (dbUser.credits <= 0) {
// //         return res.status(403).json({ success: false, message: "No credits left" });
// //       }

// //       dbUser.credits -= 1;
// //       await dbUser.save();

// //       creditsRemaining = dbUser.credits;
// //     }

    
// //     const assignment = await assignmentService.createAssignment({
// //       ...data,
// //       schoolName: data.schoolName ? cleanText(data.schoolName) : "School Name",
// //       topic: cleanText(data.topic),
// //       subject: cleanText(data.subject),
// //       class: cleanText(data.class),
// //       dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
// //       concepts: Array.isArray(data.concepts)
// //         ? data.concepts.map((c: string) => cleanText(c))
// //         : [],
// //       instructions: data.instructions ? cleanText(data.instructions) : undefined,
// //       questionTypes: Array.isArray(data.questionTypes)
// //         ? data.questionTypes.map((q: string) => cleanText(q))
// //         : [],
// //       status: "pending",

     
// //       userId: userId ? new mongoose.Types.ObjectId(userId) : null,

// //       guestSessionId: !user ? sessionId! : null,
// //     });

// //     console.log("Assignment created:", assignment._id.toString());

   
// //     try {
// //       console.log(" Adding job to queue...");

// //       await assignmentQueue.add(
// //         "generate-paper",
// //         { assignmentId: assignment._id.toString() },
// //         {
// //           attempts: 3,
// //           backoff: { type: "exponential", delay: 2000 },
// //           removeOnComplete: true,
// //           removeOnFail: false,
// //         }
// //       );

// //       console.log("JOB PUSHED:", assignment._id.toString());

// //     } catch (err) {
// //       console.error("Queue add failed:", err);

// //       await Assignment.findByIdAndUpdate(assignment._id, {
// //         status: "failed",
// //       });
// //     }

// //     return res.status(201).json({
// //       success: true,
// //       message: "Assignment created. Processing started.",
// //       data: {
// //         id: assignment._id.toString(),
// //         status: assignment.status,
// //       },
// //       creditsRemaining,
// //       isGuest: !user,
// //       sessionId: !user ? sessionId : undefined,
// //     });

// //   } catch (error) {
// //     console.error(" Create Assignment Error:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Internal Server Error",
// //     });
// //   }
// // };



// // export const getAssignmentController = async (req: Request, res: Response) => {
// //   try {
// //     const id = req.params.id as string;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid assignment ID",
// //       });
// //     }

// //     const assignment = await assignmentService.getAssignmentById(id);

// //     if (!assignment) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Assignment not found",
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       data: assignment,
// //     });

// //   } catch (error) {
// //     console.error("Get Assignment Error:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Internal Server Error",
// //     });
// //   }
// // };


// // export const getGuestCreditsController = async (req: Request, res: Response) => {
// //   try {
// //     let sessionId = req.headers["x-session-id"] as string | undefined;

// //     if (!sessionId) {
// //       sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
// //     }

// //     const info = await getGuestCreditsInfo(sessionId);

// //     return res.status(200).json({
// //       success: true,
// //       sessionId,
// //       credits: info.credits,
// //       ttl: info.ttl,
// //       isGuest: true,
// //     });

// //   } catch (error) {
// //     console.error("Guest credits error:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to get guest credits",
// //     });
// //   }
// // };


// // ==================================================================================================

// import { Request, Response } from "express";
// import mongoose from "mongoose";
// import * as assignmentService from "./assignement.service";
// import { cleanText } from "../../utils/sanitize";
// import { assignmentQueue } from "../../queue/assignment.queue";
// import { User } from "../user/user.model";
// import { getGuestCredits, getGuestCreditsInfo } from "../../utils/credits";
// import { createAssignmentSchema } from "../../schema/assignment.schema";
// import { Assignment } from "./assignment.model";

// export const createAssignmentController = async (req: Request, res: Response) => {
//   try {
//     const parsed = createAssignmentSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: parsed.error.flatten(),
//       });
//     }

//     const data = parsed.data;
//     const user = (req as any).user;

//     let sessionId = req.headers["x-session-id"] as string | undefined;

//     // fallback (frontend should ideally send stable sessionId)
//     if (!sessionId && !user) {
//       sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
//     }

//     let userId: string | null = null;
//     let creditsRemaining = 0;

//     // =========================
//     // ✅ CREDIT CHECK ONLY
//     // =========================
//     if (!user) {
//       const credits = await getGuestCredits(sessionId!);

//       if (credits <= 0) {
//         return res.status(403).json({
//           success: false,
//           message: "Guest credits exhausted",
//           requiresLogin: true,
//           creditsRemaining: credits,
//         });
//       }

//       creditsRemaining = credits;

//     } else {
//       userId = user.id;

//       const dbUser = await User.findById(userId);
//       if (!dbUser) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       if (dbUser.credits <= 0) {
//         return res.status(403).json({
//           success: false,
//           message: "No credits left",
//         });
//       }

//       creditsRemaining = dbUser.credits;
//     }

//     // =========================
//     // CREATE ASSIGNMENT
//     // =========================
//     const assignment = await assignmentService.createAssignment({
//       ...data,
//       schoolName: data.schoolName ? cleanText(data.schoolName) : "School Name",
//       topic: cleanText(data.topic),
//       subject: cleanText(data.subject),
//       class: cleanText(data.class),
//       dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
//       concepts: Array.isArray(data.concepts)
//         ? data.concepts.map((c: string) => cleanText(c))
//         : [],
//       instructions: data.instructions ? cleanText(data.instructions) : undefined,
//       questionTypes: Array.isArray(data.questionTypes)
//         ? data.questionTypes.map((q: string) => cleanText(q))
//         : [],
//       status: "pending",
//       userId: userId ? new mongoose.Types.ObjectId(userId) : null,
//       guestSessionId: !user ? sessionId! : null,
//     });

//     console.log("Assignment created:", assignment._id.toString());

//     // =========================
//     // ADD TO QUEUE
//     // =========================
//     try {
//       await assignmentQueue.add(
//         "generate-paper",
//         { assignmentId: assignment._id.toString() },
//         {
//           attempts: 3,
//           backoff: { type: "exponential", delay: 2000 },
//           removeOnComplete: true,
//           removeOnFail: false,
//         }
//       );

//       console.log("JOB PUSHED:", assignment._id.toString());

//     } catch (err) {
//       console.error("Queue add failed:", err);

//       await Assignment.findByIdAndUpdate(assignment._id, {
//         status: "failed",
//       });
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Assignment created. Processing started.",
//       data: {
//         id: assignment._id.toString(),
//         status: assignment.status,
//       },
//       creditsRemaining,
//       isGuest: !user,
//       sessionId: !user ? sessionId : undefined,
//     });

//   } catch (error) {
//     console.error("Create Assignment Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// // =========================
// // GET ASSIGNMENT
// // =========================
// export const getAssignmentController = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id as string;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid assignment ID",
//       });
//     }

//     const assignment = await assignmentService.getAssignmentById(id);

//     if (!assignment) {
//       return res.status(404).json({
//         success: false,
//         message: "Assignment not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: assignment,
//     });

//   } catch (error) {
//     console.error("Get Assignment Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// // =========================
// // GET GUEST CREDITS
// // =========================
// export const getGuestCreditsController = async (req: Request, res: Response) => {
//   try {
//     let sessionId = req.headers["x-session-id"] as string | undefined;

//     if (!sessionId) {
//       sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
//     }

//     const info = await getGuestCreditsInfo(sessionId);

//     return res.status(200).json({
//       success: true,
//       sessionId,
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



// =========New================


import { Request, Response } from "express";
import mongoose from "mongoose";
import * as assignmentService from "./assignement.service";
import { cleanText } from "../../utils/sanitize";
import { assignmentQueue } from "../../queue/assignment.queue";
import { User } from "../user/user.model";
import { handleGuestCredits, getGuestCreditsInfo } from "../../utils/credits";
import { createAssignmentSchema } from "../../schema/assignment.schema";
import { Assignment } from "./assignment.model";

// =========================
// CREATE ASSIGNMENT
// =========================
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

    let sessionId = req.headers["x-session-id"] as string | undefined;

    if (!sessionId && !user) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }

    let userId: string | null = null;
    let creditsRemaining = 0;

    // =========================
    // 💥 CREDIT LOGIC FIXED
    // =========================
    if (!user) {
      const hasCredits = await handleGuestCredits(sessionId!);

      if (!hasCredits) {
        const info = await getGuestCreditsInfo(sessionId!);

        return res.status(403).json({
          success: false,
          message: "Guest credits exhausted",
          requiresLogin: true,
          creditsRemaining: info.credits,
        });
      }

      const info = await getGuestCreditsInfo(sessionId!);
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

      // 💥 DEDUCT CREDIT
      dbUser.credits -= 1;
      await dbUser.save();

      creditsRemaining = dbUser.credits;
    }

    // =========================
    // CREATE ASSIGNMENT
    // =========================
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
      guestSessionId: !user ? sessionId! : null,
    });

    console.log("Assignment created:", assignment._id.toString());

    // =========================
    // ADD TO QUEUE
    // =========================
    try {
      await assignmentQueue.add(
        "generate-paper",
        { assignmentId: assignment._id.toString() },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 2000 },
          removeOnComplete: true,
          removeOnFail: false,
        }
      );

      console.log("JOB PUSHED:", assignment._id.toString());

    } catch (err) {
      console.error("Queue add failed:", err);

      await Assignment.findByIdAndUpdate(assignment._id, {
        status: "failed",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Assignment created. Processing started.",
      data: {
        id: assignment._id.toString(),
        status: assignment.status,
      },
      creditsRemaining,
      isGuest: !user,
      sessionId: !user ? sessionId : undefined,
    });

  } catch (error) {
    console.error("Create Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================
// 🔥 REGENERATE (NEW)
// =========================
export const regenerateAssignmentController = async (req: Request, res: Response) => {
  try {
    const assignmentId = req.params.id;
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

    // 💥 deduct credit
    dbUser.credits -= 1;
    await dbUser.save();

    // reset assignment
    assignment.status = "pending";
    assignment.paper = undefined as any;
    await assignment.save();

    // push job
    await assignmentQueue.add(
      "generate-paper",
      {
        assignmentId: assignment._id.toString(),
        isRegenerate: true,
      }
    );

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

// =========================
// GET ASSIGNMENT
// =========================
export const getAssignmentController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID",
      });
    }

    const assignment = await assignmentService.getAssignmentById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: assignment,
    });

  } catch (error) {
    console.error("Get Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================
// GET GUEST CREDITS
// =========================
export const getGuestCreditsController = async (req: Request, res: Response) => {
  try {
    let sessionId = req.headers["x-session-id"] as string | undefined;

    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }

    const info = await getGuestCreditsInfo(sessionId);

    return res.status(200).json({
      success: true,
      sessionId,
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




    
