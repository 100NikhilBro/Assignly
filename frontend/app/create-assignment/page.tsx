// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useAuth } from "../hooks/useAuth";
// import { useUserStore } from "../store/userStore";
// import Header from "@/components/layout/Header";
// import toast from "react-hot-toast";
// import { 
//   Plus, 
//   X, 
//   Star, 
//   Loader2, 
//   AlertCircle,
//   BookOpen,
//   Target,
//   Sparkles,
//   Clock,
//   Calendar,
//   School,
//   GraduationCap,
//   BookMarked,
//   ListChecks,
//   Lightbulb,
//   KeyRound,
//   CheckCircle,
//   FileText,
//   Hash,
//   Type
// } from "lucide-react";

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
//   { value: "easy", label: "Easy", description: "Basic conceptual questions", icon: BookOpen },
//   { value: "balanced", label: "Balanced", description: "Mix of easy and tough", icon: Target },
//   { value: "tough", label: "Tough", description: "Advanced analytical questions", icon: Sparkles }
// ];

// const QUESTION_TYPES = [
//   { value: "short", label: "Short Answer", icon: FileText },
//   { value: "long", label: "Long Answer", icon: BookMarked },
//   { value: "multiple choice", label: "MCQ", icon: ListChecks },
//   { value: "fill in blanks", label: "Fill in Blanks", icon: Type },
//   { value: "true false", label: "True/False", icon: CheckCircle }
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
//           const cachedCredits = localStorage.getItem("guestCredits");
//           if (cachedCredits !== null && !isNaN(parseInt(cachedCredits))) {
//             const credits = parseInt(cachedCredits);
//             setGuestCredits(credits);
//             return;
//           }
          
//           const response = await axios.get(
//             `${process.env.NEXT_PUBLIC_API_URL}/guest/credits`,
//             { headers: { "x-session-id": sessionId } }
//           );
          
//           setGuestCredits(response.data.credits);
//           localStorage.setItem("guestCredits", response.data.credits.toString());
          
//         } catch (err) {
//           console.error("Failed to fetch guest credits:", err);
//           const fallbackCredits = localStorage.getItem("guestCredits");
//           if (fallbackCredits) {
//             setGuestCredits(parseInt(fallbackCredits));
//           } else {
//             setGuestCredits(3);
//             localStorage.setItem("guestCredits", "3");
//           }
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

//   const handleQuestionTypeToggle = (typeValue: string) => {
//     setForm(prev => ({
//       ...prev,
//       questionTypes: prev.questionTypes.includes(typeValue)
//         ? prev.questionTypes.filter(t => t !== typeValue)
//         : [...prev.questionTypes, typeValue]
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

//     if (!form.class || !form.subject || !form.topic || !form.totalMarks) {
//       setError("Please fill all required fields");
//       return;
//     }

//     if (form.totalMarks < 10 || form.totalMarks > 200) {
//       setError("Total marks should be between 10 and 200");
//       return;
//     }

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
//         dueDate: formattedDueDate,
//         instructions: form.instructions,
//         concepts: form.concepts,
//         difficultyLevel: form.difficultyLevel,
//         questionTypes: form.questionTypes,
//         includeHints: form.includeHints,
//         includeAnswers: form.includeAnswers,
//         ensurePassing: form.ensurePassing,
//       };

//       const headers: any = { "Content-Type": "application/json" };
//       if (token) {
//         headers["Authorization"] = `Bearer ${token}`;
//       }
//       if (sessionId) {
//         headers["x-session-id"] = sessionId;
//       }

//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/assignment`,
//         payload,
//         { headers }
//       );

//       const { id } = response.data.data;

//       if (user) {
//         updateCredits(user.credits - 1);
//       } else if (guestCredits !== null) {
//         const newCredits = guestCredits - 1;
//         setGuestCredits(newCredits);
//         localStorage.setItem("guestCredits", newCredits.toString());
//       }

//       toast.success("Assignment created! Redirecting...");
//       router.push(`/assignment/${id}`);

//     } catch (err: any) {
//       console.error("Create assignment error:", err);
//       const errorMsg = err?.response?.data?.message || "Failed to create assignment";
//       setError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCurrentCredits = () => {
//     if (user) return user.credits;
//     if (guestCredits !== null) return guestCredits;
//     return 3;
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Header />

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
//             <Sparkles className="w-4 h-4 text-indigo-600" />
//             <span className="text-sm text-indigo-600 font-medium">Create New Assignment</span>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Create Assignment
//           </h1>
//           <p className="text-gray-500">
//             Fill in the details below to generate an AI-powered exam paper
//           </p>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-2">
//             <AlertCircle className="w-5 h-5 flex-shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
//           <div className="space-y-6">
//             {/* Basic Info Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="relative">
//                 <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   name="schoolName"
//                   placeholder="School Name (Optional)"
//                   value={form.schoolName}
//                   onChange={handleChange}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 />
//               </div>
//               <div className="relative">
//                 <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   name="class"
//                   placeholder="Class *"
//                   value={form.class}
//                   onChange={handleChange}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 />
//               </div>
//               <div className="relative">
//                 <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   name="subject"
//                   placeholder="Subject *"
//                   value={form.subject}
//                   onChange={handleChange}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 />
//               </div>
//               <div className="relative">
//                 <BookMarked className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   name="topic"
//                   placeholder="Topic *"
//                   value={form.topic}
//                   onChange={handleChange}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 />
//               </div>
//               <div className="relative">
//                 <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   name="totalMarks"
//                   type="number"
//                   placeholder="Total Marks * (10-200)"
//                   value={form.totalMarks}
//                   onChange={handleChange}
//                   min={10}
//                   max={200}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 />
//               </div>
//               <div className="relative">
//                 <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   name="timeAllowed"
//                   placeholder="Time Allowed (e.g., 45 minutes)"
//                   value={form.timeAllowed}
//                   onChange={handleChange}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 />
//               </div>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   name="dueDate"
//                   type="datetime-local"
//                   value={form.dueDate}
//                   onChange={handleChange}
//                   className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 />
//               </div>
//             </div>

//             {/* Concepts Section */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                 <BookOpen className="w-4 h-4 text-indigo-500" />
//                 Key Concepts
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   value={conceptInput}
//                   onChange={(e) => setConceptInput(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && addConcept()}
//                   placeholder="Add concepts (e.g., Photosynthesis, Algebra)"
//                   className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//                 <button
//                   onClick={addConcept}
//                   className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add
//                 </button>
//               </div>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {form.concepts.map((concept) => (
//                   <span
//                     key={concept}
//                     className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
//                   >
//                     {concept}
//                     <button
//                       onClick={() => removeConcept(concept)}
//                       className="hover:text-indigo-900"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Instructions */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
//                 <FileText className="w-4 h-4 text-indigo-500" />
//                 Instructions
//               </label>
//               <textarea
//                 name="instructions"
//                 value={form.instructions}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>

//             {/* Difficulty Level */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
//                 <Target className="w-4 h-4 text-indigo-500" />
//                 Difficulty Level
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 {DIFFICULTY_OPTIONS.map((opt) => (
//                   <button
//                     key={opt.value}
//                     onClick={() => setForm(prev => ({ ...prev, difficultyLevel: opt.value as any }))}
//                     className={`p-4 rounded-xl border-2 transition text-left ${
//                       form.difficultyLevel === opt.value
//                         ? "border-indigo-500 bg-indigo-50"
//                         : "border-gray-200 hover:border-gray-300 bg-gray-50"
//                     }`}
//                   >
//                     <opt.icon className={`w-5 h-5 mb-2 ${form.difficultyLevel === opt.value ? "text-indigo-600" : "text-gray-500"}`} />
//                     <div className="font-medium text-gray-900">{opt.label}</div>
//                     <div className="text-xs text-gray-500 mt-1">{opt.description}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Question Types */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
//                 <ListChecks className="w-4 h-4 text-indigo-500" />
//                 Question Types
//               </label>
//               <div className="flex flex-wrap gap-2">
//                 {QUESTION_TYPES.map((type) => (
//                   <button
//                     key={type.value}
//                     onClick={() => handleQuestionTypeToggle(type.value)}
//                     className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
//                       form.questionTypes.includes(type.value)
//                         ? "bg-indigo-600 text-white"
//                         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     <type.icon className="w-3.5 h-3.5" />
//                     {type.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Options */}
//             <div className="space-y-3">
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="includeHints"
//                   checked={form.includeHints}
//                   onChange={handleCheckboxChange}
//                   className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
//                 />
//                 <Lightbulb className="w-4 h-4 text-amber-500" />
//                 <span className="text-gray-700">Include hints for tough questions</span>
//               </label>
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="includeAnswers"
//                   checked={form.includeAnswers}
//                   onChange={handleCheckboxChange}
//                   className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
//                 />
//                 <KeyRound className="w-4 h-4 text-green-500" />
//                 <span className="text-gray-700">Include answer key</span>
//               </label>
//               <label className="flex items-center gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   name="ensurePassing"
//                   checked={form.ensurePassing}
//                   onChange={handleCheckboxChange}
//                   className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
//                 />
//                 <CheckCircle className="w-4 h-4 text-emerald-500" />
//                 <span className="text-gray-700">Ensure passing marks distribution</span>
//               </label>
//             </div>

//             {/* Credit Info */}
//             <div className="bg-gradient-to-r from-indigo-50 to-amber-50 p-4 rounded-xl border border-indigo-100">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <Star className="w-5 h-5 text-amber-500" />
//                   <span className="text-gray-700">Credits remaining:</span>
//                   <span className="text-2xl font-bold text-indigo-600">{getCurrentCredits()}</span>
//                 </div>
//                 {!user && (
//                   <button
//                     onClick={() => router.push("/login")}
//                     className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
//                   >
//                     Login for 30 credits →
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={loading || getCurrentCredits() <= 0}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Generating Assignment...
//                 </>
//               ) : (
//                 <>
//                   <Sparkles className="w-5 h-5" />
//                   Create Assignment
//                 </>
//               )}
//             </button>
//           </div>
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
import { 
  Plus, X, Star, Loader2, AlertCircle,
  BookOpen, Target, Sparkles, Clock, Calendar,
  School, GraduationCap, BookMarked, ListChecks,
  Lightbulb, KeyRound, CheckCircle, FileText,
  Hash, Type
} from "lucide-react";

// =========================
// TYPES (UNCHANGED)
// =========================
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
  { value: "easy", label: "Easy", description: "Basic conceptual questions", icon: BookOpen },
  { value: "balanced", label: "Balanced", description: "Mix of easy and tough", icon: Target },
  { value: "tough", label: "Tough", description: "Advanced analytical questions", icon: Sparkles }
];

const QUESTION_TYPES = [
  { value: "short", label: "Short Answer", icon: FileText },
  { value: "long", label: "Long Answer", icon: BookMarked },
  { value: "multiple choice", label: "MCQ", icon: ListChecks },
  { value: "fill in blanks", label: "Fill in Blanks", icon: Type },
  { value: "true false", label: "True/False", icon: CheckCircle }
];

// =========================
// SESSION HELPER (UNCHANGED)
// =========================
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

  // =========================
  // FETCH GUEST CREDITS (UNCHANGED)
  // =========================
  useEffect(() => {
    if (!isAuthenticated) {
      const fetchGuestCredits = async () => {
        try {
          const sessionId = getOrCreateSessionId();
          const cachedCredits = localStorage.getItem("guestCredits");

          if (cachedCredits !== null && !isNaN(parseInt(cachedCredits))) {
            setGuestCredits(parseInt(cachedCredits));
            return;
          }

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/guest/credits`,
            { headers: { "x-session-id": sessionId } }
          );

          setGuestCredits(response.data.credits);
          localStorage.setItem("guestCredits", response.data.credits.toString());

        } catch {
          setGuestCredits(3);
        }
      };

      fetchGuestCredits();
    }
  }, [isAuthenticated]);

  // =========================
  // HANDLERS (UNCHANGED)
  // =========================
  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleQuestionTypeToggle = (typeValue: string) => {
    setForm(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(typeValue)
        ? prev.questionTypes.filter(t => t !== typeValue)
        : [...prev.questionTypes, typeValue]
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

  // =========================
  // SUBMIT (UNCHANGED)
  // =========================
  const handleSubmit = async () => {
    setError("");

    if (!form.class || !form.subject || !form.topic || !form.totalMarks) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const sessionId = !isAuthenticated ? getOrCreateSessionId() : undefined;

      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (sessionId) headers["x-session-id"] = sessionId;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/assignment`,
        form,
        { headers }
      );

      const { id } = response.data.data;

      if (user) updateCredits(user.credits - 1);

      toast.success("Assignment created!");
      router.push(`/assignment/${id}`);

    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCredits = () => {
    if (user) return user.credits;
    if (guestCredits !== null) return guestCredits;
    return 3;
  };

  // =========================
  // UI START (IMPROVED ONLY)
  // =========================
  return (
    <div className="bg-[#fdfaf5] min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="text-sm text-amber-700 font-medium">
              Create New Assignment
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Create Assignment
          </h1>

          <p className="text-gray-500 mt-2">
            AI will generate a structured exam paper
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* FORM CARD */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-amber-100 p-6 md:p-8 space-y-6">

          {/* BASIC INFO */}
          <div className="grid md:grid-cols-2 gap-4">
            <input name="schoolName" placeholder="School Name" value={form.schoolName} onChange={handleChange} className="input" />
            <input name="class" placeholder="Class *" value={form.class} onChange={handleChange} className="input" />
            <input name="subject" placeholder="Subject *" value={form.subject} onChange={handleChange} className="input" />
            <input name="topic" placeholder="Topic *" value={form.topic} onChange={handleChange} className="input" />
          </div>

          {/* CONCEPTS */}
          <div>
            <div className="flex gap-2">
              <input
                value={conceptInput}
                onChange={(e)=>setConceptInput(e.target.value)}
                onKeyDown={(e)=> e.key==="Enter" && (e.preventDefault(), addConcept())}
                className="flex-1 input"
                placeholder="Add concepts"
              />
              <button onClick={addConcept} className="btn-primary">
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {form.concepts.map((c)=>(
                <span key={c} className="tag">
                  {c}
                  <X onClick={()=>removeConcept(c)} className="w-3 cursor-pointer"/>
                </span>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading || getCurrentCredits() <= 0}
            className="w-full btn-primary py-4 text-lg"
          >
            {loading ? <Loader2 className="animate-spin"/> : <Sparkles />}
            {loading ? "Generating..." : "Create Assignment"}
          </button>

        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .input {
          background: #faf7f2;
          border: 1px solid #f3e8d9;
          padding: 12px;
          border-radius: 12px;
          width: 100%;
          outline: none;
        }
        .input:focus {
          border-color: #d97706;
          box-shadow: 0 0 0 2px rgba(217,119,6,0.2);
        }
        .btn-primary {
          background: #d97706;
          color: white;
          border-radius: 12px;
          padding: 12px;
        }
        .btn-primary:hover {
          background: #b45309;
        }
        .tag {
          background: #fef3c7;
          padding: 6px 10px;
          border-radius: 999px;
          display: flex;
          gap: 6px;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
