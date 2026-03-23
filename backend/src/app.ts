// // // import { Request, Response, Application } from "express";
// // // import express from "express";
// // // import cors from "cors";
// // // import morgan from "morgan";
// // // import routes from "./routes";
// // // import { helmetConfig } from "./config/helmet.config";

// // // const app: Application = express();

// // // const allowedOrigins = [
// // //   "http://localhost:3000",
// // //   "https://assignly-nikhil100.vercel.app",
// // // ];

// // // app.use(
// // //   cors({
// // //     origin: function (origin, callback) {
// // //       if (!origin) return callback(null, true);

// // //       if (allowedOrigins.includes(origin)) {
// // //         return callback(null, true);
// // //       } else {
// // //         console.log("Blocked by CORS:", origin);
// // //         return callback(new Error("Not allowed by CORS"));
// // //       }
// // //     },
// // //     credentials: true,
// // //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// // //     allowedHeaders: ["Content-Type", "Authorization"],
// // //   })
// // // ));

// // // // Fix wildcard path
// // // app.options("/*", cors());

// // // app.use(helmetConfig);
// // // app.use(morgan("dev"));
// // // app.use(express.json());

// // // app.use("/api", routes);

// // // app.get("/", (req: Request, res: Response) => {
// // //   res.send("Backend is running");
// // // });

// // // export default app;



// // import { Request, Response, Application } from "express";
// // import express from "express";
// // import cors from "cors";
// // import morgan from "morgan";
// // import routes from "./routes";
// // import { helmetConfig } from "./config/helmet.config";

// // const app: Application = express();

// // const allowedOrigins = [
// //   "http://localhost:3000",
// //   "https://assignly-nikhil100.vercel.app",
// // ];

// // app.use(
// //   cors({
// //     origin: function (origin, callback) {
// //       if (!origin) return callback(null, true);

// //       if (allowedOrigins.includes(origin)) {
// //         return callback(null, true);
// //       } else {
// //         console.log("Blocked by CORS:", origin);
// //         return callback(new Error("Not allowed by CORS"));
// //       }
// //     },
// //     credentials: true,
// //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //   })
// // );

// // // Fix wildcard path
// // app.options("/*", cors());

// // app.use(helmetConfig);
// // app.use(morgan("dev"));
// // app.use(express.json());

// // app.use("/api", routes);

// // app.get("/", (req: Request, res: Response) => {
// //   res.send("Backend is running");
// // });

// // export default app;



// import { Request, Response, Application } from "express";
// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import routes from "./routes";

// const app: Application = express();

// // === Allowed Origins (for CORS) ===
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://assignly-nikhil100.vercel.app",
// ];

// // === CORS Setup ===
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow non-browser requests (like Postman)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         console.log("Blocked by CORS:", origin);
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Fix wildcard path for OPTIONS requests
// app.options("/*", cors());

// // === Middlewares ===
// app.use(helmet());
// app.use(morgan("dev"));
// app.use(express.json());

// // === Routes ===
// app.use("/api", routes);

// // === Root Endpoint ===
// app.get("/", (req: Request, res: Response) => {
//   res.send("Backend is running");
// });

// // === Export app ===
// export default app;



import { Request, Response, Application } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";

const app: Application = express();

// === Allowed Origins ===
const allowedOrigins = [
  "http://localhost:3000",
  "https://assignly-nikhil100.vercel.app",
];

// === CORS Middleware (handles OPTIONS automatically) ===
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// === Middlewares ===
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// === Routes ===
app.use("/api", routes);

// === Root Endpoint ===
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running");
});

// Optional: Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

export default app;
