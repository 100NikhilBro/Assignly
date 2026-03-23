import { Request, Response, Application } from "express";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import { helmetConfig } from "./config/helmet.config";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://assignly-nikhil100.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
));


app.options("/*", cors());

app.use(helmetConfig); 
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running");
});

export default app;
