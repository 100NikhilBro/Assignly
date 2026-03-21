// // // // "use client";

// // // // import { useState } from "react";
// // // // import axios from "axios";
// // // // import Header from "@/components/layout/Header";
// // // // import { useRouter } from "next/navigation";
// // // // import { useUserStore } from "@/app/store/userStore";

// // // // export default function CreateAssignmentPage() {
// // // //   const router = useRouter();
// // // //   const { user, updateCredits } = useUserStore();

// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState("");

// // // //   const [form, setForm] = useState({
// // // //     schoolName: "",
// // // //     class: "",
// // // //     subject: "",
// // // //     topic: "",
// // // //     totalMarks: "",
// // // //     timeAllowed: "45 minutes",
// // // //     instructions: "",
// // // //     concepts: "",
// // // //     includeHints: true,
// // // //   });

// // // //   const handleChange = (e: any) => {
// // // //     const { name, value, type, checked } = e.target;

// // // //     setForm({
// // // //       ...form,
// // // //       [name]: type === "checkbox" ? checked : value,
// // // //     });
// // // //   };

// // // //   const handleSubmit = async () => {
// // // //     setError("");

// // // //     // ✅ Basic validation
// // // //     if (!form.class || !form.subject || !form.topic || !form.totalMarks) {
// // // //       setError("Please fill all required fields");
// // // //       return;
// // // //     }

// // // //     // ✅ Credits check
// // // //     if (user && user.credits <= 0) {
// // // //       setError("No credits left 🚫");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setLoading(true);

// // // //       const token = localStorage.getItem("token");

// // // //       const payload = {
// // // //         schoolName: form.schoolName,
// // // //         class: form.class,
// // // //         subject: form.subject,
// // // //         topic: form.topic,
// // // //         totalMarks: Number(form.totalMarks),
// // // //         timeAllowed: form.timeAllowed,
// // // //         instructions: form.instructions,
// // // //         concepts: form.concepts
// // // //           .split(",")
// // // //           .map((c) => c.trim())
// // // //           .filter(Boolean),
// // // //         questionTypes: ["theory"],
// // // //         includeHints: form.includeHints,
// // // //       };

// // // //       const res = await axios.post(
// // // //         "http://localhost:5000/api/assignment",
// // // //         payload,
// // // //         {
// // // //           headers: {
// // // //             Authorization: token ? `Bearer ${token}` : "",
// // // //           },
// // // //         }
// // // //       );

// // // //       const data = res.data;

// // // //       // 🔥 update credits locally
// // // //       if (user) {
// // // //         updateCredits(user.credits - 1);
// // // //       }

// // // //       router.push(`/assignment/${data.data.id}`);

// // // //     } catch (err: any) {
// // // //       console.log(err);
// // // //       setError(
// // // //         err?.response?.data?.message || "Something went wrong"
// // // //       );
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="bg-black text-white min-h-screen">
// // // //       <Header />

// // // //       <div className="max-w-3xl mx-auto p-6">

// // // //         <h1 className="text-2xl font-bold mb-6">
// // // //           Create Assignment
// // // //         </h1>

// // // //         {/* 🔴 ERROR */}
// // // //         {error && (
// // // //           <div className="mb-4 bg-red-500/20 text-red-400 p-3 rounded text-sm">
// // // //             {error}
// // // //           </div>
// // // //         )}

// // // //         <div className="grid grid-cols-2 gap-4">

// // // //           <input
// // // //             name="schoolName"
// // // //             placeholder="School Name"
// // // //             onChange={handleChange}
// // // //             className="input"
// // // //           />

// // // //           <input
// // // //             name="class"
// // // //             placeholder="Class *"
// // // //             onChange={handleChange}
// // // //             className="input"
// // // //           />

// // // //           <input
// // // //             name="subject"
// // // //             placeholder="Subject *"
// // // //             onChange={handleChange}
// // // //             className="input"
// // // //           />

// // // //           <input
// // // //             name="topic"
// // // //             placeholder="Topic *"
// // // //             onChange={handleChange}
// // // //             className="input"
// // // //           />

// // // //           <input
// // // //             name="totalMarks"
// // // //             type="number"
// // // //             placeholder="Total Marks *"
// // // //             onChange={handleChange}
// // // //             className="input"
// // // //           />

// // // //           <input
// // // //             name="timeAllowed"
// // // //             placeholder="Time Allowed (e.g. 45 minutes)"
// // // //             onChange={handleChange}
// // // //             className="input"
// // // //           />

// // // //         </div>

// // // //         {/* Concepts */}
// // // //         <div className="mt-4">
// // // //           <input
// // // //             name="concepts"
// // // //             placeholder="Concepts (comma separated)"
// // // //             onChange={handleChange}
// // // //             className="input w-full"
// // // //           />
// // // //         </div>

// // // //         {/* Instructions */}
// // // //         <div className="mt-4">
// // // //           <textarea
// // // //             name="instructions"
// // // //             placeholder="Instructions"
// // // //             onChange={handleChange}
// // // //             className="input w-full h-24"
// // // //           />
// // // //         </div>

// // // //         {/* Hint Toggle */}
// // // //         <div className="mt-4 flex items-center gap-2">
// // // //           <input
// // // //             type="checkbox"
// // // //             name="includeHints"
// // // //             checked={form.includeHints}
// // // //             onChange={handleChange}
// // // //           />
// // // //           <label>Include Hints</label>
// // // //         </div>

// // // //         {/* Submit */}
// // // //         <button
// // // //           onClick={handleSubmit}
// // // //           disabled={loading}
// // // //           className="mt-6 w-full bg-orange-500 py-3 rounded font-semibold hover:opacity-90 disabled:opacity-50"
// // // //         >
// // // //           {loading ? "Generating Paper..." : "Create Assignment"}
// // // //         </button>

// // // //       </div>

// // // //       {/* styling */}
// // // //       <style jsx>{`
// // // //         .input {
// // // //           background: #0b0b0b;
// // // //           border: 1px solid #333;
// // // //           padding: 10px;
// // // //           border-radius: 6px;
// // // //         }
// // // //       `}</style>
// // // //     </div>
// // // //   );
// // // // }



// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useRouter } from "next/navigation";
// // // import axios from "axios";
// // // import { useAuth } from "../hooks/useAuth";
// // // import { useUserStore } from "../store/userStore";
// // // import { getSocket, onAssignmentUpdate } from "../lib/socket";
// // // import Header from "@/components/layout/Header";

// // // // Types
// // // interface AssignmentForm {
// // //   schoolName: string;
// // //   class: string;
// // //   subject: string;
// // //   topic: string;
// // //   totalMarks: number;
// // //   timeAllowed: string;
// // //   dueDate: string;
// // //   instructions: string;
// // //   concepts: string[];
// // //   difficultyLevel: "easy" | "balanced" | "tough";
// // //   questionTypes: string[];
// // //   includeHints: boolean;
// // //   includeAnswers: boolean;
// // //   ensurePassing: boolean;
// // // }

// // // const DIFFICULTY_OPTIONS = [
// // //   { value: "easy", label: "Easy", description: "Basic conceptual questions" },
// // //   { value: "balanced", label: "Balanced", description: "Mix of easy and tough" },
// // //   { value: "tough", label: "Tough", description: "Advanced analytical questions" }
// // // ];

// // // const QUESTION_TYPES = [
// // //   "short", "long", "multiple choice", "fill in blanks", "true false"
// // // ];

// // // export default function CreateAssignmentPage() {
// // //   const router = useRouter();
// // //   const { user, updateCredits } = useUserStore();
// // //   const { isAuthenticated, token } = useAuth();
  
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [conceptInput, setConceptInput] = useState("");
  
// // //   const [form, setForm] = useState<AssignmentForm>({
// // //     schoolName: "",
// // //     class: "",
// // //     subject: "",
// // //     topic: "",
// // //     totalMarks: 50,
// // //     timeAllowed: "45 minutes",
// // //     dueDate: "",
// // //     instructions: "Attempt all questions. Write clearly and concisely.",
// // //     concepts: [],
// // //     difficultyLevel: "balanced",
// // //     questionTypes: ["short", "long"],
// // //     includeHints: false,
// // //     includeAnswers: false,
// // //     ensurePassing: true,
// // //   });

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// // //     const { name, value, type } = e.target;
// // //     setForm(prev => ({
// // //       ...prev,
// // //       [name]: type === "number" ? Number(value) : value,
// // //     }));
// // //   };

// // //   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const { name, checked } = e.target;
// // //     setForm(prev => ({ ...prev, [name]: checked }));
// // //   };

// // //   const handleQuestionTypeToggle = (type: string) => {
// // //     setForm(prev => ({
// // //       ...prev,
// // //       questionTypes: prev.questionTypes.includes(type)
// // //         ? prev.questionTypes.filter(t => t !== type)
// // //         : [...prev.questionTypes, type]
// // //     }));
// // //   };

// // //   const addConcept = () => {
// // //     if (conceptInput.trim() && !form.concepts.includes(conceptInput.trim())) {
// // //       setForm(prev => ({
// // //         ...prev,
// // //         concepts: [...prev.concepts, conceptInput.trim()]
// // //       }));
// // //       setConceptInput("");
// // //     }
// // //   };

// // //   const removeConcept = (concept: string) => {
// // //     setForm(prev => ({
// // //       ...prev,
// // //       concepts: prev.concepts.filter(c => c !== concept)
// // //     }));
// // //   };

// // //   const handleSubmit = async () => {
// // //     setError("");

// // //     // Validation
// // //     if (!form.class || !form.subject || !form.topic || !form.totalMarks) {
// // //       setError("Please fill all required fields");
// // //       return;
// // //     }

// // //     if (form.totalMarks < 10 || form.totalMarks > 200) {
// // //       setError("Total marks should be between 10 and 200");
// // //       return;
// // //     }

// // //     if (!isAuthenticated && user?.credits === undefined) {
// // //       // Guest check
// // //       const guestCredits = localStorage.getItem("guestCredits");
// // //       const credits = guestCredits ? parseInt(guestCredits) : 3;
// // //       if (credits <= 0) {
// // //         setError("Guest credits exhausted. Please login to continue.");
// // //         return;
// // //       }
// // //     } else if (user && user.credits <= 0) {
// // //       setError("No credits left. Please upgrade to continue.");
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);

// // //       const payload = {
// // //         schoolName: form.schoolName || undefined,
// // //         class: form.class,
// // //         subject: form.subject,
// // //         topic: form.topic,
// // //         totalMarks: form.totalMarks,
// // //         timeAllowed: form.timeAllowed,
// // //         dueDate: form.dueDate || undefined,
// // //         instructions: form.instructions,
// // //         concepts: form.concepts,
// // //         difficultyLevel: form.difficultyLevel,
// // //         questionTypes: form.questionTypes,
// // //         includeHints: form.includeHints,
// // //         includeAnswers: form.includeAnswers,
// // //         ensurePassing: form.ensurePassing,
// // //       };

// // //       const response = await axios.post(
// // //         `${process.env.NEXT_PUBLIC_API_URL}/assignment`,
// // //         payload,
// // //         {
// // //           headers: token ? { Authorization: `Bearer ${token}` } : {},
// // //         }
// // //       );

// // //       const { id, status } = response.data.data;

// // //       // Update credits locally
// // //       if (user) {
// // //         updateCredits(user.credits - 1);
// // //       } else {
// // //         // Update guest credits
// // //         const currentCredits = localStorage.getItem("guestCredits");
// // //         const newCredits = (currentCredits ? parseInt(currentCredits) : 3) - 1;
// // //         localStorage.setItem("guestCredits", newCredits.toString());
// // //       }

// // //       // Redirect to assignment page with real-time tracking
// // //       router.push(`/assignment/${id}`);

// // //     } catch (err: any) {
// // //       console.error("Create assignment error:", err);
// // //       setError(err?.response?.data?.message || "Failed to create assignment");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="bg-black text-white min-h-screen">
// // //       <Header />

// // //       <div className="max-w-4xl mx-auto px-4 py-8">
// // //         <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
// // //           Create Assignment
// // //         </h1>
// // //         <p className="text-gray-400 mb-8">
// // //           Fill in the details below to generate an AI-powered exam paper
// // //         </p>

// // //         {/* Error Alert */}
// // //         {error && (
// // //           <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
// // //             {error}
// // //           </div>
// // //         )}

// // //         <div className="space-y-6">
// // //           {/* Basic Info Grid */}
// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //             <input
// // //               name="schoolName"
// // //               placeholder="School Name (Optional)"
// // //               value={form.schoolName}
// // //               onChange={handleChange}
// // //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// // //             />
// // //             <input
// // //               name="class"
// // //               placeholder="Class *"
// // //               value={form.class}
// // //               onChange={handleChange}
// // //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// // //             />
// // //             <input
// // //               name="subject"
// // //               placeholder="Subject *"
// // //               value={form.subject}
// // //               onChange={handleChange}
// // //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// // //             />
// // //             <input
// // //               name="topic"
// // //               placeholder="Topic *"
// // //               value={form.topic}
// // //               onChange={handleChange}
// // //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// // //             />
// // //             <input
// // //               name="totalMarks"
// // //               type="number"
// // //               placeholder="Total Marks * (10-200)"
// // //               value={form.totalMarks}
// // //               onChange={handleChange}
// // //               min={10}
// // //               max={200}
// // //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// // //             />
// // //             <input
// // //               name="timeAllowed"
// // //               placeholder="Time Allowed (e.g., 45 minutes)"
// // //               value={form.timeAllowed}
// // //               onChange={handleChange}
// // //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// // //             />
// // //             <input
// // //               name="dueDate"
// // //               type="datetime-local"
// // //               value={form.dueDate}
// // //               onChange={handleChange}
// // //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// // //             />
// // //           </div>

// // //           {/* Concepts Section */}
// // //           <div className="space-y-2">
// // //             <label className="text-sm font-medium text-gray-300">Key Concepts</label>
// // //             <div className="flex gap-2">
// // //               <input
// // //                 value={conceptInput}
// // //                 onChange={(e) => setConceptInput(e.target.value)}
// // //                 onKeyPress={(e) => e.key === "Enter" && addConcept()}
// // //                 placeholder="Add concepts (e.g., Photosynthesis, Algebra)"
// // //                 className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
// // //               />
// // //               <button
// // //                 onClick={addConcept}
// // //                 className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
// // //               >
// // //                 Add
// // //               </button>
// // //             </div>
// // //             <div className="flex flex-wrap gap-2 mt-2">
// // //               {form.concepts.map((concept) => (
// // //                 <span
// // //                   key={concept}
// // //                   className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
// // //                 >
// // //                   {concept}
// // //                   <button
// // //                     onClick={() => removeConcept(concept)}
// // //                     className="hover:text-white"
// // //                   >
// // //                     ×
// // //                   </button>
// // //                 </span>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           {/* Instructions */}
// // //           <div>
// // //             <label className="text-sm font-medium text-gray-300">Instructions</label>
// // //             <textarea
// // //               name="instructions"
// // //               value={form.instructions}
// // //               onChange={handleChange}
// // //               rows={3}
// // //               className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 mt-1"
// // //             />
// // //           </div>

// // //           {/* Difficulty Level */}
// // //           <div>
// // //             <label className="text-sm font-medium text-gray-300 mb-2 block">Difficulty Level</label>
// // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// // //               {DIFFICULTY_OPTIONS.map((opt) => (
// // //                 <button
// // //                   key={opt.value}
// // //                   onClick={() => setForm(prev => ({ ...prev, difficultyLevel: opt.value as any }))}
// // //                   className={`p-3 rounded-lg border transition text-left ${
// // //                     form.difficultyLevel === opt.value
// // //                       ? "border-orange-500 bg-orange-500/10"
// // //                       : "border-gray-700 hover:border-gray-500"
// // //                   }`}
// // //                 >
// // //                   <div className="font-medium">{opt.label}</div>
// // //                   <div className="text-xs text-gray-400 mt-1">{opt.description}</div>
// // //                 </button>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           {/* Question Types */}
// // //           <div>
// // //             <label className="text-sm font-medium text-gray-300 mb-2 block">Question Types</label>
// // //             <div className="flex flex-wrap gap-2">
// // //               {QUESTION_TYPES.map((type) => (
// // //                 <button
// // //                   key={type}
// // //                   onClick={() => handleQuestionTypeToggle(type)}
// // //                   className={`px-3 py-1.5 rounded-full text-sm transition ${
// // //                     form.questionTypes.includes(type)
// // //                       ? "bg-orange-500 text-white"
// // //                       : "bg-gray-800 text-gray-400 hover:bg-gray-700"
// // //                   }`}
// // //                 >
// // //                   {type}
// // //                 </button>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           {/* Options */}
// // //           <div className="space-y-2">
// // //             <label className="flex items-center gap-3 cursor-pointer">
// // //               <input
// // //                 type="checkbox"
// // //                 name="includeHints"
// // //                 checked={form.includeHints}
// // //                 onChange={handleCheckboxChange}
// // //                 className="w-4 h-4"
// // //               />
// // //               <span className="text-gray-300">Include hints for tough questions</span>
// // //             </label>
// // //             <label className="flex items-center gap-3 cursor-pointer">
// // //               <input
// // //                 type="checkbox"
// // //                 name="includeAnswers"
// // //                 checked={form.includeAnswers}
// // //                 onChange={handleCheckboxChange}
// // //                 className="w-4 h-4"
// // //               />
// // //               <span className="text-gray-300">Include answer key</span>
// // //             </label>
// // //             <label className="flex items-center gap-3 cursor-pointer">
// // //               <input
// // //                 type="checkbox"
// // //                 name="ensurePassing"
// // //                 checked={form.ensurePassing}
// // //                 onChange={handleCheckboxChange}
// // //                 className="w-4 h-4"
// // //               />
// // //               <span className="text-gray-300">Ensure passing marks distribution</span>
// // //             </label>
// // //           </div>

// // //           {/* Credit Info */}
// // //           <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
// // //             <div className="flex justify-between items-center">
// // //               <div>
// // //                 <span className="text-gray-400">Credits remaining:</span>
// // //                 <span className="ml-2 text-orange-400 font-bold">
// // //                   {user ? user.credits : (() => {
// // //                     const guestCredits = localStorage.getItem("guestCredits");
// // //                     return guestCredits ? parseInt(guestCredits) : 3;
// // //                   })()}
// // //                 </span>
// // //               </div>
// // //               {!user && (
// // //                 <button
// // //                   onClick={() => router.push("/login")}
// // //                   className="text-sm text-orange-400 hover:underline"
// // //                 >
// // //                   Login for 30 credits →
// // //                 </button>
// // //               )}
// // //             </div>
// // //           </div>

// // //           {/* Submit Button */}
// // //           <button
// // //             onClick={handleSubmit}
// // //             disabled={loading}
// // //             className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
// // //           >
// // //             {loading ? (
// // //               <span className="flex items-center justify-center gap-2">
// // //                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
// // //                 Generating Assignment...
// // //               </span>
// // //             ) : (
// // //               "Create Assignment"
// // //             )}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import axios from "axios";
// // import { useAuth } from "../hooks/useAuth";
// // import { useUserStore } from "../store/userStore";
// // import Header from "@/components/layout/Header";
// // import toast from "react-hot-toast";

// // // Types
// // interface AssignmentForm {
// //   schoolName: string;
// //   class: string;
// //   subject: string;
// //   topic: string;
// //   totalMarks: number;
// //   timeAllowed: string;
// //   dueDate: string;
// //   instructions: string;
// //   concepts: string[];
// //   difficultyLevel: "easy" | "balanced" | "tough";
// //   questionTypes: string[];
// //   includeHints: boolean;
// //   includeAnswers: boolean;
// //   ensurePassing: boolean;
// // }

// // const DIFFICULTY_OPTIONS = [
// //   { value: "easy", label: "Easy", description: "Basic conceptual questions" },
// //   { value: "balanced", label: "Balanced", description: "Mix of easy and tough" },
// //   { value: "tough", label: "Tough", description: "Advanced analytical questions" }
// // ];

// // const QUESTION_TYPES = [
// //   "short", "long", "multiple choice", "fill in blanks", "true false"
// // ];

// // // Helper: Get or create guest session ID
// // const getOrCreateSessionId = () => {
// //   let sessionId = localStorage.getItem("guest_session_id");
// //   if (!sessionId) {
// //     sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// //     localStorage.setItem("guest_session_id", sessionId);
// //   }
// //   return sessionId;
// // };

// // export default function CreateAssignmentPage() {
// //   const router = useRouter();
// //   const { user, updateCredits } = useUserStore();
// //   const { isAuthenticated, token } = useAuth();
  
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [conceptInput, setConceptInput] = useState("");
// //   const [guestCredits, setGuestCredits] = useState<number | null>(null);
  
// //   const [form, setForm] = useState<AssignmentForm>({
// //     schoolName: "",
// //     class: "",
// //     subject: "",
// //     topic: "",
// //     totalMarks: 50,
// //     timeAllowed: "45 minutes",
// //     dueDate: "",
// //     instructions: "Attempt all questions. Write clearly and concisely.",
// //     concepts: [],
// //     difficultyLevel: "balanced",
// //     questionTypes: ["short", "long"],
// //     includeHints: false,
// //     includeAnswers: false,
// //     ensurePassing: true,
// //   });

// //   // Fetch guest credits on mount
// //   useEffect(() => {
// //     if (!isAuthenticated) {
// //       const fetchGuestCredits = async () => {
// //         try {
// //           const sessionId = getOrCreateSessionId();
// //           const response = await axios.get(
// //             `${process.env.NEXT_PUBLIC_API_URL}/guest/credits`,
// //             { headers: { "x-session-id": sessionId } }
// //           );
// //           setGuestCredits(response.data.credits);
// //         } catch (err) {
// //           console.error("Failed to fetch guest credits:", err);
// //           setGuestCredits(3);
// //         }
// //       };
// //       fetchGuestCredits();
// //     }
// //   }, [isAuthenticated]);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value, type } = e.target;
// //     setForm(prev => ({
// //       ...prev,
// //       [name]: type === "number" ? Number(value) : value,
// //     }));
// //   };

// //   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, checked } = e.target;
// //     setForm(prev => ({ ...prev, [name]: checked }));
// //   };

// //   const handleQuestionTypeToggle = (type: string) => {
// //     setForm(prev => ({
// //       ...prev,
// //       questionTypes: prev.questionTypes.includes(type)
// //         ? prev.questionTypes.filter(t => t !== type)
// //         : [...prev.questionTypes, type]
// //     }));
// //   };

// //   const addConcept = () => {
// //     if (conceptInput.trim() && !form.concepts.includes(conceptInput.trim())) {
// //       setForm(prev => ({
// //         ...prev,
// //         concepts: [...prev.concepts, conceptInput.trim()]
// //       }));
// //       setConceptInput("");
// //     }
// //   };

// //   const removeConcept = (concept: string) => {
// //     setForm(prev => ({
// //       ...prev,
// //       concepts: prev.concepts.filter(c => c !== concept)
// //     }));
// //   };

// //   const handleSubmit = async () => {
// //     setError("");

// //     // Validation
// //     if (!form.class || !form.subject || !form.topic || !form.totalMarks) {
// //       setError("Please fill all required fields");
// //       return;
// //     }

// //     if (form.totalMarks < 10 || form.totalMarks > 200) {
// //       setError("Total marks should be between 10 and 200");
// //       return;
// //     }

// //     // Credit check
// //     if (!isAuthenticated) {
// //       const credits = guestCredits !== null ? guestCredits : 3;
// //       if (credits <= 0) {
// //         setError("Guest credits exhausted. Please login to continue.");
// //         return;
// //       }
// //     } else if (user && user.credits <= 0) {
// //       setError("No credits left. Please upgrade to continue.");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const sessionId = !isAuthenticated ? getOrCreateSessionId() : undefined;

// //       const payload = {
// //         schoolName: form.schoolName || undefined,
// //         class: form.class,
// //         subject: form.subject,
// //         topic: form.topic,
// //         totalMarks: form.totalMarks,
// //         timeAllowed: form.timeAllowed,
// //         dueDate: form.dueDate || undefined,
// //         instructions: form.instructions,
// //         concepts: form.concepts,
// //         difficultyLevel: form.difficultyLevel,
// //         questionTypes: form.questionTypes,
// //         includeHints: form.includeHints,
// //         includeAnswers: form.includeAnswers,
// //         ensurePassing: form.ensurePassing,
// //       };

// //       const response = await axios.post(
// //         `${process.env.NEXT_PUBLIC_API_URL}/assignment`,
// //         payload,
// //         {
// //           headers: {
// //             ...(token && { Authorization: `Bearer ${token}` }),
// //             ...(sessionId && { "x-session-id": sessionId }),
// //           },
// //         }
// //       );

// //       const { id } = response.data.data;

// //       // Update credits locally
// //       if (user) {
// //         updateCredits(user.credits - 1);
// //       } else if (guestCredits !== null) {
// //         setGuestCredits(guestCredits - 1);
// //         // Store in localStorage for quick display
// //         localStorage.setItem("guestCredits", (guestCredits - 1).toString());
// //       }

// //       toast.success("Assignment created! Redirecting...");
// //       router.push(`/assignment/${id}`);

// //     } catch (err: any) {
// //       console.error("Create assignment error:", err);
// //       const errorMsg = err?.response?.data?.message || "Failed to create assignment";
// //       setError(errorMsg);
// //       toast.error(errorMsg);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Get current credits display
// //   const getCurrentCredits = () => {
// //     if (user) return user.credits;
// //     if (guestCredits !== null) return guestCredits;
// //     return 3;
// //   };

// //   return (
// //     <div className="bg-black text-white min-h-screen">
// //       <Header />

// //       <div className="max-w-4xl mx-auto px-4 py-8">
// //         <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
// //           Create Assignment
// //         </h1>
// //         <p className="text-gray-400 mb-8">
// //           Fill in the details below to generate an AI-powered exam paper
// //         </p>

// //         {/* Error Alert */}
// //         {error && (
// //           <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
// //             {error}
// //           </div>
// //         )}

// //         <div className="space-y-6">
// //           {/* Basic Info Grid */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <input
// //               name="schoolName"
// //               placeholder="School Name (Optional)"
// //               value={form.schoolName}
// //               onChange={handleChange}
// //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// //             />
// //             <input
// //               name="class"
// //               placeholder="Class *"
// //               value={form.class}
// //               onChange={handleChange}
// //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// //             />
// //             <input
// //               name="subject"
// //               placeholder="Subject *"
// //               value={form.subject}
// //               onChange={handleChange}
// //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// //             />
// //             <input
// //               name="topic"
// //               placeholder="Topic *"
// //               value={form.topic}
// //               onChange={handleChange}
// //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// //             />
// //             <input
// //               name="totalMarks"
// //               type="number"
// //               placeholder="Total Marks * (10-200)"
// //               value={form.totalMarks}
// //               onChange={handleChange}
// //               min={10}
// //               max={200}
// //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// //             />
// //             <input
// //               name="timeAllowed"
// //               placeholder="Time Allowed (e.g., 45 minutes)"
// //               value={form.timeAllowed}
// //               onChange={handleChange}
// //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// //             />
// //             <input
// //               name="dueDate"
// //               type="datetime-local"
// //               value={form.dueDate}
// //               onChange={handleChange}
// //               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
// //             />
// //           </div>

// //           {/* Concepts Section */}
// //           <div className="space-y-2">
// //             <label className="text-sm font-medium text-gray-300">Key Concepts</label>
// //             <div className="flex gap-2">
// //               <input
// //                 value={conceptInput}
// //                 onChange={(e) => setConceptInput(e.target.value)}
// //                 onKeyPress={(e) => e.key === "Enter" && addConcept()}
// //                 placeholder="Add concepts (e.g., Photosynthesis, Algebra)"
// //                 className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
// //               />
// //               <button
// //                 onClick={addConcept}
// //                 className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
// //               >
// //                 Add
// //               </button>
// //             </div>
// //             <div className="flex flex-wrap gap-2 mt-2">
// //               {form.concepts.map((concept) => (
// //                 <span
// //                   key={concept}
// //                   className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
// //                 >
// //                   {concept}
// //                   <button
// //                     onClick={() => removeConcept(concept)}
// //                     className="hover:text-white"
// //                   >
// //                     ×
// //                   </button>
// //                 </span>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Instructions */}
// //           <div>
// //             <label className="text-sm font-medium text-gray-300">Instructions</label>
// //             <textarea
// //               name="instructions"
// //               value={form.instructions}
// //               onChange={handleChange}
// //               rows={3}
// //               className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 mt-1"
// //             />
// //           </div>

// //           {/* Difficulty Level */}
// //           <div>
// //             <label className="text-sm font-medium text-gray-300 mb-2 block">Difficulty Level</label>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// //               {DIFFICULTY_OPTIONS.map((opt) => (
// //                 <button
// //                   key={opt.value}
// //                   onClick={() => setForm(prev => ({ ...prev, difficultyLevel: opt.value as any }))}
// //                   className={`p-3 rounded-lg border transition text-left ${
// //                     form.difficultyLevel === opt.value
// //                       ? "border-orange-500 bg-orange-500/10"
// //                       : "border-gray-700 hover:border-gray-500"
// //                   }`}
// //                 >
// //                   <div className="font-medium">{opt.label}</div>
// //                   <div className="text-xs text-gray-400 mt-1">{opt.description}</div>
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Question Types */}
// //           <div>
// //             <label className="text-sm font-medium text-gray-300 mb-2 block">Question Types</label>
// //             <div className="flex flex-wrap gap-2">
// //               {QUESTION_TYPES.map((type) => (
// //                 <button
// //                   key={type}
// //                   onClick={() => handleQuestionTypeToggle(type)}
// //                   className={`px-3 py-1.5 rounded-full text-sm transition ${
// //                     form.questionTypes.includes(type)
// //                       ? "bg-orange-500 text-white"
// //                       : "bg-gray-800 text-gray-400 hover:bg-gray-700"
// //                   }`}
// //                 >
// //                   {type}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Options */}
// //           <div className="space-y-2">
// //             <label className="flex items-center gap-3 cursor-pointer">
// //               <input
// //                 type="checkbox"
// //                 name="includeHints"
// //                 checked={form.includeHints}
// //                 onChange={handleCheckboxChange}
// //                 className="w-4 h-4"
// //               />
// //               <span className="text-gray-300">Include hints for tough questions</span>
// //             </label>
// //             <label className="flex items-center gap-3 cursor-pointer">
// //               <input
// //                 type="checkbox"
// //                 name="includeAnswers"
// //                 checked={form.includeAnswers}
// //                 onChange={handleCheckboxChange}
// //                 className="w-4 h-4"
// //               />
// //               <span className="text-gray-300">Include answer key</span>
// //             </label>
// //             <label className="flex items-center gap-3 cursor-pointer">
// //               <input
// //                 type="checkbox"
// //                 name="ensurePassing"
// //                 checked={form.ensurePassing}
// //                 onChange={handleCheckboxChange}
// //                 className="w-4 h-4"
// //               />
// //               <span className="text-gray-300">Ensure passing marks distribution</span>
// //             </label>
// //           </div>

// //           {/* Credit Info */}
// //           <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
// //             <div className="flex justify-between items-center">
// //               <div>
// //                 <span className="text-gray-400">Credits remaining:</span>
// //                 <span className="ml-2 text-orange-400 font-bold">
// //                   {getCurrentCredits()}
// //                 </span>
// //               </div>
// //               {!user && (
// //                 <button
// //                   onClick={() => router.push("/login")}
// //                   className="text-sm text-orange-400 hover:underline"
// //                 >
// //                   Login for 30 credits →
// //                 </button>
// //               )}
// //             </div>
// //           </div>

// //           {/* Submit Button */}
// //           <button
// //             onClick={handleSubmit}
// //             disabled={loading || getCurrentCredits() <= 0}
// //             className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             {loading ? (
// //               <span className="flex items-center justify-center gap-2">
// //                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
// //                 Generating Assignment...
// //               </span>
// //             ) : (
// //               "Create Assignment"
// //             )}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }







// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useAuth } from "../hooks/useAuth";
// import { useUserStore } from "../store/userStore";
// import Header from "@/components/layout/Header";
// import toast from "react-hot-toast";

// // Types
// interface AssignmentForm {
//   schoolName: string;
//   class: string;
//   subject: string;
//   topic: string;
//   totalMarks: number;
//   timeAllowed: string;
//   dueDate: string;
//   instructions: string;
//   concepts: string[];
//   difficultyLevel: "easy" | "balanced" | "tough";
//   questionTypes: string[];
//   includeHints: boolean;
//   includeAnswers: boolean;
//   ensurePassing: boolean;
// }

// const DIFFICULTY_OPTIONS = [
//   { value: "easy", label: "Easy", description: "Basic conceptual questions" },
//   { value: "balanced", label: "Balanced", description: "Mix of easy and tough" },
//   { value: "tough", label: "Tough", description: "Advanced analytical questions" }
// ];

// const QUESTION_TYPES = [
//   "short", "long", "multiple choice", "fill in blanks", "true false"
// ];

// // Helper: Get or create guest session ID
// const getOrCreateSessionId = () => {
//   let sessionId = localStorage.getItem("guest_session_id");
//   if (!sessionId) {
//     sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     localStorage.setItem("guest_session_id", sessionId);
//   }
//   return sessionId;
// };

// export default function CreateAssignmentPage() {
//   const router = useRouter();
//   const { user, updateCredits } = useUserStore();
//   const { isAuthenticated, token } = useAuth();
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [conceptInput, setConceptInput] = useState("");
//   const [guestCredits, setGuestCredits] = useState<number | null>(null);
  
//   const [form, setForm] = useState<AssignmentForm>({
//     schoolName: "",
//     class: "",
//     subject: "",
//     topic: "",
//     totalMarks: 50,
//     timeAllowed: "45 minutes",
//     dueDate: "",
//     instructions: "Attempt all questions. Write clearly and concisely.",
//     concepts: [],
//     difficultyLevel: "balanced",
//     questionTypes: ["short", "long"],
//     includeHints: false,
//     includeAnswers: false,
//     ensurePassing: true,
//   });

//   // Fetch guest credits on mount
//   useEffect(() => {
//     if (!isAuthenticated) {
//       const fetchGuestCredits = async () => {
//         try {
//           const sessionId = getOrCreateSessionId();
//           const response = await axios.get(
//             `${process.env.NEXT_PUBLIC_API_URL}/guest/credits`,
//             { headers: { "x-session-id": sessionId } }
//           );
//           setGuestCredits(response.data.credits);
//         } catch (err) {
//           console.error("Failed to fetch guest credits:", err);
//           setGuestCredits(3);
//         }
//       };
//       fetchGuestCredits();
//     }
//   }, [isAuthenticated]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: type === "number" ? Number(value) : value,
//     }));
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setForm(prev => ({ ...prev, [name]: checked }));
//   };

//   const handleQuestionTypeToggle = (type: string) => {
//     setForm(prev => ({
//       ...prev,
//       questionTypes: prev.questionTypes.includes(type)
//         ? prev.questionTypes.filter(t => t !== type)
//         : [...prev.questionTypes, type]
//     }));
//   };

//   const addConcept = () => {
//     if (conceptInput.trim() && !form.concepts.includes(conceptInput.trim())) {
//       setForm(prev => ({
//         ...prev,
//         concepts: [...prev.concepts, conceptInput.trim()]
//       }));
//       setConceptInput("");
//     }
//   };

//   const removeConcept = (concept: string) => {
//     setForm(prev => ({
//       ...prev,
//       concepts: prev.concepts.filter(c => c !== concept)
//     }));
//   };

//   const handleSubmit = async () => {
//     setError("");

//     // Validation
//     if (!form.class || !form.subject || !form.topic || !form.totalMarks) {
//       setError("Please fill all required fields");
//       return;
//     }

//     if (form.totalMarks < 10 || form.totalMarks > 200) {
//       setError("Total marks should be between 10 and 200");
//       return;
//     }

//     // Credit check
//     if (!isAuthenticated) {
//       const credits = guestCredits !== null ? guestCredits : 3;
//       if (credits <= 0) {
//         setError("Guest credits exhausted. Please login to continue.");
//         return;
//       }
//     } else if (user && user.credits <= 0) {
//       setError("No credits left. Please upgrade to continue.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const sessionId = !isAuthenticated ? getOrCreateSessionId() : undefined;

//       // ✅ FIX: Format dueDate to ISO string for backend validation
//       let formattedDueDate = undefined;
//       if (form.dueDate) {
//         try {
//           const date = new Date(form.dueDate);
//           if (!isNaN(date.getTime())) {
//             formattedDueDate = date.toISOString();
//           }
//         } catch (e) {
//           console.error("Invalid date format:", form.dueDate);
//         }
//       }

//       const payload = {
//         schoolName: form.schoolName || undefined,
//         class: form.class,
//         subject: form.subject,
//         topic: form.topic,
//         totalMarks: form.totalMarks,
//         timeAllowed: form.timeAllowed,
//         dueDate: formattedDueDate,  // ✅ FIXED: ISO format
//         instructions: form.instructions,
//         concepts: form.concepts,
//         difficultyLevel: form.difficultyLevel,
//         questionTypes: form.questionTypes,
//         includeHints: form.includeHints,
//         includeAnswers: form.includeAnswers,
//         ensurePassing: form.ensurePassing,
//       };

//       console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/assignment`,
//         payload,
//         {
//           headers: {
//             ...(token && { Authorization: `Bearer ${token}` }),
//             ...(sessionId && { "x-session-id": sessionId }),
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const { id } = response.data.data;

//       // Update credits locally
//       if (user) {
//         updateCredits(user.credits - 1);
//       } else if (guestCredits !== null) {
//         setGuestCredits(guestCredits - 1);
//         localStorage.setItem("guestCredits", (guestCredits - 1).toString());
//       }

//       toast.success("Assignment created! Redirecting...");
//       router.push(`/assignment/${id}`);

//     } catch (err: any) {
//       console.error("Create assignment error:", err);
//       console.error("Response data:", err?.response?.data);
      
//       // Show detailed validation errors
//       if (err?.response?.data?.errors) {
//         const validationErrors = err.response.data.errors;
//         const errorMessages = Object.values(validationErrors).flat().join(", ");
//         setError(`Validation failed: ${errorMessages}`);
//         toast.error(`Validation failed: ${errorMessages}`);
//       } else {
//         const errorMsg = err?.response?.data?.message || "Failed to create assignment";
//         setError(errorMsg);
//         toast.error(errorMsg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get current credits display
//   const getCurrentCredits = () => {
//     if (user) return user.credits;
//     if (guestCredits !== null) return guestCredits;
//     return 3;
//   };

//   return (
//     <div className="bg-black text-white min-h-screen">
//       <Header />

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
//           Create Assignment
//         </h1>
//         <p className="text-gray-400 mb-8">
//           Fill in the details below to generate an AI-powered exam paper
//         </p>

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
//             {error}
//           </div>
//         )}

//         <div className="space-y-6">
//           {/* Basic Info Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               name="schoolName"
//               placeholder="School Name (Optional)"
//               value={form.schoolName}
//               onChange={handleChange}
//               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
//             />
//             <input
//               name="class"
//               placeholder="Class *"
//               value={form.class}
//               onChange={handleChange}
//               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
//             />
//             <input
//               name="subject"
//               placeholder="Subject *"
//               value={form.subject}
//               onChange={handleChange}
//               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
//             />
//             <input
//               name="topic"
//               placeholder="Topic *"
//               value={form.topic}
//               onChange={handleChange}
//               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
//             />
//             <input
//               name="totalMarks"
//               type="number"
//               placeholder="Total Marks * (10-200)"
//               value={form.totalMarks}
//               onChange={handleChange}
//               min={10}
//               max={200}
//               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
//             />
//             <input
//               name="timeAllowed"
//               placeholder="Time Allowed (e.g., 45 minutes)"
//               value={form.timeAllowed}
//               onChange={handleChange}
//               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
//             />
//             <input
//               name="dueDate"
//               type="datetime-local"
//               value={form.dueDate}
//               onChange={handleChange}
//               className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
//             />
//           </div>

//           {/* Concepts Section */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-300">Key Concepts</label>
//             <div className="flex gap-2">
//               <input
//                 value={conceptInput}
//                 onChange={(e) => setConceptInput(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && addConcept()}
//                 placeholder="Add concepts (e.g., Photosynthesis, Algebra)"
//                 className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
//               />
//               <button
//                 onClick={addConcept}
//                 className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
//               >
//                 Add
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {form.concepts.map((concept) => (
//                 <span
//                   key={concept}
//                   className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
//                 >
//                   {concept}
//                   <button
//                     onClick={() => removeConcept(concept)}
//                     className="hover:text-white"
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Instructions */}
//           <div>
//             <label className="text-sm font-medium text-gray-300">Instructions</label>
//             <textarea
//               name="instructions"
//               value={form.instructions}
//               onChange={handleChange}
//               rows={3}
//               className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 mt-1"
//             />
//           </div>

//           {/* Difficulty Level */}
//           <div>
//             <label className="text-sm font-medium text-gray-300 mb-2 block">Difficulty Level</label>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//               {DIFFICULTY_OPTIONS.map((opt) => (
//                 <button
//                   key={opt.value}
//                   onClick={() => setForm(prev => ({ ...prev, difficultyLevel: opt.value as any }))}
//                   className={`p-3 rounded-lg border transition text-left ${
//                     form.difficultyLevel === opt.value
//                       ? "border-orange-500 bg-orange-500/10"
//                       : "border-gray-700 hover:border-gray-500"
//                   }`}
//                 >
//                   <div className="font-medium">{opt.label}</div>
//                   <div className="text-xs text-gray-400 mt-1">{opt.description}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Question Types */}
//           <div>
//             <label className="text-sm font-medium text-gray-300 mb-2 block">Question Types</label>
//             <div className="flex flex-wrap gap-2">
//               {QUESTION_TYPES.map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => handleQuestionTypeToggle(type)}
//                   className={`px-3 py-1.5 rounded-full text-sm transition ${
//                     form.questionTypes.includes(type)
//                       ? "bg-orange-500 text-white"
//                       : "bg-gray-800 text-gray-400 hover:bg-gray-700"
//                   }`}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Options */}
//           <div className="space-y-2">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="includeHints"
//                 checked={form.includeHints}
//                 onChange={handleCheckboxChange}
//                 className="w-4 h-4"
//               />
//               <span className="text-gray-300">Include hints for tough questions</span>
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="includeAnswers"
//                 checked={form.includeAnswers}
//                 onChange={handleCheckboxChange}
//                 className="w-4 h-4"
//               />
//               <span className="text-gray-300">Include answer key</span>
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="ensurePassing"
//                 checked={form.ensurePassing}
//                 onChange={handleCheckboxChange}
//                 className="w-4 h-4"
//               />
//               <span className="text-gray-300">Ensure passing marks distribution</span>
//             </label>
//           </div>

//           {/* Credit Info */}
//           <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
//             <div className="flex justify-between items-center">
//               <div>
//                 <span className="text-gray-400">Credits remaining:</span>
//                 <span className="ml-2 text-orange-400 font-bold">
//                   {getCurrentCredits()}
//                 </span>
//               </div>
//               {!user && (
//                 <button
//                   onClick={() => router.push("/login")}
//                   className="text-sm text-orange-400 hover:underline"
//                 >
//                   Login for 30 credits →
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             disabled={loading || getCurrentCredits() <= 0}
//             className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Generating Assignment...
//               </span>
//             ) : (
//               "Create Assignment"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../store/userStore";
import Header from "@/components/layout/Header";
import toast from "react-hot-toast";

// Types
interface AssignmentForm {
  schoolName: string;
  class: string;
  subject: string;
  topic: string;
  totalMarks: number;
  timeAllowed: string;
  dueDate: string;
  instructions: string;
  concepts: string[];
  difficultyLevel: "easy" | "balanced" | "tough";
  questionTypes: string[];
  includeHints: boolean;
  includeAnswers: boolean;
  ensurePassing: boolean;
}

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy", description: "Basic conceptual questions" },
  { value: "balanced", label: "Balanced", description: "Mix of easy and tough" },
  { value: "tough", label: "Tough", description: "Advanced analytical questions" }
];

const QUESTION_TYPES = [
  "short", "long", "multiple choice", "fill in blanks", "true false"
];

// Helper: Get or create guest session ID
const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem("guest_session_id");
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("guest_session_id", sessionId);
  }
  return sessionId;
};

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { user, updateCredits } = useUserStore();
  const { isAuthenticated, token } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [conceptInput, setConceptInput] = useState("");
  const [guestCredits, setGuestCredits] = useState<number | null>(null);
  
  const [form, setForm] = useState<AssignmentForm>({
    schoolName: "",
    class: "",
    subject: "",
    topic: "",
    totalMarks: 50,
    timeAllowed: "45 minutes",
    dueDate: "",
    instructions: "Attempt all questions. Write clearly and concisely.",
    concepts: [],
    difficultyLevel: "balanced",
    questionTypes: ["short", "long"],
    includeHints: false,
    includeAnswers: false,
    ensurePassing: true,
  });

  // Fetch guest credits on mount - with localStorage persistence
  useEffect(() => {
    if (!isAuthenticated) {
      const fetchGuestCredits = async () => {
        try {
          const sessionId = getOrCreateSessionId();
          
          // First check localStorage for cached credits
          const cachedCredits = localStorage.getItem("guestCredits");
          if (cachedCredits !== null && !isNaN(parseInt(cachedCredits))) {
            const credits = parseInt(cachedCredits);
            console.log("📦 Using cached guest credits:", credits);
            setGuestCredits(credits);
            return;
          }
          
          // Otherwise fetch from backend
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/guest/credits`,
            { headers: { "x-session-id": sessionId } }
          );
          
          console.log("🔄 Fetched fresh guest credits:", response.data.credits);
          setGuestCredits(response.data.credits);
          localStorage.setItem("guestCredits", response.data.credits.toString());
          
        } catch (err) {
          console.error("Failed to fetch guest credits:", err);
          // Fallback to localStorage or default
          const fallbackCredits = localStorage.getItem("guestCredits");
          if (fallbackCredits) {
            setGuestCredits(parseInt(fallbackCredits));
          } else {
            setGuestCredits(3);
            localStorage.setItem("guestCredits", "3");
          }
        }
      };
      fetchGuestCredits();
    }
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleQuestionTypeToggle = (type: string) => {
    setForm(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type]
    }));
  };

  const addConcept = () => {
    if (conceptInput.trim() && !form.concepts.includes(conceptInput.trim())) {
      setForm(prev => ({
        ...prev,
        concepts: [...prev.concepts, conceptInput.trim()]
      }));
      setConceptInput("");
    }
  };

  const removeConcept = (concept: string) => {
    setForm(prev => ({
      ...prev,
      concepts: prev.concepts.filter(c => c !== concept)
    }));
  };

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!form.class || !form.subject || !form.topic || !form.totalMarks) {
      setError("Please fill all required fields");
      return;
    }

    if (form.totalMarks < 10 || form.totalMarks > 200) {
      setError("Total marks should be between 10 and 200");
      return;
    }

    // Credit check
    if (!isAuthenticated) {
      const credits = guestCredits !== null ? guestCredits : 3;
      if (credits <= 0) {
        setError("Guest credits exhausted. Please login to continue.");
        return;
      }
    } else if (user && user.credits <= 0) {
      setError("No credits left. Please upgrade to continue.");
      return;
    }

    try {
      setLoading(true);

      const sessionId = !isAuthenticated ? getOrCreateSessionId() : undefined;

      // Format dueDate to ISO string for backend validation
      let formattedDueDate = undefined;
      if (form.dueDate) {
        try {
          const date = new Date(form.dueDate);
          if (!isNaN(date.getTime())) {
            formattedDueDate = date.toISOString();
          }
        } catch (e) {
          console.error("Invalid date format:", form.dueDate);
        }
      }

      const payload = {
        schoolName: form.schoolName || undefined,
        class: form.class,
        subject: form.subject,
        topic: form.topic,
        totalMarks: form.totalMarks,
        timeAllowed: form.timeAllowed,
        dueDate: formattedDueDate,
        instructions: form.instructions,
        concepts: form.concepts,
        difficultyLevel: form.difficultyLevel,
        questionTypes: form.questionTypes,
        includeHints: form.includeHints,
        includeAnswers: form.includeAnswers,
        ensurePassing: form.ensurePassing,
      };

      console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/assignment`,
        payload,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(sessionId && { "x-session-id": sessionId }),
            "Content-Type": "application/json",
          },
        }
      );

      const { id } = response.data.data;

      // Update credits locally with persistence
      if (user) {
        updateCredits(user.credits - 1);
      } else if (guestCredits !== null) {
        const newCredits = guestCredits - 1;
        setGuestCredits(newCredits);
        localStorage.setItem("guestCredits", newCredits.toString());
        console.log("✅ Guest credits updated to:", newCredits);
      }

      toast.success("Assignment created! Redirecting...");
      router.push(`/assignment/${id}`);

    } catch (err: any) {
      console.error("Create assignment error:", err);
      console.error("Response data:", err?.response?.data);
      
      // Show detailed validation errors
      if (err?.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat().join(", ");
        setError(`Validation failed: ${errorMessages}`);
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        const errorMsg = err?.response?.data?.message || "Failed to create assignment";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get current credits display
  const getCurrentCredits = () => {
    if (user) return user.credits;
    if (guestCredits !== null) return guestCredits;
    return 3;
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Create Assignment
        </h1>
        <p className="text-gray-400 mb-8">
          Fill in the details below to generate an AI-powered exam paper
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="schoolName"
              placeholder="School Name (Optional)"
              value={form.schoolName}
              onChange={handleChange}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
            />
            <input
              name="class"
              placeholder="Class *"
              value={form.class}
              onChange={handleChange}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
            />
            <input
              name="subject"
              placeholder="Subject *"
              value={form.subject}
              onChange={handleChange}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
            />
            <input
              name="topic"
              placeholder="Topic *"
              value={form.topic}
              onChange={handleChange}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
            />
            <input
              name="totalMarks"
              type="number"
              placeholder="Total Marks * (10-200)"
              value={form.totalMarks}
              onChange={handleChange}
              min={10}
              max={200}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
            />
            <input
              name="timeAllowed"
              placeholder="Time Allowed (e.g., 45 minutes)"
              value={form.timeAllowed}
              onChange={handleChange}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
            />
            <input
              name="dueDate"
              type="datetime-local"
              value={form.dueDate}
              onChange={handleChange}
              className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Concepts Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Key Concepts</label>
            <div className="flex gap-2">
              <input
                value={conceptInput}
                onChange={(e) => setConceptInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addConcept()}
                placeholder="Add concepts (e.g., Photosynthesis, Algebra)"
                className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={addConcept}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.concepts.map((concept) => (
                <span
                  key={concept}
                  className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {concept}
                  <button
                    onClick={() => removeConcept(concept)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-sm font-medium text-gray-300">Instructions</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 mt-1"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Difficulty Level</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm(prev => ({ ...prev, difficultyLevel: opt.value as any }))}
                  className={`p-3 rounded-lg border transition text-left ${
                    form.difficultyLevel === opt.value
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Types */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Question Types</label>
            <div className="flex flex-wrap gap-2">
              {QUESTION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleQuestionTypeToggle(type)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${
                    form.questionTypes.includes(type)
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="includeHints"
                checked={form.includeHints}
                onChange={handleCheckboxChange}
                className="w-4 h-4"
              />
              <span className="text-gray-300">Include hints for tough questions</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="includeAnswers"
                checked={form.includeAnswers}
                onChange={handleCheckboxChange}
                className="w-4 h-4"
              />
              <span className="text-gray-300">Include answer key</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="ensurePassing"
                checked={form.ensurePassing}
                onChange={handleCheckboxChange}
                className="w-4 h-4"
              />
              <span className="text-gray-300">Ensure passing marks distribution</span>
            </label>
          </div>

          {/* Credit Info */}
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-400">Credits remaining:</span>
                <span className="ml-2 text-orange-400 font-bold">
                  {getCurrentCredits()}
                </span>
              </div>
              {!user && (
                <button
                  onClick={() => router.push("/login")}
                  className="text-sm text-orange-400 hover:underline"
                >
                  Login for 30 credits →
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || getCurrentCredits() <= 0}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Assignment...
              </span>
            ) : (
              "Create Assignment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}