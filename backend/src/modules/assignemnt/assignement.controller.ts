
// // // import { Request, Response } from "express";
// // // import mongoose from "mongoose";
// // // import * as assignmentService from "./assignement.service";
// // // import { cleanText } from "../../utils/sanitize";
// // // import { assignmentQueue } from "../../queue/assignment.queue";
// // // import { User } from "../user/user.model";
// // // import { handleGuestCredits, getGuestCreditsInfo } from "../../utils/credits";
// // // import { createAssignmentSchema } from "../../schema/assignment.schema";

// // // export const createAssignmentController = async (req: Request, res: Response) => {
// // //   try {
// // //     // ========== DEBUG LOGS ==========
// // //     console.log("\n🔍 ========== CREATE ASSIGNMENT BACKEND ==========");
// // //     console.log("Request headers:", req.headers);
// // //     console.log("Authorization header:", req.headers.authorization);
// // //     // ========== END DEBUG ==========

// // //     // ✅ 1. VALIDATION
// // //     const parsed = createAssignmentSchema.safeParse(req.body);

// // //     if (!parsed.success) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Validation failed",
// // //         errors: parsed.error.flatten(),
// // //       });
// // //     }

// // //     const data = parsed.data;

// // //     // ✅ 2. AUTH / CREDITS
// // //     const user = (req as any).user;
    
// // //     console.log("👤 User from request:", user);
    
// // //     // Get session ID for guest tracking (from header, IP, or generate)
// // //     let sessionId = req.headers["x-session-id"] as string;
// // //     if (!sessionId && !user) {
// // //       // Generate session ID for guest if not provided
// // //       sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// // //     }
    
// // //     let userId = null;
// // //     let creditsRemaining = 0;

// // //     if (!user) {
// // //       // GUEST USER FLOW
// // //       console.log("🎭 Guest user detected, sessionId:", sessionId);
// // //       const hasCredits = await handleGuestCredits(sessionId);
      
// // //       if (!hasCredits) {
// // //         const info = await getGuestCreditsInfo(sessionId);
// // //         return res.status(403).json({
// // //           success: false,
// // //           message: "Guest credits exhausted (3/3 used). Please login to get 30 credits.",
// // //           requiresLogin: true,
// // //           creditsRemaining: info.credits,
// // //         });
// // //       }
      
// // //       const info = await getGuestCreditsInfo(sessionId);
// // //       creditsRemaining = info.credits;
// // //       console.log(`Guest user (${sessionId}) used credit. Remaining: ${creditsRemaining}`);
      
// // //     } else {
// // //       // LOGGED IN USER FLOW
// // //       console.log("👤 Logged in user detected:", user.id, user.email);
// // //       userId = user.id;
// // //       const dbUser = await User.findById(userId);

// // //       if (!dbUser) {
// // //         return res.status(404).json({
// // //           success: false,
// // //           message: "User not found",
// // //         });
// // //       }

// // //       console.log(`💰 User credits before deduction: ${dbUser.credits}`);

// // //       if (dbUser.credits <= 0) {
// // //         return res.status(403).json({
// // //           success: false,
// // //           message: "You have 0 credits. Please upgrade.",
// // //           requiresUpgrade: true,
// // //         });
// // //       }

// // //       // Deduct 1 credit
// // //       dbUser.credits -= 1;
// // //       await dbUser.save();
// // //       creditsRemaining = dbUser.credits;
      
// // //       console.log(`✅ User ${dbUser.email} used credit. Remaining: ${creditsRemaining}`);
// // //     }

// // //     // ✅ 3. SANITIZATION + TYPE FIX
// // //     const sanitizedData = {
// // //       ...data,

// // //       schoolName: data.schoolName ? cleanText(data.schoolName) : "School Name",
// // //       topic: cleanText(data.topic),
// // //       subject: cleanText(data.subject),
// // //       class: cleanText(data.class),

// // //       dueDate: data.dueDate ? new Date(data.dueDate) : undefined,

// // //       concepts: Array.isArray(data.concepts)
// // //         ? data.concepts.map((c: string) => cleanText(c))
// // //         : [],

// // //       instructions: data.instructions
// // //         ? cleanText(data.instructions)
// // //         : undefined,

// // //       questionTypes: Array.isArray(data.questionTypes)
// // //         ? data.questionTypes.map((q: string) => cleanText(q))
// // //         : [],

// // //       status: "pending" as const,
      
// // //       // ✅ ADD userId for logged-in users (null for guests)
// // //       userId: userId || null,
      
// // //       // ✅ Store sessionId for guests (null for logged-in users)
// // //       guestSessionId: !user ? sessionId : null,
// // //     };

// // //     // ✅ 4. CREATE
// // //     const assignment = await assignmentService.createAssignment(sanitizedData);
// // //     console.log("📝 Assignment created with ID:", assignment._id);

// // //     // ✅ 5. QUEUE
// // //     try {
// // //       await assignmentQueue.add(
// // //         "generate-paper",
// // //         { assignmentId: assignment._id },
// // //         {
// // //           attempts: 3,
// // //           backoff: { type: "exponential", delay: 2000 },
// // //           removeOnComplete: true,
// // //           removeOnFail: false,
// // //         }
// // //       );
// // //       console.log("✅ Job added to queue");
// // //     } catch (err) {
// // //       console.error("Queue add failed:", err);

// // //       await assignmentService.updateAssignmentStatus(
// // //         assignment._id.toString(),
// // //         "failed"
// // //       );
// // //     }

// // //     console.log("✅ Assignment creation successful\n");
    
// // //     return res.status(201).json({
// // //       success: true,
// // //       message: "Assignment created. Paper is being generated.",
// // //       data: {
// // //         id: assignment._id,
// // //         status: assignment.status,
// // //       },
// // //       creditsRemaining,
// // //       isGuest: !user,
// // //       sessionId: !user ? sessionId : undefined,
// // //     });

// // //   } catch (error) {
// // //     console.error("❌ Create Assignment Error:", error);

// // //     return res.status(500).json({
// // //       success: false,
// // //       message: "Internal Server Error",
// // //     });
// // //   }
// // // };

// // // export const getAssignmentController = async (req: Request, res: Response) => {
// // //   try {
// // //     const { id } = req.params;

// // //     // ✅ 1. VALIDATE ID
// // //     if (!mongoose.Types.ObjectId.isValid(id as string)) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Invalid assignment ID",
// // //       });
// // //     }

// // //     // ✅ 2. FETCH
// // //     const assignment = await assignmentService.getAssignmentById(id as string);

// // //     if (!assignment) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Assignment not found",
// // //       });
// // //     }

// // //     // ✅ 3. RESPONSE
// // //     return res.status(200).json({
// // //       success: true,
// // //       data: assignment,
// // //     });

// // //   } catch (error) {
// // //     console.error("Get Assignment Error:", error);

// // //     return res.status(500).json({
// // //       success: false,
// // //       message: "Internal Server Error",
// // //     });
// // //   }
// // // };

// // // // ✅ GET GUEST CREDITS ENDPOINT
// // // export const getGuestCreditsController = async (req: Request, res: Response) => {
// // //   try {
// // //     let sessionId = req.headers["x-session-id"] as string;
    
// // //     if (!sessionId) {
// // //       // Generate new session ID for new guest
// // //       sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// // //     }
    
// // //     const info = await getGuestCreditsInfo(sessionId);
    
// // //     return res.status(200).json({
// // //       success: true,
// // //       sessionId,
// // //       credits: info.credits,
// // //       ttl: info.ttl,
// // //       isGuest: true,
// // //     });
// // //   } catch (error) {
// // //     console.error("Get guest credits error:", error);
// // //     return res.status(500).json({
// // //       success: false,
// // //       message: "Failed to get guest credits",
// // //     });
// // //   }
// // // };




// // import { Request, Response } from "express";
// // import mongoose from "mongoose";
// // import * as assignmentService from "./assignement.service";
// // import { cleanText } from "../../utils/sanitize";
// // import { assignmentQueue } from "../../queue/assignment.queue";
// // import { User } from "../user/user.model";
// // import { handleGuestCredits, getGuestCreditsInfo } from "../../utils/credits";
// // import { createAssignmentSchema } from "../../schema/assignment.schema";
// // import { generateValidAIResponse } from "../../queue/assignment.worker";

// // export const createAssignmentController = async (req: Request, res: Response) => {
// //   try {
// //     console.log("\n🔍 ========== CREATE ASSIGNMENT BACKEND ==========");
// //     console.log("Authorization header:", req.headers.authorization);

// //     // ✅ 1. VALIDATION
// //     const parsed = createAssignmentSchema.safeParse(req.body);

// //     if (!parsed.success) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Validation failed",
// //         errors: parsed.error.flatten(),
// //       });
// //     }

// //     const data = parsed.data;

// //     // ✅ 2. AUTH / CREDITS
// //     const user = (req as any).user;
    
// //     console.log("👤 User from request:", user);
    
// //     let sessionId = req.headers["x-session-id"] as string;
// //     if (!sessionId && !user) {
// //       sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// //     }
    
// //     let userId = null;
// //     let creditsRemaining = 0;

// //     if (!user) {
// //       console.log("🎭 Guest user detected, sessionId:", sessionId);
// //       const hasCredits = await handleGuestCredits(sessionId);
      
// //       if (!hasCredits) {
// //         const info = await getGuestCreditsInfo(sessionId);
// //         return res.status(403).json({
// //           success: false,
// //           message: "Guest credits exhausted (3/3 used). Please login to get 30 credits.",
// //           requiresLogin: true,
// //           creditsRemaining: info.credits,
// //         });
// //       }
      
// //       const info = await getGuestCreditsInfo(sessionId);
// //       creditsRemaining = info.credits;
// //       console.log(`Guest user (${sessionId}) used credit. Remaining: ${creditsRemaining}`);
      
// //     } else {
// //       console.log("👤 Logged in user detected:", user.id, user.email);
// //       userId = user.id;
// //       const dbUser = await User.findById(userId);

// //       if (!dbUser) {
// //         return res.status(404).json({
// //           success: false,
// //           message: "User not found",
// //         });
// //       }

// //       console.log(`💰 User credits before deduction: ${dbUser.credits}`);

// //       if (dbUser.credits <= 0) {
// //         return res.status(403).json({
// //           success: false,
// //           message: "You have 0 credits. Please upgrade.",
// //           requiresUpgrade: true,
// //         });
// //       }

// //       dbUser.credits -= 1;
// //       await dbUser.save();
// //       creditsRemaining = dbUser.credits;
      
// //       console.log(`✅ User ${dbUser.email} used credit. Remaining: ${creditsRemaining}`);
// //     }

// //     // ✅ 3. SANITIZATION + TYPE FIX
// //     const sanitizedData = {
// //       ...data,

// //       schoolName: data.schoolName ? cleanText(data.schoolName) : "School Name",
// //       topic: cleanText(data.topic),
// //       subject: cleanText(data.subject),
// //       class: cleanText(data.class),

// //       dueDate: data.dueDate ? new Date(data.dueDate) : undefined,

// //       concepts: Array.isArray(data.concepts)
// //         ? data.concepts.map((c: string) => cleanText(c))
// //         : [],

// //       instructions: data.instructions
// //         ? cleanText(data.instructions)
// //         : undefined,

// //       questionTypes: Array.isArray(data.questionTypes)
// //         ? data.questionTypes.map((q: string) => cleanText(q))
// //         : [],

// //       status: "pending" as const,
      
// //       userId: userId || null,
// //       guestSessionId: !user ? sessionId : null,
// //     };

// //     // ✅ 4. CREATE
// //     const assignment = await assignmentService.createAssignment(sanitizedData);
// //     console.log("📝 Assignment created with ID:", assignment._id);

// //     // ✅ 5. QUEUE or SYNC PROCESSING
// //     const isQueueAvailable = assignmentQueue !== null;

// //     if (isQueueAvailable) {
// //       try {
// //         await assignmentQueue.add(
// //           "generate-paper",
// //           { assignmentId: assignment._id },
// //           {
// //             attempts: 3,
// //             backoff: { type: "exponential", delay: 2000 },
// //             removeOnComplete: true,
// //             removeOnFail: false,
// //           }
// //         );
// //         console.log("✅ Job added to queue");
// //       } catch (err) {
// //         console.error("Queue add failed:", err);
// //         await assignmentService.updateAssignmentStatus(
// //           assignment._id.toString(),
// //           "failed"
// //         );
// //       }
// //     } else {
// //       // 🔥 SYNCHRONOUS FALLBACK - Process directly without queue
// //       console.log("⚠️ Queue not available, processing synchronously...");
// //       try {
// //         await Assignment.findByIdAndUpdate(assignment._id, {
// //           status: "processing",
// //         });
        
// //         const paper = await generateValidAIResponse(assignment, assignment._id.toString());
        
// //         await assignmentService.updateAssignmentPaper(assignment._id.toString(), paper);
// //         console.log("✅ Synchronous processing completed");
// //       } catch (err: any) {
// //         console.error("❌ Synchronous processing failed:", err.message);
// //         await assignmentService.updateAssignmentStatus(
// //           assignment._id.toString(),
// //           "failed"
// //         );
// //       }
// //     }

// //     console.log("✅ Assignment creation successful\n");
    
// //     return res.status(201).json({
// //       success: true,
// //       message: "Assignment created. Paper is being generated.",
// //       data: {
// //         id: assignment._id,
// //         status: assignment.status,
// //       },
// //       creditsRemaining,
// //       isGuest: !user,
// //       sessionId: !user ? sessionId : undefined,
// //     });

// //   } catch (error) {
// //     console.error("❌ Create Assignment Error:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Internal Server Error",
// //     });
// //   }
// // };

// // export const getAssignmentController = async (req: Request, res: Response) => {
// //   try {
// //     const { id } = req.params;

// //     if (!mongoose.Types.ObjectId.isValid(id as string)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid assignment ID",
// //       });
// //     }

// //     const assignment = await assignmentService.getAssignmentById(id as string);

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
// //     let sessionId = req.headers["x-session-id"] as string;
    
// //     if (!sessionId) {
// //       sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
// //     console.error("Get guest credits error:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to get guest credits",
// //     });
// //   }
// // };















// import { Request, Response } from "express";
// import mongoose from "mongoose";
// import * as assignmentService from "./assignement.service";
// import { cleanText } from "../../utils/sanitize";
// import { assignmentQueue } from "../../queue/assignment.queue";
// import { User } from "../user/user.model";
// import { handleGuestCredits, getGuestCreditsInfo } from "../../utils/credits";
// import { createAssignmentSchema } from "../../schema/assignment.schema";
// import { generateValidAIResponse } from "../../queue/assignment.worker";
// import { Assignment } from "./assignment.model";

// export const createAssignmentController = async (req: Request, res: Response) => {
//   try {
//     console.log("\n🔍 ========== CREATE ASSIGNMENT BACKEND ==========");
//     console.log("Authorization header:", req.headers.authorization);

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
//     console.log("👤 User from request:", user);
    
//     let sessionId = req.headers["x-session-id"] as string;
//     if (!sessionId && !user) {
//       sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     }
    
//     let userId = null;
//     let creditsRemaining = 0;

//     if (!user) {
//       console.log("🎭 Guest user detected, sessionId:", sessionId);
//       const hasCredits = await handleGuestCredits(sessionId);
      
//       if (!hasCredits) {
//         const info = await getGuestCreditsInfo(sessionId);
//         return res.status(403).json({
//           success: false,
//           message: "Guest credits exhausted (3/3 used). Please login to get 30 credits.",
//           requiresLogin: true,
//           creditsRemaining: info.credits,
//         });
//       }
      
//       const info = await getGuestCreditsInfo(sessionId);
//       creditsRemaining = info.credits;
//       console.log(`Guest user (${sessionId}) used credit. Remaining: ${creditsRemaining}`);
//     } else {
//       console.log("👤 Logged in user detected:", user.id, user.email);
//       userId = user.id;
//       const dbUser = await User.findById(userId);

//       if (!dbUser) {
//         return res.status(404).json({ success: false, message: "User not found" });
//       }

//       console.log(`💰 User credits before deduction: ${dbUser.credits}`);
//       if (dbUser.credits <= 0) {
//         return res.status(403).json({ success: false, message: "You have 0 credits. Please upgrade." });
//       }

//       dbUser.credits -= 1;
//       await dbUser.save();
//       creditsRemaining = dbUser.credits;
//       console.log(`✅ User ${dbUser.email} used credit. Remaining: ${creditsRemaining}`);
//     }

//     const sanitizedData = {
//       ...data,
//       schoolName: data.schoolName ? cleanText(data.schoolName) : "School Name",
//       topic: cleanText(data.topic),
//       subject: cleanText(data.subject),
//       class: cleanText(data.class),
//       dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
//       concepts: Array.isArray(data.concepts) ? data.concepts.map((c: string) => cleanText(c)) : [],
//       instructions: data.instructions ? cleanText(data.instructions) : undefined,
//       questionTypes: Array.isArray(data.questionTypes) ? data.questionTypes.map((q: string) => cleanText(q)) : [],
//       status: "pending" as const,
//       userId: userId || null,
//       guestSessionId: !user ? sessionId : null,
//     };

//     const assignment = await assignmentService.createAssignment(sanitizedData);
//     console.log("📝 Assignment created with ID:", assignment._id);

//     const isQueueAvailable = assignmentQueue !== null;

//     if (isQueueAvailable) {
//       try {
//         await assignmentQueue!.add("generate-paper", { assignmentId: assignment._id }, {
//           attempts: 3, backoff: { type: "exponential", delay: 2000 }, removeOnComplete: true, removeOnFail: false
//         });
//         console.log("✅ Job added to queue");
//       } catch (err) {
//         console.error("Queue add failed:", err);
//         await assignmentService.updateAssignmentStatus(assignment._id.toString(), "failed");
//       }
//     } else {
//       console.log("⚠️ Queue not available, processing synchronously...");
//       try {
//         await Assignment.findByIdAndUpdate(assignment._id, { status: "processing" });
//         const paper = await generateValidAIResponse(assignment, assignment._id.toString());
//         await assignmentService.updateAssignmentPaper(assignment._id.toString(), paper);
//         console.log("✅ Synchronous processing completed");
//       } catch (err: any) {
//         console.error("❌ Synchronous processing failed:", err.message);
//         await assignmentService.updateAssignmentStatus(assignment._id.toString(), "failed");
//       }
//     }

//     console.log("✅ Assignment creation successful\n");
//     return res.status(201).json({
//       success: true,
//       message: "Assignment created. Paper is being generated.",
//       data: { id: assignment._id, status: assignment.status },
//       creditsRemaining,
//       isGuest: !user,
//       sessionId: !user ? sessionId : undefined,
//     });

//   } catch (error) {
//     console.error("❌ Create Assignment Error:", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const getAssignmentController = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id as string)) {
//       return res.status(400).json({ success: false, message: "Invalid assignment ID" });
//     }
//     const assignment = await assignmentService.getAssignmentById(id as string);
//     if (!assignment) {
//       return res.status(404).json({ success: false, message: "Assignment not found" });
//     }
//     return res.status(200).json({ success: true, data: assignment });
//   } catch (error) {
//     console.error("Get Assignment Error:", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const getGuestCreditsController = async (req: Request, res: Response) => {
//   try {
//     let sessionId = req.headers["x-session-id"] as string;
//     if (!sessionId) {
//       sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     }
//     const info = await getGuestCreditsInfo(sessionId);
//     return res.status(200).json({ success: true, sessionId, credits: info.credits, ttl: info.ttl, isGuest: true });
//   } catch (error) {
//     console.error("Get guest credits error:", error);
//     return res.status(500).json({ success: false, message: "Failed to get guest credits" });
//   }
// };




import { Request, Response } from "express";
import mongoose from "mongoose";
import * as assignmentService from "./assignement.service";
import { cleanText } from "../../utils/sanitize";
import { assignmentQueue } from "../../queue/assignment.queue";
import { User } from "../user/user.model";
import { handleGuestCredits, getGuestCreditsInfo } from "../../utils/credits";
import { createAssignmentSchema } from "../../schema/assignment.schema";
import { Assignment } from "./assignment.model";

/* ================= CREATE ASSIGNMENT ================= */

export const createAssignmentController = async (req: Request, res: Response) => {
  try {
    console.log("\n🔍 ========== CREATE ASSIGNMENT ==========");
    console.log("🔐 Auth Header:", req.headers.authorization);

    // ✅ Validate input
    const parsed = createAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log("❌ Validation failed");
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
    }

    const data = parsed.data;
    const user = (req as any).user;
    console.log("👤 User:", user);

    // ================= SESSION =================
    let sessionId = req.headers["x-session-id"] as string;
    if (!sessionId && !user) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    let userId = null;
    let creditsRemaining = 0;

    // ================= GUEST =================
    if (!user) {
      console.log("🎭 Guest:", sessionId);

      const hasCredits = await handleGuestCredits(sessionId);
      if (!hasCredits) {
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
      // ================= USER =================
      console.log("👤 Logged in:", user.email);

      userId = user.id;
      const dbUser = await User.findById(userId);

      if (!dbUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      console.log("💰 Credits before:", dbUser.credits);

      if (dbUser.credits <= 0) {
        return res.status(403).json({ success: false, message: "No credits left" });
      }

      dbUser.credits -= 1;
      await dbUser.save();

      creditsRemaining = dbUser.credits;
      console.log("💰 Credits after:", creditsRemaining);
    }

    // ================= CREATE ASSIGNMENT =================
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
      userId,
      guestSessionId: !user ? sessionId : null,
    });

    console.log("📝 Assignment created:", assignment._id);

    // ================= QUEUE (FIXED) =================
    try {
      console.log("📦 Adding job to queue...");

      await assignmentQueue.add(
        "generate-paper",
        { assignmentId: assignment._id },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 2000 },
          removeOnComplete: true,
          removeOnFail: false,
        }
      );

      console.log("✅ JOB PUSHED:", assignment._id);

    } catch (err) {
      console.error("❌ Queue add failed:", err);

      await Assignment.findByIdAndUpdate(assignment._id, {
        status: "failed",
      });
    }

    console.log("✅ Assignment flow completed\n");

    return res.status(201).json({
      success: true,
      message: "Assignment created. Processing started.",
      data: {
        id: assignment._id,
        status: assignment.status,
      },
      creditsRemaining,
      isGuest: !user,
      sessionId: !user ? sessionId : undefined,
    });

  } catch (error) {
    console.error("❌ Create Assignment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ================= GET ASSIGNMENT ================= */

export const getAssignmentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
    console.error("❌ Get Assignment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ================= GUEST CREDITS ================= */

export const getGuestCreditsController = async (req: Request, res: Response) => {
  try {
    let sessionId = req.headers["x-session-id"] as string;

    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    console.error("❌ Guest credits error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get guest credits",
    });
  }
};
