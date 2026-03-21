import { Assignment } from "./assignment.model";
import { IAssignment } from "../../types/assignment.types";

// ✅ CREATE
export const createAssignment = async (
  data: Partial<IAssignment>
): Promise<IAssignment> => {
  const doc = await Assignment.create(data);
  return doc.toObject() as IAssignment;
};

// ✅ GET (LEAN = FAST ⚡)
export const getAssignmentById = async (
  id: string
): Promise<IAssignment | null> => {
  return await Assignment.findById(id).lean<IAssignment>();
};

// ✅ UPDATE STATUS
export const updateAssignmentStatus = async (
  id: string,
  status: IAssignment["status"]
): Promise<void> => {
  await Assignment.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: false }
  );
};

// ✅ UPDATE PAPER (AND MARK COMPLETED)
export const updateAssignmentPaper = async (
  id: string,
  paper: IAssignment["paper"]
): Promise<void> => {
  await Assignment.findByIdAndUpdate(
    id,
    {
      $set: {
        paper,
        status: "completed",
        errorMessage: null,
      },
    },
    { new: false }
  );
};