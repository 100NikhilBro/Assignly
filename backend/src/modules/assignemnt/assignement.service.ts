import { Assignment } from "./assignment.model";
import { IAssignment } from "../../types/assignment.types";

export const createAssignment = async (
  data: Partial<IAssignment>
): Promise<IAssignment> => {
  const assignment = await Assignment.create(data);

  return assignment.toObject();
};


export const getAssignmentById = async (
  id: string
): Promise<IAssignment | null> => {
  return await Assignment.findById(id).lean();
};


export const updateAssignmentStatus = async (
  id: string,
  status: "pending" | "processing" | "completed" | "failed"
): Promise<void> => {
  await Assignment.findByIdAndUpdate(id, {
    $set: { status },
  });
};


export const updateAssignmentPaper = async (
  id: string,
  paper: any
): Promise<void> => {
  await Assignment.findByIdAndUpdate(id, {
    $set: {
      status: "completed",
      paper,
    },
  });
};