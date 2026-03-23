// import { Request,Response,Application } from "express";
// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from 'morgan';
// import routes from "./routes";
// const app:Application = express();
// import { helmetConfig } from "./config/helmet.config";

// app.use(morgan('dev'));
// app.use(cors());
// app.use(helmetConfig);
// app.use(express.json());


// app.use("/api", routes);

// app.get("/", (req:Request, res:Response) => {
//   res.send("Backend is running");
// });

// export default app;



import { Request, Response, Application } from "express";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import { helmetConfig } from "./config/helmet.config";

const app: Application = express();

/* =========================
   🔥 PRODUCTION CORS CONFIG
========================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://assignly-nikhil100.vercel.app", // 🔥 YOUR FRONTEND
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 PREFLIGHT HANDLER
app.options("*", cors());

/* =========================
   SECURITY + MIDDLEWARE
========================= */

app.use(helmetConfig); // already fixed with COOP
app.use(morgan("dev"));
app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running 🚀");
});

export default app;
