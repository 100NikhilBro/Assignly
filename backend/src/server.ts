import app from "./app";
import { dbConnect } from "./config/db";
import { env } from "./config/env";

import "./queue/assignment.worker";

const PORT = env.PORT;

const startServer = async () => {
  try {

    await dbConnect();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
  }
};

startServer();