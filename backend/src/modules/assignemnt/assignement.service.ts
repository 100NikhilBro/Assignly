// // import { Assignment } from "./assignment.model";
// // import { IAssignment } from "../../types/assignment.types";

// // export const createAssignment = async (
// //   data: Partial<IAssignment>
// // ): Promise<IAssignment> => {
// //   const assignment = await Assignment.create(data);

// //   return assignment.toObject();
// // };


// // export const getAssignmentById = async (
// //   id: string
// // ): Promise<IAssignment | null> => {
// //   return await Assignment.findById(id).lean();
// // };


// // export const updateAssignmentStatus = async (
// //   id: string,
// //   status: "pending" | "processing" | "completed" | "failed"
// // ): Promise<void> => {
// //   await Assignment.findByIdAndUpdate(id, {
// //     $set: { status },
// //   });
// // };


// // export const updateAssignmentPaper = async (
// //   id: string,
// //   paper: any
// // ): Promise<void> => {
// //   await Assignment.findByIdAndUpdate(id, {
// //     $set: {
// //       status: "completed",
// //       paper,
// //     },
// //   });
// // };



// import { Assignment } from "./assignment.model";
// import { IAssignment } from "../../types/assignment.types";

// // ✅ CREATE
// export const createAssignment = async (
//   data: Partial<IAssignment>
// ): Promise<IAssignment> => {
//   const assignment = await Assignment.create(data);

//   // 🔥 convert mongoose doc → plain object (typed)
//   return assignment.toObject() as IAssignment;
// };

// // ✅ GET (LEAN = FAST ⚡)
// export const getAssignmentById = async (
//   id: string
// ): Promise<IAssignment | null> => {
//   return await Assignment.findById(id).lean<IAssignment>();
// };



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