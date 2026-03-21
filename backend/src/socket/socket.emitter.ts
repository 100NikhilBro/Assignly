import { getIO } from "./socket.server";

export const emitAssignmentUpdate = (
  assignmentId: string,
  payload: any
) => {
  try {
    const io = getIO();

    io.to(assignmentId).emit(`assignment:${assignmentId}`, {
      assignmentId,
      ...payload,
    });

    // optional debug
    console.log("Emit:", assignmentId, payload.status);
  } catch (err: any) {
    // NEVER break worker because of socket
    console.error(" Socket emit failed:", err.message);
  }
};
