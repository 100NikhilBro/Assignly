import { getIO } from "./socket.server";

export const emitAssignmentUpdate = (
  assignmentId: string,
  payload: any
) => {
  const io = getIO();

  io.to(assignmentId).emit(`assignment:${assignmentId}`, {
    assignmentId,
    ...payload,
  });
};