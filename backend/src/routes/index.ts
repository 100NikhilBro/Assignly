// // import express from "express";
// // import assignmentRoutes from "../modules/assignemnt/assignment.routes";

// // const router = express.Router();

// // router.use("/assignment", assignmentRoutes);


// // import userRoutes from "../modules/user/user.route";

// // router.use("/user", userRoutes);


// // import authRoutes from "../modules/auth/auth.route";

// // router.use("/auth", authRoutes);


// // import { getGuestCreditsController } from "../modules/assignemnt/assignement.controller";

// // router.get("/guest/credits", getGuestCreditsController);

// // export default router;


// import express from "express";
// import assignmentRoutes from "../modules/assignemnt/assignment.routes";
// import userRoutes from "../modules/user/user.route";
// import authRoutes from "../modules/auth/auth.route";
// import { getGuestCreditsController } from "../modules/assignemnt/assignement.controller";

// const router = express.Router();

// // ✅ Auth routes first (no auth required)
// router.use("/auth", authRoutes);

// // ✅ Guest credits route (no auth required)
// router.get("/guest/credits", getGuestCreditsController);

// // ✅ Protected routes (auth required)
// router.use("/assignment", assignmentRoutes);
// router.use("/user", userRoutes);

// export default router;



import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import assignmentRoutes from "../modules/assignemnt/assignment.routes";
import userRoutes from "../modules/user/user.route";
import authRoutes from "../modules/auth/auth.route";
import { getGuestCreditsController } from "../modules/assignemnt/assignement.controller";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);
router.get("/guest/credits", getGuestCreditsController);

// ✅ Protected routes - add authMiddleware
router.use("/assignment", authMiddleware, assignmentRoutes);
router.use("/user", authMiddleware, userRoutes);

export default router;