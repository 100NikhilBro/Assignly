import http from "http";
import app from "./app";
import { dbConnect } from "./config/db";
import { env } from "./config/env";
import { initSocket } from "./socket/socket.server";

import "./queue/assignment.worker";

const PORT = env.PORT;

const startServer = async () => {
  try {
    await dbConnect();

    const server = http.createServer(app);

    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start", error);
  }
};

startServer();