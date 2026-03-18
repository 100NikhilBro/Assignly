import { Request,Response,Application } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from 'morgan';
import routes from "./routes";
const app:Application = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());


app.use("/api", routes);

app.get("/", (req:Request, res:Response) => {
  res.send("Backend is running");
});

export default app;