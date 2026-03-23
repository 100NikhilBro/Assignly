import { Request, Response, Application } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://assignly-nikhil100.vercel.app",
];


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());


app.use("/api", routes);


app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running");
});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

export default app;
