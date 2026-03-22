// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import Header from "@/components/layout/Header";
// import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// import { printPDF } from "../../lib/printPdf";
// import { useUserStore } from "../../store/userStore";
// import { Loader2, FileText, Printer, PlusCircle, RefreshCw, XCircle } from "lucide-react";

// type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

// interface Question {
//   number: number;
//   text: string;
//   type: string;
//   difficulty: string;
//   marks: number;
//   hint?: string;
// }

// interface Section {
//   title: string;
//   instruction: string;
//   questions: Question[];
// }

// interface Assignment {
//   _id: string;
//   schoolName?: string;
//   class: string;
//   subject: string;
//   topic: string;
//   totalMarks: number;
//   timeAllowed: string;
//   instructions: string;
//   status: AssignmentStatus;
//   paper?: {
//     instructions: string;
//     sections: Section[];
//     studentInfo?: {
//       name: string;
//       rollNumber: string;
//       section: string;
//       class: string;
//       subject: string;
//       date: string;
//     };
//   };
//   errorMessage?: string;
// }

// export default function AssignmentPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { user, token } = useUserStore();
  
//   const [assignment, setAssignment] = useState<Assignment | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [statusMessage, setStatusMessage] = useState("");
//   const [retryCount, setRetryCount] = useState(0);
//   const [socketError, setSocketError] = useState(false);
  
//   const pdfRef = useRef<HTMLDivElement>(null);
//   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   const fetchAssignment = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
//       );

//       const data = response.data.data;
//       setAssignment(data);

//       switch (data.status) {
//         case "pending":
//           setStatusMessage("Assignment is queued. Waiting for processing...");
//           break;
//         case "processing":
//           setStatusMessage("AI is generating your assignment. This may take 30-60 seconds...");
//           break;
//         case "completed":
//           setStatusMessage("Assignment ready!");
//           setLoading(false);
//           if (pollIntervalRef.current) {
//             clearInterval(pollIntervalRef.current);
//             pollIntervalRef.current = null;
//           }
//           break;
//         case "failed":
//           setStatusMessage(`Failed: ${data.errorMessage || "Unknown error"}`);
//           setLoading(false);
//           break;
//       }

//       if (data.status !== "completed") {
//         setLoading(true);
//       } else {
//         setLoading(false);
//       }

//     } catch (err: any) {
//       console.error("Fetch assignment error:", err);
//       if (err?.response?.status === 404) {
//         setStatusMessage("Assignment not found");
//       } else {
//         setStatusMessage("Failed to load assignment");
//       }
//       setLoading(false);
//     }
//   }, [id]);

//   const startPolling = useCallback(() => {
//     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
//     pollIntervalRef.current = setInterval(() => {
//       if (assignment?.status === "completed" || assignment?.status === "failed") {
//         if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
//         return;
//       }
//       fetchAssignment();
//     }, 5000);
//   }, [assignment?.status, fetchAssignment]);

//   useEffect(() => {
//     fetchAssignment();
    
//     let socket: any = null;
//     let unsubscribe: (() => void) | null = null;
    
//     try {
//       socket = getSocket(token || undefined);
//       joinAssignmentRoom(id as string, token || undefined);
      
//       unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
//         console.log("Socket update:", data);
//         setSocketError(false);
        
//         setAssignment((prev) => {
//           if (!prev) return prev;
//           return {
//             ...prev,
//             status: data.status,
//             paper: data.data || prev.paper,
//             errorMessage: data.error,
//           };
//         });

//         if (data.status === "processing") {
//           setStatusMessage("AI is generating your assignment...");
//           setLoading(true);
//         } else if (data.status === "completed") {
//           setStatusMessage("Assignment ready!");
//           setLoading(false);
//           if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
//         } else if (data.status === "failed") {
//           setStatusMessage(`Failed: ${data.error || "Unknown error"}`);
//           setLoading(false);
//         } else if (data.status === "ai_attempt") {
//           setStatusMessage(`AI attempt ${data.attempt || 1}...`);
//         } else if (data.status === "retrying") {
//           setStatusMessage(`Retrying... Reason: ${data.reason || "unknown"}`);
//         } else if (data.status === "switching_provider") {
//           setStatusMessage(`Switching from ${data.from} to ${data.to}...`);
//         }
//       }, token || undefined);
      
//       startPolling();
      
//     } catch (err) {
//       console.error("Socket connection error:", err);
//       setSocketError(true);
//       startPolling();
//     }

//     return () => {
//       if (unsubscribe) unsubscribe();
//       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
//     };
//   }, [id, fetchAssignment, token, startPolling]);

//   const handlePrint = () => {
//     if (pdfRef.current) {
//       printPDF(pdfRef.current, `${assignment?.topic || "assignment"}`);
//     }
//   };

//   const handleRetry = () => {
//     setRetryCount(prev => prev + 1);
//     fetchAssignment();
//   };

//   if (loading) {
//     return (
//       <div className="bg-gray-50 min-h-screen">
//         <Header />
//         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
//           <div className="relative">
//             <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
//           </div>
//           <h2 className="text-xl font-semibold mt-6 text-center text-gray-900">
//             {statusMessage || "Preparing your assignment..."}
//           </h2>
//           {socketError && (
//             <p className="text-gray-500 text-sm mt-2">
//               Real-time connection lost. Updates may be delayed.
//             </p>
//           )}
//           <p className="text-gray-400 text-sm mt-4">
//             Please don't close this page
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (assignment?.status === "failed") {
//     return (
//       <div className="bg-gray-50 min-h-screen">
//         <Header />
//         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
//           <div className="text-center">
//             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <XCircle className="w-10 h-10 text-red-500" />
//             </div>
//             <h2 className="text-2xl font-bold text-red-600 mb-2">
//               Generation Failed
//             </h2>
//             <p className="text-gray-500 mb-6 max-w-md">
//               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
//             </p>
//             <div className="flex gap-4 justify-center">
//               <button
//                 onClick={handleRetry}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
//               >
//                 Try Again
//               </button>
//               <button
//                 onClick={() => router.push("/create-assignment")}
//                 className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
//               >
//                 Create New
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (assignment?.status === "completed" && assignment.paper) {
//     const paper = assignment.paper;
//     const currentDate = new Date().toLocaleDateString('en-GB');
    
//     const fixedSections = paper.sections?.map(section => ({
//       ...section,
//       instruction: "Attempt all questions"
//     })) || [];
    
//     return (
//       <div className="bg-gray-50 min-h-screen">
//         <Header />
        
//         <div className="max-w-4xl mx-auto p-6">
//           <div className="flex justify-end gap-3 mb-6 no-print">
//             <button
//               onClick={handlePrint}
//               className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
//             >
//               <Printer className="w-4 h-4" />
//               Print / Save as PDF
//             </button>
//             <button
//               onClick={() => router.push("/create-assignment")}
//               className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition text-sm font-medium"
//             >
//               <PlusCircle className="w-4 h-4" />
//               New Assignment
//             </button>
//           </div>

//           {/* Professional Question Paper Format */}
//           <div
//             ref={pdfRef}
//             className="bg-white text-black print-container shadow-lg rounded-xl"
//             style={{ 
//               fontFamily: "'Times New Roman', Times, serif", 
//               fontSize: '12pt', 
//               lineHeight: '1.3',
//               padding: '0.75in',
//               maxWidth: '100%',
//               margin: '0 auto'
//             }}
//           >
//             {/* TOP SECTION - School Header */}
//             <div className="mb-4">
//               {assignment.schoolName && (
//                 <h1 className="text-center text-xl font-bold uppercase tracking-wide mb-1">
//                   {assignment.schoolName}
//                 </h1>
//               )}
//               <p className="text-sm font-semibold mt-2">
//                 Subject: {assignment.subject}
//               </p>
//               <p className="text-sm font-semibold">
//                 Class: {assignment.class}
//               </p>
              
//               <div className="my-2"></div>
              
//               <p className="text-sm time-text">
//                 Time Allowed: {assignment.timeAllowed}
//               </p>
//               <p className="text-sm marks-text">
//                 Maximum Marks: {assignment.totalMarks}
//               </p>
              
//               <div className="my-2"></div>
              
//               <p className="text-sm italic instructions-text">
//                 All questions are compulsory unless stated otherwise.
//               </p>
              
//               <div className="my-3"></div>
              
//               {/* Student Info */}
//               <div className="flex flex-wrap gap-6 text-sm student-info">
//                 <span>Name: <span className="border-b border-gray-400 inline-block w-40 ml-2"></span></span>
//                 <span>Roll Number: <span className="border-b border-gray-400 inline-block w-32 ml-2"></span></span>
//                 <span>Section: <span className="border-b border-gray-400 inline-block w-20 ml-2"></span></span>
//               </div>
//             </div>

//             {/* GENERAL INSTRUCTIONS */}
//             <div className="mb-4 general-instructions">
//               <h3 className="text-sm font-bold uppercase tracking-wide mb-1">
//                 GENERAL INSTRUCTIONS:
//               </h3>
//               <div className="text-sm leading-relaxed space-y-0 ml-4">
//                 <p>1. All questions are compulsory.</p>
//                 <p>2. Write your answers in the space provided.</p>
//                 <p>3. Read each question carefully before answering.</p>
//                 <p>4. Marks are indicated against each question.</p>
//                 <p className="mt-1">{paper.instructions}</p>
//               </div>
//             </div>

//             {/* QUESTION SECTIONS */}
//             {fixedSections.map((section, sectionIdx) => (
//               <div key={sectionIdx} className="mb-4">
//                 <h2 className="text-center text-lg font-bold uppercase tracking-wide mb-0 section-title">
//                   {section.title}
//                 </h2>
//                 <p className="text-center text-sm font-semibold mb-0 section-subtitle">
//                   {section.title === "Section A" ? "Short Answer Questions" : 
//                    section.title === "Section B" ? "Long Answer Questions" : 
//                    "Analytical Questions"}
//                 </p>
//                 <p className="text-center text-xs italic text-gray-600 mb-2 section-instruction">
//                   {section.instruction}
//                 </p>
                
//                 {section.questions?.map((q, qIdx) => {
//                   let cleanText = q.text;
//                   cleanText = cleanText.replace(/\s*\([\d\s]+(Marks|marks)?\)/gi, '');
//                   cleanText = cleanText.trim();
                  
//                   return (
//                     <div key={qIdx} className="mb-0 question-item">
//                       <p className="text-sm leading-tight question-text">
//                         <span className="font-bold question-number">{q.number}.</span>{' '}
//                         {cleanText}
//                         {!cleanText.includes(`(${q.marks}`) && (
//                           <span className="font-semibold"> ({q.marks})</span>
//                         )}
//                       </p>
//                       {q.hint && (
//                         <p className="text-xs text-gray-500 mt-0 italic ml-6 hint-text">
//                           Hint: {q.hint}
//                         </p>
//                       )}
//                       <div className="mt-0 ml-6 h-3 answer-space"></div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}

//             {/* FOOTER */}
//             <div className="text-center text-xs text-gray-400 mt-2 pt-1 footer-text">
//               Best of Luck!
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/layout/Header";
import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
import { printPDF } from "../../lib/printPdf";
import { useUserStore } from "../../store/userStore";
import { Printer, PlusCircle, XCircle, Home } from "lucide-react";

type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

interface Question {
  number: number;
  text: string;
  type: string;
  difficulty: string;
  marks: number;
  hint?: string;
}

interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

interface Assignment {
  _id: string;
  schoolName?: string;
  class: string;
  subject: string;
  topic: string;
  totalMarks: number;
  timeAllowed: string;
  instructions: string;
  status: AssignmentStatus;
  paper?: {
    instructions: string;
    sections: Section[];
    studentInfo?: {
      name: string;
      rollNumber: string;
      section: string;
      class: string;
      subject: string;
      date: string;
    };
  };
  errorMessage?: string;
}

export default function AssignmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useUserStore();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [socketError, setSocketError] = useState(false);
  
  const pdfRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAssignment = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
      );

      const data = response.data.data;
      setAssignment(data);

      switch (data.status) {
        case "pending":
          setStatusMessage("Assignment is queued. Waiting for processing...");
          break;
        case "processing":
          setStatusMessage("AI is generating your assignment. This may take 30-60 seconds...");
          break;
        case "completed":
          setStatusMessage("Assignment ready!");
          setLoading(false);
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          break;
        case "failed":
          setStatusMessage(`Failed: ${data.errorMessage || "Unknown error"}`);
          setLoading(false);
          break;
      }

      if (data.status !== "completed") {
        setLoading(true);
      } else {
        setLoading(false);
      }

    } catch (err: any) {
      console.error("Fetch assignment error:", err);
      if (err?.response?.status === 404) {
        setStatusMessage("Assignment not found");
      } else {
        setStatusMessage("Failed to load assignment");
      }
      setLoading(false);
    }
  }, [id]);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
    pollIntervalRef.current = setInterval(() => {
      if (assignment?.status === "completed" || assignment?.status === "failed") {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        return;
      }
      fetchAssignment();
    }, 5000);
  }, [assignment?.status, fetchAssignment]);

  useEffect(() => {
    fetchAssignment();
    
    let socket: any = null;
    let unsubscribe: (() => void) | null = null;
    
    try {
      socket = getSocket(token || undefined);
      joinAssignmentRoom(id as string, token || undefined);
      
      unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
        console.log("Socket update:", data);
        setSocketError(false);
        
        setAssignment((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: data.status,
            paper: data.data || prev.paper,
            errorMessage: data.error,
          };
        });

        if (data.status === "processing") {
          setStatusMessage("AI is generating your assignment...");
          setLoading(true);
        } else if (data.status === "completed") {
          setStatusMessage("Assignment ready!");
          setLoading(false);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        } else if (data.status === "failed") {
          setStatusMessage(`Failed: ${data.error || "Unknown error"}`);
          setLoading(false);
        } else if (data.status === "ai_attempt") {
          setStatusMessage(`AI attempt ${data.attempt || 1}...`);
        } else if (data.status === "retrying") {
          setStatusMessage(`Retrying... Reason: ${data.reason || "unknown"}`);
        } else if (data.status === "switching_provider") {
          setStatusMessage(`Switching from ${data.from} to ${data.to}...`);
        }
      }, token || undefined);
      
      startPolling();
      
    } catch (err) {
      console.error("Socket connection error:", err);
      setSocketError(true);
      startPolling();
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [id, fetchAssignment, token, startPolling]);

  const handlePrint = () => {
    if (pdfRef.current) {
      printPDF(pdfRef.current, `${assignment?.topic || "assignment"}`);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchAssignment();
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#fdfaf5]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
        <Header />
        <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mt-6 text-center text-gray-900 max-w-sm sm:max-w-md">
            {statusMessage || "Preparing your assignment..."}
          </h2>
          {socketError && (
            <p className="text-amber-600 text-xs sm:text-sm mt-2 text-center">
              Real-time connection lost. Updates may be delayed.
            </p>
          )}
          <p className="text-gray-400 text-xs sm:text-sm mt-4 text-center">
            Please don't close this page
          </p>
        </div>
      </div>
    );
  }

  if (assignment?.status === "failed") {
    return (
      <div className="relative min-h-screen bg-[#fdfaf5]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
        <Header />
        <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6">
          <div className="text-center w-full max-w-md mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-700 mb-2">
              Generation Failed
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mb-6">
              {assignment?.errorMessage || "Something went wrong while generating your assignment."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 sm:px-6 py-2 rounded-lg transition text-sm sm:text-base"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/create-assignment")}
                className="border border-amber-200 bg-white text-gray-700 px-5 sm:px-6 py-2 rounded-lg hover:bg-amber-50 transition text-sm sm:text-base"
              >
                Create New
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (assignment?.status === "completed" && assignment.paper) {
    const paper = assignment.paper;
    const currentDate = new Date().toLocaleDateString('en-GB');
    
    const fixedSections = paper.sections?.map(section => ({
      ...section,
      instruction: "Attempt all questions"
    })) || [];
    
    return (
      <div className="relative min-h-screen bg-[#fdfaf5]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
        <Header />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6 no-print">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center justify-center gap-2 bg-white border border-amber-200 text-gray-700 hover:bg-amber-50 px-3 sm:px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-3 sm:px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => router.push("/create-assignment")}
              className="flex items-center justify-center gap-2 bg-white border border-amber-200 text-gray-700 hover:bg-amber-50 px-3 sm:px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          </div>

          {/* Professional Question Paper Format */}
          <div
            ref={pdfRef}
            className="bg-white text-black print-container shadow-lg rounded-xl border border-amber-100"
            style={{ 
              fontFamily: "'Times New Roman', Times, serif", 
              fontSize: '12pt', 
              lineHeight: '1.3',
              padding: '0.75in',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            {/* TOP SECTION - School Header */}
            <div className="mb-4">
              {/* School Name - Bigger and with proper gap below */}
              {assignment.schoolName && (
                <h1 className="text-center text-3xl sm:text-4xl font-bold uppercase tracking-wide mb-8 text-gray-900">
                  {assignment.schoolName}
                </h1>
              )}
              
              {/* Subject and Class Section */}
              <p className="text-sm font-semibold mt-2">
                Subject: {assignment.subject}
              </p>
              <p className="text-sm font-semibold">
                Class: {assignment.class}
              </p>
              
              <div className="my-2"></div>
              
              <p className="text-sm time-text">
                Time Allowed: {assignment.timeAllowed}
              </p>
              <p className="text-sm marks-text">
                Maximum Marks: {assignment.totalMarks}
              </p>
              
              <div className="my-2"></div>
              
              <p className="text-sm italic instructions-text">
                All questions are compulsory unless stated otherwise.
              </p>
              
              <div className="my-3"></div>
              
              {/* Student Info */}
              <div className="flex flex-wrap gap-6 text-sm student-info">
                <span>Name: <span className="border-b border-gray-400 inline-block w-40 ml-2"></span></span>
                <span>Roll Number: <span className="border-b border-gray-400 inline-block w-32 ml-2"></span></span>
                <span>Section: <span className="border-b border-gray-400 inline-block w-20 ml-2"></span></span>
              </div>
            </div>

            {/* GENERAL INSTRUCTIONS */}
            <div className="mb-4 general-instructions">
              <h3 className="text-sm font-bold uppercase tracking-wide mb-1">
                GENERAL INSTRUCTIONS:
              </h3>
              <div className="text-sm leading-relaxed space-y-0 ml-4">
                <p>1. All questions are compulsory.</p>
                <p>2. Write your answers in the space provided.</p>
                <p>3. Read each question carefully before answering.</p>
                <p>4. Marks are indicated against each question.</p>
                <p className="mt-1">{paper.instructions}</p>
              </div>
            </div>

            {/* QUESTION SECTIONS */}
            {fixedSections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="mb-4">
                <h2 className="text-center text-lg font-bold uppercase tracking-wide mb-0 section-title">
                  {section.title}
                </h2>
                <p className="text-center text-sm font-semibold mb-0 section-subtitle">
                  {section.title === "Section A" ? "Short Answer Questions" : 
                   section.title === "Section B" ? "Long Answer Questions" : 
                   "Analytical Questions"}
                </p>
                <p className="text-center text-xs italic text-gray-600 mb-2 section-instruction">
                  {section.instruction}
                </p>
                
                {section.questions?.map((q, qIdx) => {
                  let cleanText = q.text;
                  cleanText = cleanText.replace(/\s*\([\d\s]+(Marks|marks)?\)/gi, '');
                  cleanText = cleanText.trim();
                  
                  return (
                    <div key={qIdx} className="mb-0 question-item">
                      <p className="text-sm leading-tight question-text">
                        <span className="font-bold question-number">{q.number}.</span>{' '}
                        {cleanText}
                        {!cleanText.includes(`(${q.marks}`) && (
                          <span className="font-semibold"> ({q.marks})</span>
                        )}
                      </p>
                      {q.hint && (
                        <p className="text-xs text-gray-500 mt-0 italic ml-6 hint-text">
                          Hint: {q.hint}
                        </p>
                      )}
                      <div className="mt-0 ml-6 h-3 answer-space"></div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* FOOTER */}
            <div className="text-center text-xs text-gray-400 mt-2 pt-1 footer-text">
              Best of Luck!
            </div>
          </div>

          {/* Mobile Bottom Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 p-3 sm:hidden no-print shadow-lg z-10">
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => router.push("/create-assignment")}
                className="flex-1 bg-white border border-amber-200 text-gray-700 hover:bg-amber-50 py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                New
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
