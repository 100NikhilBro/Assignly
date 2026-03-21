// // // // // // // // // // // "use client";

// // // // // // // // // // // import { useEffect, useRef, useState } from "react";
// // // // // // // // // // // import { useParams } from "next/navigation";
// // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // import Header from "@/components/layout/Header";
// // // // // // // // // // // import { socket } from "../../lib/socket";
// // // // // // // // // // // import { downloadPDF } from "../../lib/downloadPdf";

// // // // // // // // // // // export default function AssignmentPage() {
// // // // // // // // // // //   const { id } = useParams();

// // // // // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // // // // //   const [assignment, setAssignment] = useState<any>(null);

// // // // // // // // // // //   const pdfRef = useRef<HTMLDivElement>(null);

// // // // // // // // // // //   const fetchAssignment = async () => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const res = await axios.get(
// // // // // // // // // // //         `http://localhost:5000/api/assignment/${id}`
// // // // // // // // // // //       );

// // // // // // // // // // //       const data = res.data.data;

// // // // // // // // // // //       setAssignment(data);

// // // // // // // // // // //       if (data.status !== "processing") {
// // // // // // // // // // //         setLoading(false);
// // // // // // // // // // //       }
// // // // // // // // // // //     } catch (err) {
// // // // // // // // // // //       console.log(err);
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     fetchAssignment();

// // // // // // // // // // //     socket.emit("join-assignment", id);

// // // // // // // // // // //     socket.on("assignment-update", (data: any) => {
// // // // // // // // // // //       if (data.assignmentId === id) {
// // // // // // // // // // //         setAssignment((prev: any) => ({
// // // // // // // // // // //           ...prev,
// // // // // // // // // // //           ...data,
// // // // // // // // // // //         }));

// // // // // // // // // // //         if (data.status !== "processing") {
// // // // // // // // // // //           setLoading(false);
// // // // // // // // // // //         }
// // // // // // // // // // //       }
// // // // // // // // // // //     });

// // // // // // // // // // //     return () => {
// // // // // // // // // // //       socket.off("assignment-update");
// // // // // // // // // // //     };
// // // // // // // // // // //   }, [id]);

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div className="bg-black text-white min-h-screen">
// // // // // // // // // // //       <Header />

// // // // // // // // // // //       <div className="max-w-4xl mx-auto p-6">

// // // // // // // // // // //         {/* LOADING */}
// // // // // // // // // // //         {loading && (
// // // // // // // // // // //           <div className="text-center mt-20">
// // // // // // // // // // //             <h2 className="text-xl font-semibold">
// // // // // // // // // // //               Generating your paper...
// // // // // // // // // // //             </h2>
// // // // // // // // // // //             <p className="text-gray-400 mt-2">
// // // // // // // // // // //               Real-time updates ⚡
// // // // // // // // // // //             </p>
// // // // // // // // // // //           </div>
// // // // // // // // // // //         )}

// // // // // // // // // // //         {/* FAILED */}
// // // // // // // // // // //         {!loading && assignment?.status === "failed" && (
// // // // // // // // // // //           <div className="text-center mt-20 text-red-500">
// // // // // // // // // // //             Failed to generate assignment
// // // // // // // // // // //           </div>
// // // // // // // // // // //         )}

// // // // // // // // // // //         {/* COMPLETED */}
// // // // // // // // // // //         {!loading && assignment?.status === "completed" && (
// // // // // // // // // // //           <>
// // // // // // // // // // //             {/* 🔥 ACTION BAR */}
// // // // // // // // // // //             <div className="flex justify-end mb-4 gap-2">
// // // // // // // // // // //               <button
// // // // // // // // // // //                 onClick={() => downloadPDF(pdfRef.current)}
// // // // // // // // // // //                 className="bg-green-500 px-4 py-2 rounded text-sm hover:opacity-90"
// // // // // // // // // // //               >
// // // // // // // // // // //                 Download PDF
// // // // // // // // // // //               </button>
// // // // // // // // // // //             </div>

// // // // // // // // // // //             {/* 🔥 PDF AREA (WHITE FOR PRINT) */}
// // // // // // // // // // //             <div
// // // // // // // // // // //               ref={pdfRef}
// // // // // // // // // // //               className="bg-white text-black p-6 rounded-lg"
// // // // // // // // // // //             >
// // // // // // // // // // //               <h1 className="text-2xl font-bold mb-6 text-center">
// // // // // // // // // // //                 Question Paper
// // // // // // // // // // //               </h1>

// // // // // // // // // // //               {/* Student Info */}
// // // // // // // // // // //               <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
// // // // // // // // // // //                 <div>Name: __________</div>
// // // // // // // // // // //                 <div>Roll No: ________</div>
// // // // // // // // // // //                 <div>Section: ________</div>
// // // // // // // // // // //               </div>

// // // // // // // // // // //               {/* Meta */}
// // // // // // // // // // //               <div className="mb-6 text-sm">
// // // // // // // // // // //                 <p>Class: {assignment.class}</p>
// // // // // // // // // // //                 <p>Subject: {assignment.subject}</p>
// // // // // // // // // // //                 <p>Topic: {assignment.topic}</p>
// // // // // // // // // // //                 <p>Total Marks: {assignment.totalMarks}</p>
// // // // // // // // // // //                 <p>Time: {assignment.timeAllowed}</p>
// // // // // // // // // // //               </div>

// // // // // // // // // // //               {/* Instructions */}
// // // // // // // // // // //               <div className="mb-6">
// // // // // // // // // // //                 <h2 className="font-semibold">Instructions:</h2>
// // // // // // // // // // //                 <p>{assignment.paper?.instructions}</p>
// // // // // // // // // // //               </div>

// // // // // // // // // // //               {/* Sections */}
// // // // // // // // // // //               {assignment.paper?.sections?.map((section: any, index: number) => (
// // // // // // // // // // //                 <div key={index} className="mb-8">

// // // // // // // // // // //                   <h2 className="text-lg font-semibold mb-2">
// // // // // // // // // // //                     {section.title}
// // // // // // // // // // //                   </h2>

// // // // // // // // // // //                   <p className="text-sm mb-3">
// // // // // // // // // // //                     {section.instruction}
// // // // // // // // // // //                   </p>

// // // // // // // // // // //                   {section.questions?.map((q: any, i: number) => (
// // // // // // // // // // //                     <div key={i} className="mb-4 border-b pb-3">

// // // // // // // // // // //                       <div className="flex justify-between gap-4">

// // // // // // // // // // //                         <p className="flex-1">
// // // // // // // // // // //                           {q.number}. {q.text}
// // // // // // // // // // //                         </p>

// // // // // // // // // // //                         <div className="text-xs text-right">
// // // // // // // // // // //                           <p>{q.difficulty}</p>
// // // // // // // // // // //                           <p>{q.marks} marks</p>
// // // // // // // // // // //                         </div>
// // // // // // // // // // //                       </div>

// // // // // // // // // // //                       {q.hint && (
// // // // // // // // // // //                         <p className="text-xs mt-2">
// // // // // // // // // // //                           Hint: {q.hint}
// // // // // // // // // // //                         </p>
// // // // // // // // // // //                       )}

// // // // // // // // // // //                     </div>
// // // // // // // // // // //                   ))}
// // // // // // // // // // //                 </div>
// // // // // // // // // // //               ))}
// // // // // // // // // // //             </div>
// // // // // // // // // // //           </>
// // // // // // // // // // //         )}
// // // // // // // // // // //       </div>
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // }


// // // // // // // // // // "use client";

// // // // // // // // // // import { useEffect, useRef, useState, useCallback } from "react";
// // // // // // // // // // import { useParams, useRouter } from "next/navigation";
// // // // // // // // // // import axios from "axios";
// // // // // // // // // // import Header from "@/components/layout/Header";
// // // // // // // // // // import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// // // // // // // // // // import { downloadPDF } from "../../lib/downloadPdf";
// // // // // // // // // // import { useUserStore } from "../../store/userStore";

// // // // // // // // // // type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

// // // // // // // // // // interface Question {
// // // // // // // // // //   number: number;
// // // // // // // // // //   text: string;
// // // // // // // // // //   type: string;
// // // // // // // // // //   difficulty: string;
// // // // // // // // // //   marks: number;
// // // // // // // // // //   hint?: string;
// // // // // // // // // // }

// // // // // // // // // // interface Section {
// // // // // // // // // //   title: string;
// // // // // // // // // //   instruction: string;
// // // // // // // // // //   questions: Question[];
// // // // // // // // // // }

// // // // // // // // // // interface Assignment {
// // // // // // // // // //   _id: string;
// // // // // // // // // //   class: string;
// // // // // // // // // //   subject: string;
// // // // // // // // // //   topic: string;
// // // // // // // // // //   totalMarks: number;
// // // // // // // // // //   timeAllowed: string;
// // // // // // // // // //   instructions: string;
// // // // // // // // // //   status: AssignmentStatus;
// // // // // // // // // //   paper?: {
// // // // // // // // // //     instructions: string;
// // // // // // // // // //     sections: Section[];
// // // // // // // // // //     studentInfo?: {
// // // // // // // // // //       name: string;
// // // // // // // // // //       rollNumber: string;
// // // // // // // // // //       section: string;
// // // // // // // // // //       class: string;
// // // // // // // // // //       subject: string;
// // // // // // // // // //       date: string;
// // // // // // // // // //     };
// // // // // // // // // //   };
// // // // // // // // // //   errorMessage?: string;
// // // // // // // // // // }

// // // // // // // // // // export default function AssignmentPage() {
// // // // // // // // // //   const { id } = useParams();
// // // // // // // // // //   const router = useRouter();
// // // // // // // // // //   const { user, token } = useUserStore();
  
// // // // // // // // // //   const [assignment, setAssignment] = useState<Assignment | null>(null);
// // // // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // // // //   const [statusMessage, setStatusMessage] = useState("");
// // // // // // // // // //   const [retryCount, setRetryCount] = useState(0);
// // // // // // // // // //   const [socketError, setSocketError] = useState(false);
  
// // // // // // // // // //   const pdfRef = useRef<HTMLDivElement>(null);
// // // // // // // // // //   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // // // // // // // // //   const fetchAssignment = useCallback(async () => {
// // // // // // // // // //     try {
// // // // // // // // // //       const response = await axios.get(
// // // // // // // // // //         `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
// // // // // // // // // //       );

// // // // // // // // // //       const data = response.data.data;
// // // // // // // // // //       setAssignment(data);

// // // // // // // // // //       // Update status message based on current status
// // // // // // // // // //       switch (data.status) {
// // // // // // // // // //         case "pending":
// // // // // // // // // //           setStatusMessage("⏳ Assignment is queued. Waiting for processing...");
// // // // // // // // // //           break;
// // // // // // // // // //         case "processing":
// // // // // // // // // //           setStatusMessage("🤖 AI is generating your assignment. This may take 30-60 seconds...");
// // // // // // // // // //           break;
// // // // // // // // // //         case "completed":
// // // // // // // // // //           setStatusMessage("✅ Assignment ready!");
// // // // // // // // // //           setLoading(false);
// // // // // // // // // //           // Stop polling if active
// // // // // // // // // //           if (pollIntervalRef.current) {
// // // // // // // // // //             clearInterval(pollIntervalRef.current);
// // // // // // // // // //             pollIntervalRef.current = null;
// // // // // // // // // //           }
// // // // // // // // // //           break;
// // // // // // // // // //         case "failed":
// // // // // // // // // //           setStatusMessage(`❌ Failed: ${data.errorMessage || "Unknown error"}`);
// // // // // // // // // //           setLoading(false);
// // // // // // // // // //           break;
// // // // // // // // // //       }

// // // // // // // // // //       // If not completed, continue loading
// // // // // // // // // //       if (data.status !== "completed") {
// // // // // // // // // //         setLoading(true);
// // // // // // // // // //       } else {
// // // // // // // // // //         setLoading(false);
// // // // // // // // // //       }

// // // // // // // // // //     } catch (err: any) {
// // // // // // // // // //       console.error("Fetch assignment error:", err);
// // // // // // // // // //       if (err?.response?.status === 404) {
// // // // // // // // // //         setStatusMessage("❌ Assignment not found");
// // // // // // // // // //       } else {
// // // // // // // // // //         setStatusMessage("❌ Failed to load assignment");
// // // // // // // // // //       }
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   }, [id]);

// // // // // // // // // //   // Polling fallback for socket disconnection
// // // // // // // // // //   const startPolling = useCallback(() => {
// // // // // // // // // //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
// // // // // // // // // //     pollIntervalRef.current = setInterval(() => {
// // // // // // // // // //       if (assignment?.status === "completed" || assignment?.status === "failed") {
// // // // // // // // // //         if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // // // // //         return;
// // // // // // // // // //       }
// // // // // // // // // //       fetchAssignment();
// // // // // // // // // //     }, 5000); // Poll every 5 seconds as fallback
// // // // // // // // // //   }, [assignment?.status, fetchAssignment]);

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     fetchAssignment();
    
// // // // // // // // // //     // Setup socket connection
// // // // // // // // // //     let socket: any = null;
// // // // // // // // // //     let unsubscribe: (() => void) | null = null;
    
// // // // // // // // // //     try {
// // // // // // // // // //       socket = getSocket(token || undefined);
// // // // // // // // // //       joinAssignmentRoom(id as string, token || undefined);
      
// // // // // // // // // //       // Listen for assignment updates
// // // // // // // // // //       unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
// // // // // // // // // //         console.log("Socket update:", data);
// // // // // // // // // //         setSocketError(false);
        
// // // // // // // // // //         setAssignment((prev) => {
// // // // // // // // // //           if (!prev) return prev;
// // // // // // // // // //           return {
// // // // // // // // // //             ...prev,
// // // // // // // // // //             status: data.status,
// // // // // // // // // //             paper: data.data || prev.paper,
// // // // // // // // // //             errorMessage: data.error,
// // // // // // // // // //           };
// // // // // // // // // //         });

// // // // // // // // // //         // Update status message
// // // // // // // // // //         if (data.status === "processing") {
// // // // // // // // // //           setStatusMessage("🤖 AI is generating your assignment...");
// // // // // // // // // //           setLoading(true);
// // // // // // // // // //         } else if (data.status === "completed") {
// // // // // // // // // //           setStatusMessage("✅ Assignment ready!");
// // // // // // // // // //           setLoading(false);
// // // // // // // // // //           if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // // // // //         } else if (data.status === "failed") {
// // // // // // // // // //           setStatusMessage(`❌ Failed: ${data.error || "Unknown error"}`);
// // // // // // // // // //           setLoading(false);
// // // // // // // // // //         } else if (data.status === "ai_attempt") {
// // // // // // // // // //           setStatusMessage(`🧠 AI attempt ${data.attempt || 1}...`);
// // // // // // // // // //         } else if (data.status === "retrying") {
// // // // // // // // // //           setStatusMessage(`🔄 Retrying... Reason: ${data.reason || "unknown"}`);
// // // // // // // // // //         } else if (data.status === "switching_provider") {
// // // // // // // // // //           setStatusMessage(`🔄 Switching from ${data.from} to ${data.to}...`);
// // // // // // // // // //         }
// // // // // // // // // //       }, token || undefined);
      
// // // // // // // // // //       // Start polling as fallback
// // // // // // // // // //       startPolling();
      
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error("Socket connection error:", err);
// // // // // // // // // //       setSocketError(true);
// // // // // // // // // //       startPolling(); // Use polling if socket fails
// // // // // // // // // //     }

// // // // // // // // // //     return () => {
// // // // // // // // // //       if (unsubscribe) unsubscribe();
// // // // // // // // // //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // // // // //     };
// // // // // // // // // //   }, [id, fetchAssignment, token, startPolling]);

// // // // // // // // // //   const handleDownloadPDF = () => {
// // // // // // // // // //     if (pdfRef.current) {
// // // // // // // // // //       downloadPDF(pdfRef.current, `${assignment?.topic || "assignment"}.pdf`);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const handleRetry = () => {
// // // // // // // // // //     setRetryCount(prev => prev + 1);
// // // // // // // // // //     fetchAssignment();
// // // // // // // // // //   };

// // // // // // // // // //   // Loading UI with animation
// // // // // // // // // //   if (loading) {
// // // // // // // // // //     return (
// // // // // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // // // // //         <Header />
// // // // // // // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // // // // // // //           <div className="relative">
// // // // // // // // // //             <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
// // // // // // // // // //             <div className="absolute inset-0 flex items-center justify-center">
// // // // // // // // // //               <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
// // // // // // // // // //             </div>
// // // // // // // // // //           </div>
// // // // // // // // // //           <h2 className="text-xl font-semibold mt-6 text-center">
// // // // // // // // // //             {statusMessage || "Preparing your assignment..."}
// // // // // // // // // //           </h2>
// // // // // // // // // //           {socketError && (
// // // // // // // // // //             <p className="text-gray-500 text-sm mt-2">
// // // // // // // // // //               ⚠️ Real-time connection lost. Updates may be delayed.
// // // // // // // // // //             </p>
// // // // // // // // // //           )}
// // // // // // // // // //           <p className="text-gray-400 text-sm mt-4">
// // // // // // // // // //             Please don't close this page
// // // // // // // // // //           </p>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   // Failed UI
// // // // // // // // // //   if (assignment?.status === "failed") {
// // // // // // // // // //     return (
// // // // // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // // // // //         <Header />
// // // // // // // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // // // // // // //           <div className="text-center">
// // // // // // // // // //             <div className="text-6xl mb-4">❌</div>
// // // // // // // // // //             <h2 className="text-2xl font-bold text-red-500 mb-2">
// // // // // // // // // //               Generation Failed
// // // // // // // // // //             </h2>
// // // // // // // // // //             <p className="text-gray-400 mb-6 max-w-md">
// // // // // // // // // //               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
// // // // // // // // // //             </p>
// // // // // // // // // //             <div className="flex gap-4 justify-center">
// // // // // // // // // //               <button
// // // // // // // // // //                 onClick={handleRetry}
// // // // // // // // // //                 className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
// // // // // // // // // //               >
// // // // // // // // // //                 Try Again
// // // // // // // // // //               </button>
// // // // // // // // // //               <button
// // // // // // // // // //                 onClick={() => router.push("/create-assignment")}
// // // // // // // // // //                 className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
// // // // // // // // // //               >
// // // // // // // // // //                 Create New
// // // // // // // // // //               </button>
// // // // // // // // // //             </div>
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   // Completed UI
// // // // // // // // // //   if (assignment?.status === "completed" && assignment.paper) {
// // // // // // // // // //     const paper = assignment.paper;
    
// // // // // // // // // //     return (
// // // // // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // // // // //         <Header />
        
// // // // // // // // // //         <div className="max-w-4xl mx-auto p-6">
// // // // // // // // // //           {/* Action Bar */}
// // // // // // // // // //           <div className="flex justify-end gap-3 mb-6">
// // // // // // // // // //             <button
// // // // // // // // // //               onClick={handleDownloadPDF}
// // // // // // // // // //               className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
// // // // // // // // // //             >
// // // // // // // // // //               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // // // // // // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
// // // // // // // // // //               </svg>
// // // // // // // // // //               Download PDF
// // // // // // // // // //             </button>
// // // // // // // // // //             <button
// // // // // // // // // //               onClick={() => router.push("/create-assignment")}
// // // // // // // // // //               className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition"
// // // // // // // // // //             >
// // // // // // // // // //               New Assignment
// // // // // // // // // //             </button>
// // // // // // // // // //           </div>

// // // // // // // // // //           {/* PDF Content - Clean for printing */}
// // // // // // // // // //           <div
// // // // // // // // // //             ref={pdfRef}
// // // // // // // // // //             className="bg-white text-black p-8 rounded-lg shadow-xl"
// // // // // // // // // //             style={{ fontFamily: "'Times New Roman', serif" }}
// // // // // // // // // //           >
// // // // // // // // // //             {/* Header */}
// // // // // // // // // //             <div className="text-center mb-8">
// // // // // // // // // //               <h1 className="text-3xl font-bold mb-2">Question Paper</h1>
// // // // // // // // // //               <div className="border-b-2 border-gray-300 w-24 mx-auto"></div>
// // // // // // // // // //             </div>

// // // // // // // // // //             {/* Student Info */}
// // // // // // // // // //             <div className="grid grid-cols-3 gap-4 mb-8 text-sm border-b border-gray-200 pb-4">
// // // // // // // // // //               <div>Name: <span className="border-b border-gray-400 inline-block w-32">___________</span></div>
// // // // // // // // // //               <div>Roll No: <span className="border-b border-gray-400 inline-block w-24">________</span></div>
// // // // // // // // // //               <div>Section: <span className="border-b border-gray-400 inline-block w-24">________</span></div>
// // // // // // // // // //             </div>

// // // // // // // // // //             {/* Meta Info */}
// // // // // // // // // //             <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-gray-50 p-4 rounded">
// // // // // // // // // //               <div><strong>Class:</strong> {assignment.class}</div>
// // // // // // // // // //               <div><strong>Subject:</strong> {assignment.subject}</div>
// // // // // // // // // //               <div><strong>Topic:</strong> {assignment.topic}</div>
// // // // // // // // // //               <div><strong>Total Marks:</strong> {assignment.totalMarks}</div>
// // // // // // // // // //               <div><strong>Time Allowed:</strong> {assignment.timeAllowed}</div>
// // // // // // // // // //               <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
// // // // // // // // // //             </div>

// // // // // // // // // //             {/* Instructions */}
// // // // // // // // // //             <div className="mb-8">
// // // // // // // // // //               <h2 className="font-bold text-lg mb-2">Instructions:</h2>
// // // // // // // // // //               <p className="text-sm border-l-4 border-orange-500 pl-3">{paper.instructions}</p>
// // // // // // // // // //             </div>

// // // // // // // // // //             {/* Sections */}
// // // // // // // // // //             {paper.sections?.map((section, idx) => (
// // // // // // // // // //               <div key={idx} className="mb-8">
// // // // // // // // // //                 <h2 className="font-bold text-xl mb-2">{section.title}</h2>
// // // // // // // // // //                 <p className="text-sm text-gray-600 mb-4">{section.instruction}</p>
                
// // // // // // // // // //                 {section.questions?.map((q, i) => (
// // // // // // // // // //                   <div key={i} className="mb-5 pb-3 border-b border-gray-200">
// // // // // // // // // //                     <div className="flex justify-between gap-4">
// // // // // // // // // //                       <p className="flex-1">
// // // // // // // // // //                         <strong>{q.number}.</strong> {q.text}
// // // // // // // // // //                       </p>
// // // // // // // // // //                       <div className="text-right text-sm">
// // // // // // // // // //                         <span className="text-gray-600">{q.difficulty}</span>
// // // // // // // // // //                         <br />
// // // // // // // // // //                         <span className="font-semibold">{q.marks} marks</span>
// // // // // // // // // //                       </div>
// // // // // // // // // //                     </div>
// // // // // // // // // //                     {q.hint && (
// // // // // // // // // //                       <p className="text-xs text-gray-500 mt-2 italic">
// // // // // // // // // //                         💡 Hint: {q.hint}
// // // // // // // // // //                       </p>
// // // // // // // // // //                     )}
// // // // // // // // // //                   </div>
// // // // // // // // // //                 ))}
// // // // // // // // // //               </div>
// // // // // // // // // //             ))}

// // // // // // // // // //             {/* Footer */}
// // // // // // // // // //             <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
// // // // // // // // // //               Good Luck! 📝
// // // // // // // // // //             </div>
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return null;
// // // // // // // // // // }



// // // // // // // // // "use client";

// // // // // // // // // import { useEffect, useRef, useState, useCallback } from "react";
// // // // // // // // // import { useParams, useRouter } from "next/navigation";
// // // // // // // // // import axios from "axios";
// // // // // // // // // import Header from "@/components/layout/Header";
// // // // // // // // // import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// // // // // // // // // import { usePDF } from "../../lib/downloadPdf";
// // // // // // // // // import { useUserStore } from "../../store/userStore";

// // // // // // // // // type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

// // // // // // // // // interface Question {
// // // // // // // // //   number: number;
// // // // // // // // //   text: string;
// // // // // // // // //   type: string;
// // // // // // // // //   difficulty: string;
// // // // // // // // //   marks: number;
// // // // // // // // //   hint?: string;
// // // // // // // // // }

// // // // // // // // // interface Section {
// // // // // // // // //   title: string;
// // // // // // // // //   instruction: string;
// // // // // // // // //   questions: Question[];
// // // // // // // // // }

// // // // // // // // // interface Assignment {
// // // // // // // // //   _id: string;
// // // // // // // // //   class: string;
// // // // // // // // //   subject: string;
// // // // // // // // //   topic: string;
// // // // // // // // //   totalMarks: number;
// // // // // // // // //   timeAllowed: string;
// // // // // // // // //   instructions: string;
// // // // // // // // //   status: AssignmentStatus;
// // // // // // // // //   paper?: {
// // // // // // // // //     instructions: string;
// // // // // // // // //     sections: Section[];
// // // // // // // // //     studentInfo?: {
// // // // // // // // //       name: string;
// // // // // // // // //       rollNumber: string;
// // // // // // // // //       section: string;
// // // // // // // // //       class: string;
// // // // // // // // //       subject: string;
// // // // // // // // //       date: string;
// // // // // // // // //     };
// // // // // // // // //   };
// // // // // // // // //   errorMessage?: string;
// // // // // // // // // }

// // // // // // // // // export default function AssignmentPage() {
// // // // // // // // //   const { id } = useParams();
// // // // // // // // //   const router = useRouter();
// // // // // // // // //   const { user, token } = useUserStore();
// // // // // // // // //   const { downloadPDF, isLoaded: pdfLoaded } = usePDF();
  
// // // // // // // // //   const [assignment, setAssignment] = useState<Assignment | null>(null);
// // // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // // //   const [statusMessage, setStatusMessage] = useState("");
// // // // // // // // //   const [retryCount, setRetryCount] = useState(0);
// // // // // // // // //   const [socketError, setSocketError] = useState(false);
  
// // // // // // // // //   const pdfRef = useRef<HTMLDivElement>(null);
// // // // // // // // //   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // // // // // // // //   const fetchAssignment = useCallback(async () => {
// // // // // // // // //     try {
// // // // // // // // //       const response = await axios.get(
// // // // // // // // //         `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
// // // // // // // // //       );

// // // // // // // // //       const data = response.data.data;
// // // // // // // // //       setAssignment(data);

// // // // // // // // //       // Update status message based on current status
// // // // // // // // //       switch (data.status) {
// // // // // // // // //         case "pending":
// // // // // // // // //           setStatusMessage("⏳ Assignment is queued. Waiting for processing...");
// // // // // // // // //           break;
// // // // // // // // //         case "processing":
// // // // // // // // //           setStatusMessage("🤖 AI is generating your assignment. This may take 30-60 seconds...");
// // // // // // // // //           break;
// // // // // // // // //         case "completed":
// // // // // // // // //           setStatusMessage("✅ Assignment ready!");
// // // // // // // // //           setLoading(false);
// // // // // // // // //           // Stop polling if active
// // // // // // // // //           if (pollIntervalRef.current) {
// // // // // // // // //             clearInterval(pollIntervalRef.current);
// // // // // // // // //             pollIntervalRef.current = null;
// // // // // // // // //           }
// // // // // // // // //           break;
// // // // // // // // //         case "failed":
// // // // // // // // //           setStatusMessage(`❌ Failed: ${data.errorMessage || "Unknown error"}`);
// // // // // // // // //           setLoading(false);
// // // // // // // // //           break;
// // // // // // // // //       }

// // // // // // // // //       // If not completed, continue loading
// // // // // // // // //       if (data.status !== "completed") {
// // // // // // // // //         setLoading(true);
// // // // // // // // //       } else {
// // // // // // // // //         setLoading(false);
// // // // // // // // //       }

// // // // // // // // //     } catch (err: any) {
// // // // // // // // //       console.error("Fetch assignment error:", err);
// // // // // // // // //       if (err?.response?.status === 404) {
// // // // // // // // //         setStatusMessage("❌ Assignment not found");
// // // // // // // // //       } else {
// // // // // // // // //         setStatusMessage("❌ Failed to load assignment");
// // // // // // // // //       }
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   }, [id]);

// // // // // // // // //   // Polling fallback for socket disconnection
// // // // // // // // //   const startPolling = useCallback(() => {
// // // // // // // // //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
// // // // // // // // //     pollIntervalRef.current = setInterval(() => {
// // // // // // // // //       if (assignment?.status === "completed" || assignment?.status === "failed") {
// // // // // // // // //         if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // // // //         return;
// // // // // // // // //       }
// // // // // // // // //       fetchAssignment();
// // // // // // // // //     }, 5000); // Poll every 5 seconds as fallback
// // // // // // // // //   }, [assignment?.status, fetchAssignment]);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     fetchAssignment();
    
// // // // // // // // //     // Setup socket connection
// // // // // // // // //     let socket: any = null;
// // // // // // // // //     let unsubscribe: (() => void) | null = null;
    
// // // // // // // // //     try {
// // // // // // // // //       socket = getSocket(token || undefined);
// // // // // // // // //       joinAssignmentRoom(id as string, token || undefined);
      
// // // // // // // // //       // Listen for assignment updates
// // // // // // // // //       unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
// // // // // // // // //         console.log("Socket update:", data);
// // // // // // // // //         setSocketError(false);
        
// // // // // // // // //         setAssignment((prev) => {
// // // // // // // // //           if (!prev) return prev;
// // // // // // // // //           return {
// // // // // // // // //             ...prev,
// // // // // // // // //             status: data.status,
// // // // // // // // //             paper: data.data || prev.paper,
// // // // // // // // //             errorMessage: data.error,
// // // // // // // // //           };
// // // // // // // // //         });

// // // // // // // // //         // Update status message
// // // // // // // // //         if (data.status === "processing") {
// // // // // // // // //           setStatusMessage("🤖 AI is generating your assignment...");
// // // // // // // // //           setLoading(true);
// // // // // // // // //         } else if (data.status === "completed") {
// // // // // // // // //           setStatusMessage("✅ Assignment ready!");
// // // // // // // // //           setLoading(false);
// // // // // // // // //           if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // // // //         } else if (data.status === "failed") {
// // // // // // // // //           setStatusMessage(`❌ Failed: ${data.error || "Unknown error"}`);
// // // // // // // // //           setLoading(false);
// // // // // // // // //         } else if (data.status === "ai_attempt") {
// // // // // // // // //           setStatusMessage(`🧠 AI attempt ${data.attempt || 1}...`);
// // // // // // // // //         } else if (data.status === "retrying") {
// // // // // // // // //           setStatusMessage(`🔄 Retrying... Reason: ${data.reason || "unknown"}`);
// // // // // // // // //         } else if (data.status === "switching_provider") {
// // // // // // // // //           setStatusMessage(`🔄 Switching from ${data.from} to ${data.to}...`);
// // // // // // // // //         }
// // // // // // // // //       }, token || undefined);
      
// // // // // // // // //       // Start polling as fallback
// // // // // // // // //       startPolling();
      
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error("Socket connection error:", err);
// // // // // // // // //       setSocketError(true);
// // // // // // // // //       startPolling(); // Use polling if socket fails
// // // // // // // // //     }

// // // // // // // // //     return () => {
// // // // // // // // //       if (unsubscribe) unsubscribe();
// // // // // // // // //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // // // //     };
// // // // // // // // //   }, [id, fetchAssignment, token, startPolling]);

// // // // // // // // //   const handleDownloadPDF = () => {
// // // // // // // // //     if (pdfRef.current) {
// // // // // // // // //       downloadPDF(pdfRef.current, `${assignment?.topic || "assignment"}.pdf`);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleRetry = () => {
// // // // // // // // //     setRetryCount(prev => prev + 1);
// // // // // // // // //     fetchAssignment();
// // // // // // // // //   };

// // // // // // // // //   // Loading UI with animation
// // // // // // // // //   if (loading) {
// // // // // // // // //     return (
// // // // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // // // //         <Header />
// // // // // // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // // // // // //           <div className="relative">
// // // // // // // // //             <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
// // // // // // // // //             <div className="absolute inset-0 flex items-center justify-center">
// // // // // // // // //               <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
// // // // // // // // //             </div>
// // // // // // // // //           </div>
// // // // // // // // //           <h2 className="text-xl font-semibold mt-6 text-center">
// // // // // // // // //             {statusMessage || "Preparing your assignment..."}
// // // // // // // // //           </h2>
// // // // // // // // //           {socketError && (
// // // // // // // // //             <p className="text-gray-500 text-sm mt-2">
// // // // // // // // //               ⚠️ Real-time connection lost. Updates may be delayed.
// // // // // // // // //             </p>
// // // // // // // // //           )}
// // // // // // // // //           <p className="text-gray-400 text-sm mt-4">
// // // // // // // // //             Please don't close this page
// // // // // // // // //           </p>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   // Failed UI
// // // // // // // // //   if (assignment?.status === "failed") {
// // // // // // // // //     return (
// // // // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // // // //         <Header />
// // // // // // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // // // // // //           <div className="text-center">
// // // // // // // // //             <div className="text-6xl mb-4">❌</div>
// // // // // // // // //             <h2 className="text-2xl font-bold text-red-500 mb-2">
// // // // // // // // //               Generation Failed
// // // // // // // // //             </h2>
// // // // // // // // //             <p className="text-gray-400 mb-6 max-w-md">
// // // // // // // // //               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
// // // // // // // // //             </p>
// // // // // // // // //             <div className="flex gap-4 justify-center">
// // // // // // // // //               <button
// // // // // // // // //                 onClick={handleRetry}
// // // // // // // // //                 className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
// // // // // // // // //               >
// // // // // // // // //                 Try Again
// // // // // // // // //               </button>
// // // // // // // // //               <button
// // // // // // // // //                 onClick={() => router.push("/create-assignment")}
// // // // // // // // //                 className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
// // // // // // // // //               >
// // // // // // // // //                 Create New
// // // // // // // // //               </button>
// // // // // // // // //             </div>
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   // Completed UI
// // // // // // // // //   if (assignment?.status === "completed" && assignment.paper) {
// // // // // // // // //     const paper = assignment.paper;
    
// // // // // // // // //     return (
// // // // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // // // //         <Header />
        
// // // // // // // // //         <div className="max-w-4xl mx-auto p-6">
// // // // // // // // //           {/* Action Bar */}
// // // // // // // // //           <div className="flex justify-end gap-3 mb-6">
// // // // // // // // //             <button
// // // // // // // // //               onClick={handleDownloadPDF}
// // // // // // // // //               disabled={!pdfLoaded}
// // // // // // // // //               className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
// // // // // // // // //             >
// // // // // // // // //               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // // // // // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
// // // // // // // // //               </svg>
// // // // // // // // //               Download PDF
// // // // // // // // //             </button>
// // // // // // // // //             <button
// // // // // // // // //               onClick={() => router.push("/create-assignment")}
// // // // // // // // //               className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition"
// // // // // // // // //             >
// // // // // // // // //               New Assignment
// // // // // // // // //             </button>
// // // // // // // // //           </div>

// // // // // // // // //           {/* PDF Content - Clean for printing */}
// // // // // // // // //           <div
// // // // // // // // //             ref={pdfRef}
// // // // // // // // //             className="bg-white text-black p-8 rounded-lg shadow-xl"
// // // // // // // // //             style={{ fontFamily: "'Times New Roman', serif" }}
// // // // // // // // //           >
// // // // // // // // //             {/* Header */}
// // // // // // // // //             <div className="text-center mb-8">
// // // // // // // // //               <h1 className="text-3xl font-bold mb-2">Question Paper</h1>
// // // // // // // // //               <div className="border-b-2 border-gray-300 w-24 mx-auto"></div>
// // // // // // // // //             </div>

// // // // // // // // //             {/* Student Info */}
// // // // // // // // //             <div className="grid grid-cols-3 gap-4 mb-8 text-sm border-b border-gray-200 pb-4">
// // // // // // // // //               <div>Name: <span className="border-b border-gray-400 inline-block w-32">___________</span></div>
// // // // // // // // //               <div>Roll No: <span className="border-b border-gray-400 inline-block w-24">________</span></div>
// // // // // // // // //               <div>Section: <span className="border-b border-gray-400 inline-block w-24">________</span></div>
// // // // // // // // //             </div>

// // // // // // // // //             {/* Meta Info */}
// // // // // // // // //             <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-gray-50 p-4 rounded">
// // // // // // // // //               <div><strong>Class:</strong> {assignment.class}</div>
// // // // // // // // //               <div><strong>Subject:</strong> {assignment.subject}</div>
// // // // // // // // //               <div><strong>Topic:</strong> {assignment.topic}</div>
// // // // // // // // //               <div><strong>Total Marks:</strong> {assignment.totalMarks}</div>
// // // // // // // // //               <div><strong>Time Allowed:</strong> {assignment.timeAllowed}</div>
// // // // // // // // //               <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
// // // // // // // // //             </div>

// // // // // // // // //             {/* Instructions */}
// // // // // // // // //             <div className="mb-8">
// // // // // // // // //               <h2 className="font-bold text-lg mb-2">Instructions:</h2>
// // // // // // // // //               <p className="text-sm border-l-4 border-orange-500 pl-3">{paper.instructions}</p>
// // // // // // // // //             </div>

// // // // // // // // //             {/* Sections */}
// // // // // // // // //             {paper.sections?.map((section, idx) => (
// // // // // // // // //               <div key={idx} className="mb-8">
// // // // // // // // //                 <h2 className="font-bold text-xl mb-2">{section.title}</h2>
// // // // // // // // //                 <p className="text-sm text-gray-600 mb-4">{section.instruction}</p>
                
// // // // // // // // //                 {section.questions?.map((q, i) => (
// // // // // // // // //                   <div key={i} className="mb-5 pb-3 border-b border-gray-200">
// // // // // // // // //                     <div className="flex justify-between gap-4">
// // // // // // // // //                       <p className="flex-1">
// // // // // // // // //                         <strong>{q.number}.</strong> {q.text}
// // // // // // // // //                       </p>
// // // // // // // // //                       <div className="text-right text-sm">
// // // // // // // // //                         <span className="text-gray-600">{q.difficulty}</span>
// // // // // // // // //                         <br />
// // // // // // // // //                         <span className="font-semibold">{q.marks} marks</span>
// // // // // // // // //                       </div>
// // // // // // // // //                     </div>
// // // // // // // // //                     {q.hint && (
// // // // // // // // //                       <p className="text-xs text-gray-500 mt-2 italic">
// // // // // // // // //                         💡 Hint: {q.hint}
// // // // // // // // //                       </p>
// // // // // // // // //                     )}
// // // // // // // // //                   </div>
// // // // // // // // //                 ))}
// // // // // // // // //               </div>
// // // // // // // // //             ))}

// // // // // // // // //             {/* Footer */}
// // // // // // // // //             <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
// // // // // // // // //               Good Luck! 📝
// // // // // // // // //             </div>
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   return null;
// // // // // // // // // }




// // // // // // // // "use client";

// // // // // // // // import { useEffect, useRef, useState, useCallback } from "react";
// // // // // // // // import { useParams, useRouter } from "next/navigation";
// // // // // // // // import axios from "axios";
// // // // // // // // import Header from "@/components/layout/Header";
// // // // // // // // import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// // // // // // // // import { printPDF } from "../../lib/printPdf";
// // // // // // // // import { useUserStore } from "../../store/userStore";

// // // // // // // // type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

// // // // // // // // interface Question {
// // // // // // // //   number: number;
// // // // // // // //   text: string;
// // // // // // // //   type: string;
// // // // // // // //   difficulty: string;
// // // // // // // //   marks: number;
// // // // // // // //   hint?: string;
// // // // // // // // }

// // // // // // // // interface Section {
// // // // // // // //   title: string;
// // // // // // // //   instruction: string;
// // // // // // // //   questions: Question[];
// // // // // // // // }

// // // // // // // // interface Assignment {
// // // // // // // //   _id: string;
// // // // // // // //   class: string;
// // // // // // // //   subject: string;
// // // // // // // //   topic: string;
// // // // // // // //   totalMarks: number;
// // // // // // // //   timeAllowed: string;
// // // // // // // //   instructions: string;
// // // // // // // //   status: AssignmentStatus;
// // // // // // // //   paper?: {
// // // // // // // //     instructions: string;
// // // // // // // //     sections: Section[];
// // // // // // // //     studentInfo?: {
// // // // // // // //       name: string;
// // // // // // // //       rollNumber: string;
// // // // // // // //       section: string;
// // // // // // // //       class: string;
// // // // // // // //       subject: string;
// // // // // // // //       date: string;
// // // // // // // //     };
// // // // // // // //   };
// // // // // // // //   errorMessage?: string;
// // // // // // // // }

// // // // // // // // export default function AssignmentPage() {
// // // // // // // //   const { id } = useParams();
// // // // // // // //   const router = useRouter();
// // // // // // // //   const { user, token } = useUserStore();
  
// // // // // // // //   const [assignment, setAssignment] = useState<Assignment | null>(null);
// // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // //   const [statusMessage, setStatusMessage] = useState("");
// // // // // // // //   const [retryCount, setRetryCount] = useState(0);
// // // // // // // //   const [socketError, setSocketError] = useState(false);
  
// // // // // // // //   const pdfRef = useRef<HTMLDivElement>(null);
// // // // // // // //   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // // // // // // //   const fetchAssignment = useCallback(async () => {
// // // // // // // //     try {
// // // // // // // //       const response = await axios.get(
// // // // // // // //         `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
// // // // // // // //       );

// // // // // // // //       const data = response.data.data;
// // // // // // // //       setAssignment(data);

// // // // // // // //       // Update status message based on current status
// // // // // // // //       switch (data.status) {
// // // // // // // //         case "pending":
// // // // // // // //           setStatusMessage("⏳ Assignment is queued. Waiting for processing...");
// // // // // // // //           break;
// // // // // // // //         case "processing":
// // // // // // // //           setStatusMessage("🤖 AI is generating your assignment. This may take 30-60 seconds...");
// // // // // // // //           break;
// // // // // // // //         case "completed":
// // // // // // // //           setStatusMessage("✅ Assignment ready!");
// // // // // // // //           setLoading(false);
// // // // // // // //           if (pollIntervalRef.current) {
// // // // // // // //             clearInterval(pollIntervalRef.current);
// // // // // // // //             pollIntervalRef.current = null;
// // // // // // // //           }
// // // // // // // //           break;
// // // // // // // //         case "failed":
// // // // // // // //           setStatusMessage(`❌ Failed: ${data.errorMessage || "Unknown error"}`);
// // // // // // // //           setLoading(false);
// // // // // // // //           break;
// // // // // // // //       }

// // // // // // // //       if (data.status !== "completed") {
// // // // // // // //         setLoading(true);
// // // // // // // //       } else {
// // // // // // // //         setLoading(false);
// // // // // // // //       }

// // // // // // // //     } catch (err: any) {
// // // // // // // //       console.error("Fetch assignment error:", err);
// // // // // // // //       if (err?.response?.status === 404) {
// // // // // // // //         setStatusMessage("❌ Assignment not found");
// // // // // // // //       } else {
// // // // // // // //         setStatusMessage("❌ Failed to load assignment");
// // // // // // // //       }
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   }, [id]);

// // // // // // // //   const startPolling = useCallback(() => {
// // // // // // // //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
// // // // // // // //     pollIntervalRef.current = setInterval(() => {
// // // // // // // //       if (assignment?.status === "completed" || assignment?.status === "failed") {
// // // // // // // //         if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // // //         return;
// // // // // // // //       }
// // // // // // // //       fetchAssignment();
// // // // // // // //     }, 5000);
// // // // // // // //   }, [assignment?.status, fetchAssignment]);

// // // // // // // //   useEffect(() => {
// // // // // // // //     fetchAssignment();
    
// // // // // // // //     let socket: any = null;
// // // // // // // //     let unsubscribe: (() => void) | null = null;
    
// // // // // // // //     try {
// // // // // // // //       socket = getSocket(token || undefined);
// // // // // // // //       joinAssignmentRoom(id as string, token || undefined);
      
// // // // // // // //       unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
// // // // // // // //         console.log("Socket update:", data);
// // // // // // // //         setSocketError(false);
        
// // // // // // // //         setAssignment((prev) => {
// // // // // // // //           if (!prev) return prev;
// // // // // // // //           return {
// // // // // // // //             ...prev,
// // // // // // // //             status: data.status,
// // // // // // // //             paper: data.data || prev.paper,
// // // // // // // //             errorMessage: data.error,
// // // // // // // //           };
// // // // // // // //         });

// // // // // // // //         if (data.status === "processing") {
// // // // // // // //           setStatusMessage("🤖 AI is generating your assignment...");
// // // // // // // //           setLoading(true);
// // // // // // // //         } else if (data.status === "completed") {
// // // // // // // //           setStatusMessage("✅ Assignment ready!");
// // // // // // // //           setLoading(false);
// // // // // // // //           if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // // //         } else if (data.status === "failed") {
// // // // // // // //           setStatusMessage(`❌ Failed: ${data.error || "Unknown error"}`);
// // // // // // // //           setLoading(false);
// // // // // // // //         } else if (data.status === "ai_attempt") {
// // // // // // // //           setStatusMessage(`🧠 AI attempt ${data.attempt || 1}...`);
// // // // // // // //         } else if (data.status === "retrying") {
// // // // // // // //           setStatusMessage(`🔄 Retrying... Reason: ${data.reason || "unknown"}`);
// // // // // // // //         } else if (data.status === "switching_provider") {
// // // // // // // //           setStatusMessage(`🔄 Switching from ${data.from} to ${data.to}...`);
// // // // // // // //         }
// // // // // // // //       }, token || undefined);
      
// // // // // // // //       startPolling();
      
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error("Socket connection error:", err);
// // // // // // // //       setSocketError(true);
// // // // // // // //       startPolling();
// // // // // // // //     }

// // // // // // // //     return () => {
// // // // // // // //       if (unsubscribe) unsubscribe();
// // // // // // // //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // // //     };
// // // // // // // //   }, [id, fetchAssignment, token, startPolling]);

// // // // // // // //   const handlePrint = () => {
// // // // // // // //     if (pdfRef.current) {
// // // // // // // //       printPDF(pdfRef.current, `${assignment?.topic || "assignment"}`);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleRetry = () => {
// // // // // // // //     setRetryCount(prev => prev + 1);
// // // // // // // //     fetchAssignment();
// // // // // // // //   };

// // // // // // // //   if (loading) {
// // // // // // // //     return (
// // // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // // //         <Header />
// // // // // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // // // // //           <div className="relative">
// // // // // // // //             <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
// // // // // // // //             <div className="absolute inset-0 flex items-center justify-center">
// // // // // // // //               <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
// // // // // // // //             </div>
// // // // // // // //           </div>
// // // // // // // //           <h2 className="text-xl font-semibold mt-6 text-center">
// // // // // // // //             {statusMessage || "Preparing your assignment..."}
// // // // // // // //           </h2>
// // // // // // // //           {socketError && (
// // // // // // // //             <p className="text-gray-500 text-sm mt-2">
// // // // // // // //               ⚠️ Real-time connection lost. Updates may be delayed.
// // // // // // // //             </p>
// // // // // // // //           )}
// // // // // // // //           <p className="text-gray-400 text-sm mt-4">
// // // // // // // //             Please don't close this page
// // // // // // // //           </p>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   if (assignment?.status === "failed") {
// // // // // // // //     return (
// // // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // // //         <Header />
// // // // // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // // // // //           <div className="text-center">
// // // // // // // //             <div className="text-6xl mb-4">❌</div>
// // // // // // // //             <h2 className="text-2xl font-bold text-red-500 mb-2">
// // // // // // // //               Generation Failed
// // // // // // // //             </h2>
// // // // // // // //             <p className="text-gray-400 mb-6 max-w-md">
// // // // // // // //               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
// // // // // // // //             </p>
// // // // // // // //             <div className="flex gap-4 justify-center">
// // // // // // // //               <button
// // // // // // // //                 onClick={handleRetry}
// // // // // // // //                 className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
// // // // // // // //               >
// // // // // // // //                 Try Again
// // // // // // // //               </button>
// // // // // // // //               <button
// // // // // // // //                 onClick={() => router.push("/create-assignment")}
// // // // // // // //                 className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
// // // // // // // //               >
// // // // // // // //                 Create New
// // // // // // // //               </button>
// // // // // // // //             </div>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   if (assignment?.status === "completed" && assignment.paper) {
// // // // // // // //     const paper = assignment.paper;
    
// // // // // // // //     return (
// // // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // // //         <Header />
        
// // // // // // // //         <div className="max-w-4xl mx-auto p-6">
// // // // // // // //           <div className="flex justify-end gap-3 mb-6">
// // // // // // // //             <button
// // // // // // // //               onClick={handlePrint}
// // // // // // // //               className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
// // // // // // // //             >
// // // // // // // //               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // // // // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
// // // // // // // //               </svg>
// // // // // // // //               Print / Save as PDF
// // // // // // // //             </button>
// // // // // // // //             <button
// // // // // // // //               onClick={() => router.push("/create-assignment")}
// // // // // // // //               className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition"
// // // // // // // //             >
// // // // // // // //               New Assignment
// // // // // // // //             </button>
// // // // // // // //           </div>

// // // // // // // //           <div
// // // // // // // //             ref={pdfRef}
// // // // // // // //             className="bg-white text-black p-8 rounded-lg shadow-xl"
// // // // // // // //             style={{ fontFamily: "'Times New Roman', serif" }}
// // // // // // // //           >
// // // // // // // //             <div className="text-center mb-8">
// // // // // // // //               <h1 className="text-3xl font-bold mb-2">Question Paper</h1>
// // // // // // // //               <div className="border-b-2 border-gray-300 w-24 mx-auto"></div>
// // // // // // // //             </div>

// // // // // // // //             <div className="grid grid-cols-3 gap-4 mb-8 text-sm border-b border-gray-200 pb-4">
// // // // // // // //               <div>Name: <span className="border-b border-gray-400 inline-block w-32">___________</span></div>
// // // // // // // //               <div>Roll No: <span className="border-b border-gray-400 inline-block w-24">________</span></div>
// // // // // // // //               <div>Section: <span className="border-b border-gray-400 inline-block w-24">________</span></div>
// // // // // // // //             </div>

// // // // // // // //             <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-gray-50 p-4 rounded">
// // // // // // // //               <div><strong>Class:</strong> {assignment.class}</div>
// // // // // // // //               <div><strong>Subject:</strong> {assignment.subject}</div>
// // // // // // // //               <div><strong>Topic:</strong> {assignment.topic}</div>
// // // // // // // //               <div><strong>Total Marks:</strong> {assignment.totalMarks}</div>
// // // // // // // //               <div><strong>Time Allowed:</strong> {assignment.timeAllowed}</div>
// // // // // // // //               <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
// // // // // // // //             </div>

// // // // // // // //             <div className="mb-8">
// // // // // // // //               <h2 className="font-bold text-lg mb-2">Instructions:</h2>
// // // // // // // //               <p className="text-sm border-l-4 border-orange-500 pl-3">{paper.instructions}</p>
// // // // // // // //             </div>

// // // // // // // //             {paper.sections?.map((section, idx) => (
// // // // // // // //               <div key={idx} className="mb-8">
// // // // // // // //                 <h2 className="font-bold text-xl mb-2">{section.title}</h2>
// // // // // // // //                 <p className="text-sm text-gray-600 mb-4">{section.instruction}</p>
                
// // // // // // // //                 {section.questions?.map((q, i) => (
// // // // // // // //                   <div key={i} className="mb-5 pb-3 border-b border-gray-200">
// // // // // // // //                     <div className="flex justify-between gap-4">
// // // // // // // //                       <p className="flex-1">
// // // // // // // //                         <strong>{q.number}.</strong> {q.text}
// // // // // // // //                       </p>
// // // // // // // //                       <div className="text-right text-sm">
// // // // // // // //                         <span className="text-gray-600">{q.difficulty}</span>
// // // // // // // //                         <br />
// // // // // // // //                         <span className="font-semibold">{q.marks} marks</span>
// // // // // // // //                       </div>
// // // // // // // //                     </div>
// // // // // // // //                     {q.hint && (
// // // // // // // //                       <p className="text-xs text-gray-500 mt-2 italic">
// // // // // // // //                         💡 Hint: {q.hint}
// // // // // // // //                       </p>
// // // // // // // //                     )}
// // // // // // // //                   </div>
// // // // // // // //                 ))}
// // // // // // // //               </div>
// // // // // // // //             ))}

// // // // // // // //             <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
// // // // // // // //               Good Luck! 📝
// // // // // // // //             </div>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return null;
// // // // // // // // }



// // // // // // // "use client";

// // // // // // // import { useEffect, useRef, useState, useCallback } from "react";
// // // // // // // import { useParams, useRouter } from "next/navigation";
// // // // // // // import axios from "axios";
// // // // // // // import Header from "@/components/layout/Header";
// // // // // // // import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// // // // // // // import { printPDF } from "../../lib/printPdf";
// // // // // // // import { useUserStore } from "../../store/userStore";

// // // // // // // type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

// // // // // // // interface Question {
// // // // // // //   number: number;
// // // // // // //   text: string;
// // // // // // //   type: string;
// // // // // // //   difficulty: string;
// // // // // // //   marks: number;
// // // // // // //   hint?: string;
// // // // // // // }

// // // // // // // interface Section {
// // // // // // //   title: string;
// // // // // // //   instruction: string;
// // // // // // //   questions: Question[];
// // // // // // // }

// // // // // // // interface Assignment {
// // // // // // //   _id: string;
// // // // // // //   schoolName?: string;
// // // // // // //   class: string;
// // // // // // //   subject: string;
// // // // // // //   topic: string;
// // // // // // //   totalMarks: number;
// // // // // // //   timeAllowed: string;
// // // // // // //   instructions: string;
// // // // // // //   status: AssignmentStatus;
// // // // // // //   paper?: {
// // // // // // //     instructions: string;
// // // // // // //     sections: Section[];
// // // // // // //     studentInfo?: {
// // // // // // //       name: string;
// // // // // // //       rollNumber: string;
// // // // // // //       section: string;
// // // // // // //       class: string;
// // // // // // //       subject: string;
// // // // // // //       date: string;
// // // // // // //     };
// // // // // // //   };
// // // // // // //   errorMessage?: string;
// // // // // // // }

// // // // // // // export default function AssignmentPage() {
// // // // // // //   const { id } = useParams();
// // // // // // //   const router = useRouter();
// // // // // // //   const { user, token } = useUserStore();
  
// // // // // // //   const [assignment, setAssignment] = useState<Assignment | null>(null);
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [statusMessage, setStatusMessage] = useState("");
// // // // // // //   const [retryCount, setRetryCount] = useState(0);
// // // // // // //   const [socketError, setSocketError] = useState(false);
  
// // // // // // //   const pdfRef = useRef<HTMLDivElement>(null);
// // // // // // //   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // // // // // //   const fetchAssignment = useCallback(async () => {
// // // // // // //     try {
// // // // // // //       const response = await axios.get(
// // // // // // //         `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
// // // // // // //       );

// // // // // // //       const data = response.data.data;
// // // // // // //       setAssignment(data);

// // // // // // //       switch (data.status) {
// // // // // // //         case "pending":
// // // // // // //           setStatusMessage("Assignment is queued. Waiting for processing...");
// // // // // // //           break;
// // // // // // //         case "processing":
// // // // // // //           setStatusMessage("AI is generating your assignment. This may take 30-60 seconds...");
// // // // // // //           break;
// // // // // // //         case "completed":
// // // // // // //           setStatusMessage("Assignment ready!");
// // // // // // //           setLoading(false);
// // // // // // //           if (pollIntervalRef.current) {
// // // // // // //             clearInterval(pollIntervalRef.current);
// // // // // // //             pollIntervalRef.current = null;
// // // // // // //           }
// // // // // // //           break;
// // // // // // //         case "failed":
// // // // // // //           setStatusMessage(`Failed: ${data.errorMessage || "Unknown error"}`);
// // // // // // //           setLoading(false);
// // // // // // //           break;
// // // // // // //       }

// // // // // // //       if (data.status !== "completed") {
// // // // // // //         setLoading(true);
// // // // // // //       } else {
// // // // // // //         setLoading(false);
// // // // // // //       }

// // // // // // //     } catch (err: any) {
// // // // // // //       console.error("Fetch assignment error:", err);
// // // // // // //       if (err?.response?.status === 404) {
// // // // // // //         setStatusMessage("Assignment not found");
// // // // // // //       } else {
// // // // // // //         setStatusMessage("Failed to load assignment");
// // // // // // //       }
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   }, [id]);

// // // // // // //   const startPolling = useCallback(() => {
// // // // // // //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
// // // // // // //     pollIntervalRef.current = setInterval(() => {
// // // // // // //       if (assignment?.status === "completed" || assignment?.status === "failed") {
// // // // // // //         if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // //         return;
// // // // // // //       }
// // // // // // //       fetchAssignment();
// // // // // // //     }, 5000);
// // // // // // //   }, [assignment?.status, fetchAssignment]);

// // // // // // //   useEffect(() => {
// // // // // // //     fetchAssignment();
    
// // // // // // //     let socket: any = null;
// // // // // // //     let unsubscribe: (() => void) | null = null;
    
// // // // // // //     try {
// // // // // // //       socket = getSocket(token || undefined);
// // // // // // //       joinAssignmentRoom(id as string, token || undefined);
      
// // // // // // //       unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
// // // // // // //         console.log("Socket update:", data);
// // // // // // //         setSocketError(false);
        
// // // // // // //         setAssignment((prev) => {
// // // // // // //           if (!prev) return prev;
// // // // // // //           return {
// // // // // // //             ...prev,
// // // // // // //             status: data.status,
// // // // // // //             paper: data.data || prev.paper,
// // // // // // //             errorMessage: data.error,
// // // // // // //           };
// // // // // // //         });

// // // // // // //         if (data.status === "processing") {
// // // // // // //           setStatusMessage("AI is generating your assignment...");
// // // // // // //           setLoading(true);
// // // // // // //         } else if (data.status === "completed") {
// // // // // // //           setStatusMessage("Assignment ready!");
// // // // // // //           setLoading(false);
// // // // // // //           if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // //         } else if (data.status === "failed") {
// // // // // // //           setStatusMessage(`Failed: ${data.error || "Unknown error"}`);
// // // // // // //           setLoading(false);
// // // // // // //         } else if (data.status === "ai_attempt") {
// // // // // // //           setStatusMessage(`AI attempt ${data.attempt || 1}...`);
// // // // // // //         } else if (data.status === "retrying") {
// // // // // // //           setStatusMessage(`Retrying... Reason: ${data.reason || "unknown"}`);
// // // // // // //         } else if (data.status === "switching_provider") {
// // // // // // //           setStatusMessage(`Switching from ${data.from} to ${data.to}...`);
// // // // // // //         }
// // // // // // //       }, token || undefined);
      
// // // // // // //       startPolling();
      
// // // // // // //     } catch (err) {
// // // // // // //       console.error("Socket connection error:", err);
// // // // // // //       setSocketError(true);
// // // // // // //       startPolling();
// // // // // // //     }

// // // // // // //     return () => {
// // // // // // //       if (unsubscribe) unsubscribe();
// // // // // // //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // // //     };
// // // // // // //   }, [id, fetchAssignment, token, startPolling]);

// // // // // // //   const handlePrint = () => {
// // // // // // //     if (pdfRef.current) {
// // // // // // //       printPDF(pdfRef.current, `${assignment?.topic || "assignment"}`);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleRetry = () => {
// // // // // // //     setRetryCount(prev => prev + 1);
// // // // // // //     fetchAssignment();
// // // // // // //   };

// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // //         <Header />
// // // // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // // // //           <div className="relative">
// // // // // // //             <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
// // // // // // //             <div className="absolute inset-0 flex items-center justify-center">
// // // // // // //               <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //           <h2 className="text-xl font-semibold mt-6 text-center">
// // // // // // //             {statusMessage || "Preparing your assignment..."}
// // // // // // //           </h2>
// // // // // // //           {socketError && (
// // // // // // //             <p className="text-gray-500 text-sm mt-2">
// // // // // // //               Real-time connection lost. Updates may be delayed.
// // // // // // //             </p>
// // // // // // //           )}
// // // // // // //           <p className="text-gray-400 text-sm mt-4">
// // // // // // //             Please don't close this page
// // // // // // //           </p>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   if (assignment?.status === "failed") {
// // // // // // //     return (
// // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // //         <Header />
// // // // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // // // //           <div className="text-center">
// // // // // // //             <div className="text-6xl mb-4">✗</div>
// // // // // // //             <h2 className="text-2xl font-bold text-red-500 mb-2">
// // // // // // //               Generation Failed
// // // // // // //             </h2>
// // // // // // //             <p className="text-gray-400 mb-6 max-w-md">
// // // // // // //               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
// // // // // // //             </p>
// // // // // // //             <div className="flex gap-4 justify-center">
// // // // // // //               <button
// // // // // // //                 onClick={handleRetry}
// // // // // // //                 className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
// // // // // // //               >
// // // // // // //                 Try Again
// // // // // // //               </button>
// // // // // // //               <button
// // // // // // //                 onClick={() => router.push("/create-assignment")}
// // // // // // //                 className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
// // // // // // //               >
// // // // // // //                 Create New
// // // // // // //               </button>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   if (assignment?.status === "completed" && assignment.paper) {
// // // // // // //     const paper = assignment.paper;
// // // // // // //     const currentDate = new Date().toLocaleDateString('en-GB');
    
// // // // // // //     return (
// // // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // // //         <Header />
        
// // // // // // //         <div className="max-w-4xl mx-auto p-6">
// // // // // // //           <div className="flex justify-end gap-3 mb-6">
// // // // // // //             <button
// // // // // // //               onClick={handlePrint}
// // // // // // //               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
// // // // // // //             >
// // // // // // //               Print / Save as PDF
// // // // // // //             </button>
// // // // // // //             <button
// // // // // // //               onClick={() => router.push("/create-assignment")}
// // // // // // //               className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition text-sm font-medium"
// // // // // // //             >
// // // // // // //               New Assignment
// // // // // // //             </button>
// // // // // // //           </div>

// // // // // // //           {/* Professional Question Paper Format */}
// // // // // // //           <div
// // // // // // //             ref={pdfRef}
// // // // // // //             className="bg-white text-black p-8 shadow-xl"
// // // // // // //             style={{ fontFamily: "'Times New Roman', Times, serif" }}
// // // // // // //           >
// // // // // // //             {/* School Name Header */}
// // // // // // //             <div className="text-center mb-6">
// // // // // // //               {assignment.schoolName && (
// // // // // // //                 <>
// // // // // // //                   <h1 className="text-2xl font-bold uppercase tracking-wide">
// // // // // // //                     {assignment.schoolName}
// // // // // // //                   </h1>
// // // // // // //                   <div className="border-t-2 border-gray-800 w-32 mx-auto my-2"></div>
// // // // // // //                 </>
// // // // // // //               )}
// // // // // // //               <h2 className="text-xl font-semibold mt-2">
// // // // // // //                 {assignment.subject}
// // // // // // //               </h2>
// // // // // // //               <h3 className="text-lg font-medium">
// // // // // // //                 Class: {assignment.class}
// // // // // // //               </h3>
// // // // // // //               <p className="text-base mt-1">
// // // // // // //                 Topic: {assignment.topic}
// // // // // // //               </p>
// // // // // // //             </div>

// // // // // // //             {/* Exam Details */}
// // // // // // //             <div className="flex justify-between items-center border-b border-gray-400 pb-2 mb-4 text-sm">
// // // // // // //               <div>Time Allowed: <span className="font-semibold">{assignment.timeAllowed}</span></div>
// // // // // // //               <div>Maximum Marks: <span className="font-semibold">{assignment.totalMarks}</span></div>
// // // // // // //               <div>Date: <span className="font-semibold">{currentDate}</span></div>
// // // // // // //             </div>

// // // // // // //             {/* Student Information */}
// // // // // // //             <div className="grid grid-cols-3 gap-4 mb-6 text-sm border-b border-gray-300 pb-3">
// // // // // // //               <div>Name: <span className="border-b border-gray-400 inline-block w-32 ml-2">_________________</span></div>
// // // // // // //               <div>Roll No.: <span className="border-b border-gray-400 inline-block w-24 ml-2">________</span></div>
// // // // // // //               <div>Section: <span className="border-b border-gray-400 inline-block w-24 ml-2">________</span></div>
// // // // // // //             </div>

// // // // // // //             {/* General Instructions */}
// // // // // // //             <div className="mb-6">
// // // // // // //               <h4 className="font-bold text-base mb-1">General Instructions:</h4>
// // // // // // //               <p className="text-sm leading-relaxed pl-2">{paper.instructions}</p>
// // // // // // //             </div>

// // // // // // //             {/* Sections */}
// // // // // // //             {paper.sections?.map((section, idx) => (
// // // // // // //               <div key={idx} className="mb-8">
// // // // // // //                 <div className="border-t-2 border-gray-800 pt-3 mb-3">
// // // // // // //                   <h3 className="text-lg font-bold uppercase tracking-wide">
// // // // // // //                     {section.title}
// // // // // // //                   </h3>
// // // // // // //                   <p className="text-xs text-gray-600 italic mt-1">
// // // // // // //                     {section.instruction}
// // // // // // //                   </p>
// // // // // // //                 </div>
                
// // // // // // //                 {section.questions?.map((q, i) => (
// // // // // // //                   <div key={i} className="mb-4">
// // // // // // //                     <div className="flex justify-between items-start gap-4">
// // // // // // //                       <div className="flex-1">
// // // // // // //                         <p className="text-sm leading-relaxed">
// // // // // // //                           <span className="font-bold">{q.number}.</span>{' '}
// // // // // // //                           {q.text}
// // // // // // //                         </p>
// // // // // // //                         {q.hint && (
// // // // // // //                           <p className="text-xs text-gray-500 mt-1 italic pl-4">
// // // // // // //                             Hint: {q.hint}
// // // // // // //                           </p>
// // // // // // //                         )}
// // // // // // //                       </div>
// // // // // // //                       <div className="text-right min-w-[60px]">
// // // // // // //                         <span className="text-sm font-semibold border border-gray-300 px-2 py-0.5 rounded">
// // // // // // //                           {q.marks} marks
// // // // // // //                         </span>
// // // // // // //                       </div>
// // // // // // //                     </div>
// // // // // // //                   </div>
// // // // // // //                 ))}
// // // // // // //               </div>
// // // // // // //             ))}

// // // // // // //             {/* Footer */}
// // // // // // //             <div className="text-center text-sm text-gray-500 mt-8 pt-3 border-t border-gray-300">
// // // // // // //               Best of Luck!
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return null;
// // // // // // // }



// // // // // // "use client";

// // // // // // import { useEffect, useRef, useState, useCallback } from "react";
// // // // // // import { useParams, useRouter } from "next/navigation";
// // // // // // import axios from "axios";
// // // // // // import Header from "@/components/layout/Header";
// // // // // // import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// // // // // // import { printPDF } from "../../lib/printPdf";
// // // // // // import { useUserStore } from "../../store/userStore";

// // // // // // type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

// // // // // // interface Question {
// // // // // //   number: number;
// // // // // //   text: string;
// // // // // //   type: string;
// // // // // //   difficulty: string;
// // // // // //   marks: number;
// // // // // //   hint?: string;
// // // // // // }

// // // // // // interface Section {
// // // // // //   title: string;
// // // // // //   instruction: string;
// // // // // //   questions: Question[];
// // // // // // }

// // // // // // interface Assignment {
// // // // // //   _id: string;
// // // // // //   schoolName?: string;
// // // // // //   class: string;
// // // // // //   subject: string;
// // // // // //   topic: string;
// // // // // //   totalMarks: number;
// // // // // //   timeAllowed: string;
// // // // // //   instructions: string;
// // // // // //   status: AssignmentStatus;
// // // // // //   paper?: {
// // // // // //     instructions: string;
// // // // // //     sections: Section[];
// // // // // //     studentInfo?: {
// // // // // //       name: string;
// // // // // //       rollNumber: string;
// // // // // //       section: string;
// // // // // //       class: string;
// // // // // //       subject: string;
// // // // // //       date: string;
// // // // // //     };
// // // // // //   };
// // // // // //   errorMessage?: string;
// // // // // // }

// // // // // // export default function AssignmentPage() {
// // // // // //   const { id } = useParams();
// // // // // //   const router = useRouter();
// // // // // //   const { user, token } = useUserStore();
  
// // // // // //   const [assignment, setAssignment] = useState<Assignment | null>(null);
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [statusMessage, setStatusMessage] = useState("");
// // // // // //   const [retryCount, setRetryCount] = useState(0);
// // // // // //   const [socketError, setSocketError] = useState(false);
  
// // // // // //   const pdfRef = useRef<HTMLDivElement>(null);
// // // // // //   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // // // // //   const fetchAssignment = useCallback(async () => {
// // // // // //     try {
// // // // // //       const response = await axios.get(
// // // // // //         `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
// // // // // //       );

// // // // // //       const data = response.data.data;
// // // // // //       setAssignment(data);

// // // // // //       switch (data.status) {
// // // // // //         case "pending":
// // // // // //           setStatusMessage("Assignment is queued. Waiting for processing...");
// // // // // //           break;
// // // // // //         case "processing":
// // // // // //           setStatusMessage("AI is generating your assignment. This may take 30-60 seconds...");
// // // // // //           break;
// // // // // //         case "completed":
// // // // // //           setStatusMessage("Assignment ready!");
// // // // // //           setLoading(false);
// // // // // //           if (pollIntervalRef.current) {
// // // // // //             clearInterval(pollIntervalRef.current);
// // // // // //             pollIntervalRef.current = null;
// // // // // //           }
// // // // // //           break;
// // // // // //         case "failed":
// // // // // //           setStatusMessage(`Failed: ${data.errorMessage || "Unknown error"}`);
// // // // // //           setLoading(false);
// // // // // //           break;
// // // // // //       }

// // // // // //       if (data.status !== "completed") {
// // // // // //         setLoading(true);
// // // // // //       } else {
// // // // // //         setLoading(false);
// // // // // //       }

// // // // // //     } catch (err: any) {
// // // // // //       console.error("Fetch assignment error:", err);
// // // // // //       if (err?.response?.status === 404) {
// // // // // //         setStatusMessage("Assignment not found");
// // // // // //       } else {
// // // // // //         setStatusMessage("Failed to load assignment");
// // // // // //       }
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   }, [id]);

// // // // // //   const startPolling = useCallback(() => {
// // // // // //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
// // // // // //     pollIntervalRef.current = setInterval(() => {
// // // // // //       if (assignment?.status === "completed" || assignment?.status === "failed") {
// // // // // //         if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // //         return;
// // // // // //       }
// // // // // //       fetchAssignment();
// // // // // //     }, 5000);
// // // // // //   }, [assignment?.status, fetchAssignment]);

// // // // // //   useEffect(() => {
// // // // // //     fetchAssignment();
    
// // // // // //     let socket: any = null;
// // // // // //     let unsubscribe: (() => void) | null = null;
    
// // // // // //     try {
// // // // // //       socket = getSocket(token || undefined);
// // // // // //       joinAssignmentRoom(id as string, token || undefined);
      
// // // // // //       unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
// // // // // //         console.log("Socket update:", data);
// // // // // //         setSocketError(false);
        
// // // // // //         setAssignment((prev) => {
// // // // // //           if (!prev) return prev;
// // // // // //           return {
// // // // // //             ...prev,
// // // // // //             status: data.status,
// // // // // //             paper: data.data || prev.paper,
// // // // // //             errorMessage: data.error,
// // // // // //           };
// // // // // //         });

// // // // // //         if (data.status === "processing") {
// // // // // //           setStatusMessage("AI is generating your assignment...");
// // // // // //           setLoading(true);
// // // // // //         } else if (data.status === "completed") {
// // // // // //           setStatusMessage("Assignment ready!");
// // // // // //           setLoading(false);
// // // // // //           if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // //         } else if (data.status === "failed") {
// // // // // //           setStatusMessage(`Failed: ${data.error || "Unknown error"}`);
// // // // // //           setLoading(false);
// // // // // //         } else if (data.status === "ai_attempt") {
// // // // // //           setStatusMessage(`AI attempt ${data.attempt || 1}...`);
// // // // // //         } else if (data.status === "retrying") {
// // // // // //           setStatusMessage(`Retrying... Reason: ${data.reason || "unknown"}`);
// // // // // //         } else if (data.status === "switching_provider") {
// // // // // //           setStatusMessage(`Switching from ${data.from} to ${data.to}...`);
// // // // // //         }
// // // // // //       }, token || undefined);
      
// // // // // //       startPolling();
      
// // // // // //     } catch (err) {
// // // // // //       console.error("Socket connection error:", err);
// // // // // //       setSocketError(true);
// // // // // //       startPolling();
// // // // // //     }

// // // // // //     return () => {
// // // // // //       if (unsubscribe) unsubscribe();
// // // // // //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // // //     };
// // // // // //   }, [id, fetchAssignment, token, startPolling]);

// // // // // //   const handlePrint = () => {
// // // // // //     if (pdfRef.current) {
// // // // // //       printPDF(pdfRef.current, `${assignment?.topic || "assignment"}`);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleRetry = () => {
// // // // // //     setRetryCount(prev => prev + 1);
// // // // // //     fetchAssignment();
// // // // // //   };

// // // // // //   if (loading) {
// // // // // //     return (
// // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // //         <Header />
// // // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // // //           <div className="relative">
// // // // // //             <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
// // // // // //             <div className="absolute inset-0 flex items-center justify-center">
// // // // // //               <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //           <h2 className="text-xl font-semibold mt-6 text-center">
// // // // // //             {statusMessage || "Preparing your assignment..."}
// // // // // //           </h2>
// // // // // //           {socketError && (
// // // // // //             <p className="text-gray-500 text-sm mt-2">
// // // // // //               Real-time connection lost. Updates may be delayed.
// // // // // //             </p>
// // // // // //           )}
// // // // // //           <p className="text-gray-400 text-sm mt-4">
// // // // // //             Please don't close this page
// // // // // //           </p>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   if (assignment?.status === "failed") {
// // // // // //     return (
// // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // //         <Header />
// // // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // // //           <div className="text-center">
// // // // // //             <div className="text-6xl mb-4">✗</div>
// // // // // //             <h2 className="text-2xl font-bold text-red-500 mb-2">
// // // // // //               Generation Failed
// // // // // //             </h2>
// // // // // //             <p className="text-gray-400 mb-6 max-w-md">
// // // // // //               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
// // // // // //             </p>
// // // // // //             <div className="flex gap-4 justify-center">
// // // // // //               <button
// // // // // //                 onClick={handleRetry}
// // // // // //                 className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
// // // // // //               >
// // // // // //                 Try Again
// // // // // //               </button>
// // // // // //               <button
// // // // // //                 onClick={() => router.push("/create-assignment")}
// // // // // //                 className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
// // // // // //               >
// // // // // //                 Create New
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   if (assignment?.status === "completed" && assignment.paper) {
// // // // // //     const paper = assignment.paper;
// // // // // //     const currentDate = new Date().toLocaleDateString('en-GB');
    
// // // // // //     // Fix section instructions - make all "Attempt all questions"
// // // // // //     const fixedSections = paper.sections?.map(section => ({
// // // // // //       ...section,
// // // // // //       instruction: "Attempt all questions"
// // // // // //     })) || [];
    
// // // // // //     return (
// // // // // //       <div className="bg-black text-white min-h-screen">
// // // // // //         <Header />
        
// // // // // //         <div className="max-w-4xl mx-auto p-6">
// // // // // //           <div className="flex justify-end gap-3 mb-6 no-print">
// // // // // //             <button
// // // // // //               onClick={handlePrint}
// // // // // //               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
// // // // // //             >
// // // // // //               Print / Save as PDF
// // // // // //             </button>
// // // // // //             <button
// // // // // //               onClick={() => router.push("/create-assignment")}
// // // // // //               className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition text-sm font-medium"
// // // // // //             >
// // // // // //               New Assignment
// // // // // //             </button>
// // // // // //           </div>

// // // // // //           {/* Professional Question Paper Format */}
// // // // // //           <div
// // // // // //             ref={pdfRef}
// // // // // //             className="bg-white text-black p-8 shadow-xl"
// // // // // //             style={{ fontFamily: "'Times New Roman', Times, serif" }}
// // // // // //           >
// // // // // //             {/* Header with Logo and School Name */}
// // // // // //             <div className="text-center mb-6">
// // // // // //               {/* Logo Section */}
// // // // // //               <div className="flex justify-center mb-3">
// // // // // //                 <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
// // // // // //                   V
// // // // // //                 </div>
// // // // // //               </div>
              
// // // // // //               {/* School Name */}
// // // // // //               {assignment.schoolName && (
// // // // // //                 <>
// // // // // //                   <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-800">
// // // // // //                     {assignment.schoolName}
// // // // // //                   </h1>
// // // // // //                   <div className="border-t-2 border-gray-400 w-24 mx-auto my-2"></div>
// // // // // //                 </>
// // // // // //               )}
              
// // // // // //               {/* Subject and Class */}
// // // // // //               <h2 className="text-xl font-bold text-gray-800 mt-2">
// // // // // //                 {assignment.subject}
// // // // // //               </h2>
// // // // // //               <h3 className="text-lg font-medium text-gray-700">
// // // // // //                 Class: {assignment.class}
// // // // // //               </h3>
// // // // // //               <p className="text-base text-gray-600 mt-1">
// // // // // //                 Topic: {assignment.topic}
// // // // // //               </p>
// // // // // //             </div>

// // // // // //             {/* Exam Details */}
// // // // // //             <div className="flex justify-between items-center border-b border-gray-400 pb-2 mb-4 text-sm">
// // // // // //               <div>Time Allowed: <span className="font-semibold">{assignment.timeAllowed}</span></div>
// // // // // //               <div>Maximum Marks: <span className="font-semibold">{assignment.totalMarks}</span></div>
// // // // // //               <div>Date: <span className="font-semibold">{currentDate}</span></div>
// // // // // //             </div>

// // // // // //             {/* Student Information */}
// // // // // //             <div className="grid grid-cols-3 gap-4 mb-6 text-sm border-b border-gray-300 pb-3">
// // // // // //               <div>Name: <span className="border-b border-gray-400 inline-block w-32 ml-2">_________________</span></div>
// // // // // //               <div>Roll No.: <span className="border-b border-gray-400 inline-block w-24 ml-2">________</span></div>
// // // // // //               <div>Section: <span className="border-b border-gray-400 inline-block w-24 ml-2">________</span></div>
// // // // // //             </div>

// // // // // //             {/* General Instructions */}
// // // // // //             <div className="mb-6">
// // // // // //               <h4 className="font-bold text-base mb-1">General Instructions:</h4>
// // // // // //               <p className="text-sm leading-relaxed pl-2">{paper.instructions}</p>
// // // // // //             </div>

// // // // // //             {/* Sections - All with "Attempt all questions" */}
// // // // // //             {fixedSections.map((section, idx) => (
// // // // // //               <div key={idx} className="mb-8">
// // // // // //                 <div className="border-t-2 border-gray-800 pt-3 mb-3">
// // // // // //                   <h3 className="text-lg font-bold uppercase tracking-wide">
// // // // // //                     {section.title}
// // // // // //                   </h3>
// // // // // //                   <p className="text-xs text-gray-600 italic mt-1">
// // // // // //                     {section.instruction}
// // // // // //                   </p>
// // // // // //                 </div>
                
// // // // // //                 {section.questions?.map((q, i) => (
// // // // // //                   <div key={i} className="mb-4">
// // // // // //                     <div className="flex justify-between items-start gap-4">
// // // // // //                       <div className="flex-1">
// // // // // //                         <p className="text-sm leading-relaxed">
// // // // // //                           <span className="font-bold">{q.number}.</span>{' '}
// // // // // //                           {q.text}
// // // // // //                         </p>
// // // // // //                         {q.hint && (
// // // // // //                           <p className="text-xs text-gray-500 mt-1 italic pl-4">
// // // // // //                             Hint: {q.hint}
// // // // // //                           </p>
// // // // // //                         )}
// // // // // //                       </div>
// // // // // //                       <div className="text-right min-w-[70px]">
// // // // // //                         <span className="text-sm font-semibold border border-gray-400 px-2 py-0.5 rounded">
// // // // // //                           {q.marks} marks
// // // // // //                         </span>
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //             ))}

// // // // // //             {/* Footer */}
// // // // // //             <div className="text-center text-sm text-gray-500 mt-8 pt-3 border-t border-gray-300">
// // // // // //               Best of Luck!
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   return null;
// // // // // // }


// // // // // "use client";

// // // // // import { useEffect, useRef, useState, useCallback } from "react";
// // // // // import { useParams, useRouter } from "next/navigation";
// // // // // import axios from "axios";
// // // // // import Header from "@/components/layout/Header";
// // // // // import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// // // // // import { printPDF } from "../../lib/printPdf";
// // // // // import { useUserStore } from "../../store/userStore";

// // // // // type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

// // // // // interface Question {
// // // // //   number: number;
// // // // //   text: string;
// // // // //   type: string;
// // // // //   difficulty: string;
// // // // //   marks: number;
// // // // //   hint?: string;
// // // // // }

// // // // // interface Section {
// // // // //   title: string;
// // // // //   instruction: string;
// // // // //   questions: Question[];
// // // // // }

// // // // // interface Assignment {
// // // // //   _id: string;
// // // // //   schoolName?: string;
// // // // //   class: string;
// // // // //   subject: string;
// // // // //   topic: string;
// // // // //   totalMarks: number;
// // // // //   timeAllowed: string;
// // // // //   instructions: string;
// // // // //   status: AssignmentStatus;
// // // // //   paper?: {
// // // // //     instructions: string;
// // // // //     sections: Section[];
// // // // //     studentInfo?: {
// // // // //       name: string;
// // // // //       rollNumber: string;
// // // // //       section: string;
// // // // //       class: string;
// // // // //       subject: string;
// // // // //       date: string;
// // // // //     };
// // // // //   };
// // // // //   errorMessage?: string;
// // // // // }

// // // // // export default function AssignmentPage() {
// // // // //   const { id } = useParams();
// // // // //   const router = useRouter();
// // // // //   const { user, token } = useUserStore();
  
// // // // //   const [assignment, setAssignment] = useState<Assignment | null>(null);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [statusMessage, setStatusMessage] = useState("");
// // // // //   const [retryCount, setRetryCount] = useState(0);
// // // // //   const [socketError, setSocketError] = useState(false);
  
// // // // //   const pdfRef = useRef<HTMLDivElement>(null);
// // // // //   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // // // //   const fetchAssignment = useCallback(async () => {
// // // // //     try {
// // // // //       const response = await axios.get(
// // // // //         `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
// // // // //       );

// // // // //       const data = response.data.data;
// // // // //       setAssignment(data);

// // // // //       switch (data.status) {
// // // // //         case "pending":
// // // // //           setStatusMessage("Assignment is queued. Waiting for processing...");
// // // // //           break;
// // // // //         case "processing":
// // // // //           setStatusMessage("AI is generating your assignment. This may take 30-60 seconds...");
// // // // //           break;
// // // // //         case "completed":
// // // // //           setStatusMessage("Assignment ready!");
// // // // //           setLoading(false);
// // // // //           if (pollIntervalRef.current) {
// // // // //             clearInterval(pollIntervalRef.current);
// // // // //             pollIntervalRef.current = null;
// // // // //           }
// // // // //           break;
// // // // //         case "failed":
// // // // //           setStatusMessage(`Failed: ${data.errorMessage || "Unknown error"}`);
// // // // //           setLoading(false);
// // // // //           break;
// // // // //       }

// // // // //       if (data.status !== "completed") {
// // // // //         setLoading(true);
// // // // //       } else {
// // // // //         setLoading(false);
// // // // //       }

// // // // //     } catch (err: any) {
// // // // //       console.error("Fetch assignment error:", err);
// // // // //       if (err?.response?.status === 404) {
// // // // //         setStatusMessage("Assignment not found");
// // // // //       } else {
// // // // //         setStatusMessage("Failed to load assignment");
// // // // //       }
// // // // //       setLoading(false);
// // // // //     }
// // // // //   }, [id]);

// // // // //   const startPolling = useCallback(() => {
// // // // //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
// // // // //     pollIntervalRef.current = setInterval(() => {
// // // // //       if (assignment?.status === "completed" || assignment?.status === "failed") {
// // // // //         if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // //         return;
// // // // //       }
// // // // //       fetchAssignment();
// // // // //     }, 5000);
// // // // //   }, [assignment?.status, fetchAssignment]);

// // // // //   useEffect(() => {
// // // // //     fetchAssignment();
    
// // // // //     let socket: any = null;
// // // // //     let unsubscribe: (() => void) | null = null;
    
// // // // //     try {
// // // // //       socket = getSocket(token || undefined);
// // // // //       joinAssignmentRoom(id as string, token || undefined);
      
// // // // //       unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
// // // // //         console.log("Socket update:", data);
// // // // //         setSocketError(false);
        
// // // // //         setAssignment((prev) => {
// // // // //           if (!prev) return prev;
// // // // //           return {
// // // // //             ...prev,
// // // // //             status: data.status,
// // // // //             paper: data.data || prev.paper,
// // // // //             errorMessage: data.error,
// // // // //           };
// // // // //         });

// // // // //         if (data.status === "processing") {
// // // // //           setStatusMessage("AI is generating your assignment...");
// // // // //           setLoading(true);
// // // // //         } else if (data.status === "completed") {
// // // // //           setStatusMessage("Assignment ready!");
// // // // //           setLoading(false);
// // // // //           if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // //         } else if (data.status === "failed") {
// // // // //           setStatusMessage(`Failed: ${data.error || "Unknown error"}`);
// // // // //           setLoading(false);
// // // // //         } else if (data.status === "ai_attempt") {
// // // // //           setStatusMessage(`AI attempt ${data.attempt || 1}...`);
// // // // //         } else if (data.status === "retrying") {
// // // // //           setStatusMessage(`Retrying... Reason: ${data.reason || "unknown"}`);
// // // // //         } else if (data.status === "switching_provider") {
// // // // //           setStatusMessage(`Switching from ${data.from} to ${data.to}...`);
// // // // //         }
// // // // //       }, token || undefined);
      
// // // // //       startPolling();
      
// // // // //     } catch (err) {
// // // // //       console.error("Socket connection error:", err);
// // // // //       setSocketError(true);
// // // // //       startPolling();
// // // // //     }

// // // // //     return () => {
// // // // //       if (unsubscribe) unsubscribe();
// // // // //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // // //     };
// // // // //   }, [id, fetchAssignment, token, startPolling]);

// // // // //   const handlePrint = () => {
// // // // //     if (pdfRef.current) {
// // // // //       printPDF(pdfRef.current, `${assignment?.topic || "assignment"}`);
// // // // //     }
// // // // //   };

// // // // //   const handleRetry = () => {
// // // // //     setRetryCount(prev => prev + 1);
// // // // //     fetchAssignment();
// // // // //   };

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className="bg-black text-white min-h-screen">
// // // // //         <Header />
// // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // //           <div className="relative">
// // // // //             <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
// // // // //             <div className="absolute inset-0 flex items-center justify-center">
// // // // //               <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
// // // // //             </div>
// // // // //           </div>
// // // // //           <h2 className="text-xl font-semibold mt-6 text-center">
// // // // //             {statusMessage || "Preparing your assignment..."}
// // // // //           </h2>
// // // // //           {socketError && (
// // // // //             <p className="text-gray-500 text-sm mt-2">
// // // // //               Real-time connection lost. Updates may be delayed.
// // // // //             </p>
// // // // //           )}
// // // // //           <p className="text-gray-400 text-sm mt-4">
// // // // //             Please don't close this page
// // // // //           </p>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   if (assignment?.status === "failed") {
// // // // //     return (
// // // // //       <div className="bg-black text-white min-h-screen">
// // // // //         <Header />
// // // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // // //           <div className="text-center">
// // // // //             <div className="text-6xl mb-4">✗</div>
// // // // //             <h2 className="text-2xl font-bold text-red-500 mb-2">
// // // // //               Generation Failed
// // // // //             </h2>
// // // // //             <p className="text-gray-400 mb-6 max-w-md">
// // // // //               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
// // // // //             </p>
// // // // //             <div className="flex gap-4 justify-center">
// // // // //               <button
// // // // //                 onClick={handleRetry}
// // // // //                 className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
// // // // //               >
// // // // //                 Try Again
// // // // //               </button>
// // // // //               <button
// // // // //                 onClick={() => router.push("/create-assignment")}
// // // // //                 className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
// // // // //               >
// // // // //                 Create New
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   if (assignment?.status === "completed" && assignment.paper) {
// // // // //     const paper = assignment.paper;
// // // // //     const currentDate = new Date().toLocaleDateString('en-GB');
    
// // // // //     // Fix section instructions - all "Attempt all questions"
// // // // //     const fixedSections = paper.sections?.map(section => ({
// // // // //       ...section,
// // // // //       instruction: "Attempt all questions"
// // // // //     })) || [];
    
// // // // //     return (
// // // // //       <div className="bg-black text-white min-h-screen">
// // // // //         <Header />
        
// // // // //         <div className="max-w-4xl mx-auto p-6">
// // // // //           <div className="flex justify-end gap-3 mb-6 no-print">
// // // // //             <button
// // // // //               onClick={handlePrint}
// // // // //               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
// // // // //             >
// // // // //               Print / Save as PDF
// // // // //             </button>
// // // // //             <button
// // // // //               onClick={() => router.push("/create-assignment")}
// // // // //               className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition text-sm font-medium"
// // // // //             >
// // // // //               New Assignment
// // // // //             </button>
// // // // //           </div>

// // // // //           {/* Professional Question Paper Format */}
// // // // //           <div
// // // // //             ref={pdfRef}
// // // // //             className="bg-white text-black p-8 shadow-xl"
// // // // //             style={{ fontFamily: "'Times New Roman', Times, serif" }}
// // // // //           >
// // // // //             {/* SECTION 1: School Details */}
// // // // //             <div className="text-center mb-8">
// // // // //               {assignment.schoolName && (
// // // // //                 <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-800 mb-2">
// // // // //                   {assignment.schoolName}
// // // // //                 </h1>
// // // // //               )}
// // // // //               <div className="border-t border-gray-300 w-32 mx-auto my-3"></div>
// // // // //               <h2 className="text-xl font-semibold text-gray-800">
// // // // //                 {assignment.subject}
// // // // //               </h2>
// // // // //               <p className="text-lg text-gray-700 mt-1">
// // // // //                 Class: {assignment.class}
// // // // //               </p>
// // // // //               <div className="flex justify-center gap-8 mt-3 text-sm text-gray-600">
// // // // //                 <span>Time: {assignment.timeAllowed}</span>
// // // // //                 <span>Max Marks: {assignment.totalMarks}</span>
// // // // //                 <span>Date: {currentDate}</span>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* SECTION 2: Instructions */}
// // // // //             <div className="mb-8">
// // // // //               <h3 className="text-base font-bold uppercase tracking-wide text-gray-800 border-b border-gray-300 pb-1 mb-3">
// // // // //                 General Instructions
// // // // //               </h3>
// // // // //               <div className="space-y-1 text-sm leading-relaxed text-gray-700">
// // // // //                 <p>1. All questions are compulsory.</p>
// // // // //                 <p>2. Write your answers in the space provided.</p>
// // // // //                 <p>3. Read each question carefully before answering.</p>
// // // // //                 <p>4. Marks are indicated against each question.</p>
// // // // //                 <p className="mt-2 italic">{paper.instructions}</p>
// // // // //               </div>
// // // // //             </div>

// // // // //             {/* Student Information */}
// // // // //             <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
// // // // //               <div>Name: <span className="border-b border-gray-400 inline-block w-32 ml-2">_________________</span></div>
// // // // //               <div>Roll No.: <span className="border-b border-gray-400 inline-block w-24 ml-2">________</span></div>
// // // // //               <div>Section: <span className="border-b border-gray-400 inline-block w-24 ml-2">________</span></div>
// // // // //             </div>

// // // // //             {/* SECTION 3: Question Paper */}
// // // // //             {fixedSections.map((section, sectionIdx) => (
// // // // //               <div key={sectionIdx} className="mb-8">
// // // // //                 <div className="border-t border-gray-300 pt-3 mb-4">
// // // // //                   <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800">
// // // // //                     {section.title}
// // // // //                   </h3>
// // // // //                   <p className="text-xs text-gray-500 mt-1">
// // // // //                     {section.instruction}
// // // // //                   </p>
// // // // //                 </div>
                
// // // // //                 {section.questions?.map((q, qIdx) => (
// // // // //                   <div key={qIdx} className="mb-4">
// // // // //                     <div className="flex justify-between items-start gap-4">
// // // // //                       <div className="flex-1">
// // // // //                         <p className="text-sm leading-relaxed">
// // // // //                           <span className="font-bold">{q.number}.</span>{' '}
// // // // //                           {q.text}
// // // // //                         </p>
// // // // //                         {q.hint && (
// // // // //                           <p className="text-xs text-gray-500 mt-1 italic ml-4">
// // // // //                             Hint: {q.hint}
// // // // //                           </p>
// // // // //                         )}
// // // // //                       </div>
// // // // //                       <div className="text-right min-w-[60px]">
// // // // //                         <span className="text-sm text-gray-600">
// // // // //                           ({q.marks})
// // // // //                         </span>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                     {/* Answer space line */}
// // // // //                     <div className="mt-2 ml-6">
// // // // //                       <div className="border-b border-gray-200 w-full"></div>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>
// // // // //             ))}

// // // // //             {/* Footer */}
// // // // //             <div className="text-center text-sm text-gray-400 mt-8 pt-3 border-t border-gray-200">
// // // // //               Best of Luck!
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   return null;
// // // // // }


// // // // "use client";

// // // // import { useEffect, useRef, useState, useCallback } from "react";
// // // // import { useParams, useRouter } from "next/navigation";
// // // // import axios from "axios";
// // // // import Header from "@/components/layout/Header";
// // // // import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// // // // import { printPDF } from "../../lib/printPdf";
// // // // import { useUserStore } from "../../store/userStore";

// // // // type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

// // // // interface Question {
// // // //   number: number;
// // // //   text: string;
// // // //   type: string;
// // // //   difficulty: string;
// // // //   marks: number;
// // // //   hint?: string;
// // // // }

// // // // interface Section {
// // // //   title: string;
// // // //   instruction: string;
// // // //   questions: Question[];
// // // // }

// // // // interface Assignment {
// // // //   _id: string;
// // // //   schoolName?: string;
// // // //   class: string;
// // // //   subject: string;
// // // //   topic: string;
// // // //   totalMarks: number;
// // // //   timeAllowed: string;
// // // //   instructions: string;
// // // //   status: AssignmentStatus;
// // // //   paper?: {
// // // //     instructions: string;
// // // //     sections: Section[];
// // // //     studentInfo?: {
// // // //       name: string;
// // // //       rollNumber: string;
// // // //       section: string;
// // // //       class: string;
// // // //       subject: string;
// // // //       date: string;
// // // //     };
// // // //   };
// // // //   errorMessage?: string;
// // // // }

// // // // export default function AssignmentPage() {
// // // //   const { id } = useParams();
// // // //   const router = useRouter();
// // // //   const { user, token } = useUserStore();
  
// // // //   const [assignment, setAssignment] = useState<Assignment | null>(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [statusMessage, setStatusMessage] = useState("");
// // // //   const [retryCount, setRetryCount] = useState(0);
// // // //   const [socketError, setSocketError] = useState(false);
  
// // // //   const pdfRef = useRef<HTMLDivElement>(null);
// // // //   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // // //   const fetchAssignment = useCallback(async () => {
// // // //     try {
// // // //       const response = await axios.get(
// // // //         `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
// // // //       );

// // // //       const data = response.data.data;
// // // //       setAssignment(data);

// // // //       switch (data.status) {
// // // //         case "pending":
// // // //           setStatusMessage("Assignment is queued. Waiting for processing...");
// // // //           break;
// // // //         case "processing":
// // // //           setStatusMessage("AI is generating your assignment. This may take 30-60 seconds...");
// // // //           break;
// // // //         case "completed":
// // // //           setStatusMessage("Assignment ready!");
// // // //           setLoading(false);
// // // //           if (pollIntervalRef.current) {
// // // //             clearInterval(pollIntervalRef.current);
// // // //             pollIntervalRef.current = null;
// // // //           }
// // // //           break;
// // // //         case "failed":
// // // //           setStatusMessage(`Failed: ${data.errorMessage || "Unknown error"}`);
// // // //           setLoading(false);
// // // //           break;
// // // //       }

// // // //       if (data.status !== "completed") {
// // // //         setLoading(true);
// // // //       } else {
// // // //         setLoading(false);
// // // //       }

// // // //     } catch (err: any) {
// // // //       console.error("Fetch assignment error:", err);
// // // //       if (err?.response?.status === 404) {
// // // //         setStatusMessage("Assignment not found");
// // // //       } else {
// // // //         setStatusMessage("Failed to load assignment");
// // // //       }
// // // //       setLoading(false);
// // // //     }
// // // //   }, [id]);

// // // //   const startPolling = useCallback(() => {
// // // //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
// // // //     pollIntervalRef.current = setInterval(() => {
// // // //       if (assignment?.status === "completed" || assignment?.status === "failed") {
// // // //         if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // //         return;
// // // //       }
// // // //       fetchAssignment();
// // // //     }, 5000);
// // // //   }, [assignment?.status, fetchAssignment]);

// // // //   useEffect(() => {
// // // //     fetchAssignment();
    
// // // //     let socket: any = null;
// // // //     let unsubscribe: (() => void) | null = null;
    
// // // //     try {
// // // //       socket = getSocket(token || undefined);
// // // //       joinAssignmentRoom(id as string, token || undefined);
      
// // // //       unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
// // // //         console.log("Socket update:", data);
// // // //         setSocketError(false);
        
// // // //         setAssignment((prev) => {
// // // //           if (!prev) return prev;
// // // //           return {
// // // //             ...prev,
// // // //             status: data.status,
// // // //             paper: data.data || prev.paper,
// // // //             errorMessage: data.error,
// // // //           };
// // // //         });

// // // //         if (data.status === "processing") {
// // // //           setStatusMessage("AI is generating your assignment...");
// // // //           setLoading(true);
// // // //         } else if (data.status === "completed") {
// // // //           setStatusMessage("Assignment ready!");
// // // //           setLoading(false);
// // // //           if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // //         } else if (data.status === "failed") {
// // // //           setStatusMessage(`Failed: ${data.error || "Unknown error"}`);
// // // //           setLoading(false);
// // // //         } else if (data.status === "ai_attempt") {
// // // //           setStatusMessage(`AI attempt ${data.attempt || 1}...`);
// // // //         } else if (data.status === "retrying") {
// // // //           setStatusMessage(`Retrying... Reason: ${data.reason || "unknown"}`);
// // // //         } else if (data.status === "switching_provider") {
// // // //           setStatusMessage(`Switching from ${data.from} to ${data.to}...`);
// // // //         }
// // // //       }, token || undefined);
      
// // // //       startPolling();
      
// // // //     } catch (err) {
// // // //       console.error("Socket connection error:", err);
// // // //       setSocketError(true);
// // // //       startPolling();
// // // //     }

// // // //     return () => {
// // // //       if (unsubscribe) unsubscribe();
// // // //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // // //     };
// // // //   }, [id, fetchAssignment, token, startPolling]);

// // // //   const handlePrint = () => {
// // // //     if (pdfRef.current) {
// // // //       printPDF(pdfRef.current, `${assignment?.topic || "assignment"}`);
// // // //     }
// // // //   };

// // // //   const handleRetry = () => {
// // // //     setRetryCount(prev => prev + 1);
// // // //     fetchAssignment();
// // // //   };

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="bg-black text-white min-h-screen">
// // // //         <Header />
// // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // //           <div className="relative">
// // // //             <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
// // // //             <div className="absolute inset-0 flex items-center justify-center">
// // // //               <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
// // // //             </div>
// // // //           </div>
// // // //           <h2 className="text-xl font-semibold mt-6 text-center">
// // // //             {statusMessage || "Preparing your assignment..."}
// // // //           </h2>
// // // //           {socketError && (
// // // //             <p className="text-gray-500 text-sm mt-2">
// // // //               Real-time connection lost. Updates may be delayed.
// // // //             </p>
// // // //           )}
// // // //           <p className="text-gray-400 text-sm mt-4">
// // // //             Please don't close this page
// // // //           </p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (assignment?.status === "failed") {
// // // //     return (
// // // //       <div className="bg-black text-white min-h-screen">
// // // //         <Header />
// // // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // // //           <div className="text-center">
// // // //             <div className="text-6xl mb-4">✗</div>
// // // //             <h2 className="text-2xl font-bold text-red-500 mb-2">
// // // //               Generation Failed
// // // //             </h2>
// // // //             <p className="text-gray-400 mb-6 max-w-md">
// // // //               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
// // // //             </p>
// // // //             <div className="flex gap-4 justify-center">
// // // //               <button
// // // //                 onClick={handleRetry}
// // // //                 className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
// // // //               >
// // // //                 Try Again
// // // //               </button>
// // // //               <button
// // // //                 onClick={() => router.push("/create-assignment")}
// // // //                 className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
// // // //               >
// // // //                 Create New
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (assignment?.status === "completed" && assignment.paper) {
// // // //     const paper = assignment.paper;
// // // //     const currentDate = new Date().toLocaleDateString('en-GB');
    
// // // //     const fixedSections = paper.sections?.map(section => ({
// // // //       ...section,
// // // //       instruction: "Attempt all questions"
// // // //     })) || [];
    
// // // //     return (
// // // //       <div className="bg-black text-white min-h-screen">
// // // //         <Header />
        
// // // //         <div className="max-w-4xl mx-auto p-6">
// // // //           <div className="flex justify-end gap-3 mb-6 no-print">
// // // //             <button
// // // //               onClick={handlePrint}
// // // //               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
// // // //             >
// // // //               Print / Save as PDF
// // // //             </button>
// // // //             <button
// // // //               onClick={() => router.push("/create-assignment")}
// // // //               className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition text-sm font-medium"
// // // //             >
// // // //               New Assignment
// // // //             </button>
// // // //           </div>

// // // //           {/* Professional Question Paper Format */}
// // // //           <div
// // // //             ref={pdfRef}
// // // //             className="bg-white text-black"
// // // //             style={{ 
// // // //               fontFamily: "'Times New Roman', Times, serif", 
// // // //               fontSize: '12pt', 
// // // //               lineHeight: '1.35',
// // // //               padding: '0.75in',
// // // //               maxWidth: '100%',
// // // //               margin: '0 auto'
// // // //             }}
// // // //           >
// // // //             {/* TOP SECTION - School Header */}
// // // //             <div className="mb-6">
// // // //               {assignment.schoolName && (
// // // //                 <h1 className="text-center text-xl font-bold uppercase tracking-wide mb-1">
// // // //                   {assignment.schoolName}
// // // //                 </h1>
// // // //               )}
// // // //               <p className="text-sm font-semibold mt-3">
// // // //                 Subject: {assignment.subject}
// // // //               </p>
// // // //               <p className="text-sm font-semibold">
// // // //                 Class: {assignment.class}
// // // //               </p>
              
// // // //               <div className="my-3"></div>
              
// // // //               <p className="text-sm">
// // // //                 Time Allowed: {assignment.timeAllowed}
// // // //               </p>
// // // //               <p className="text-sm">
// // // //                 Maximum Marks: {assignment.totalMarks}
// // // //               </p>
              
// // // //               <div className="my-3"></div>
              
// // // //               <p className="text-sm italic">
// // // //                 All questions are compulsory unless stated otherwise.
// // // //               </p>
              
// // // //               <div className="my-4"></div>
              
// // // //               <div className="flex flex-wrap gap-6 text-sm">
// // // //                 <span>Name: <span className="border-b border-gray-400 inline-block w-40 ml-2"></span></span>
// // // //                 <span>Roll Number: <span className="border-b border-gray-400 inline-block w-32 ml-2"></span></span>
// // // //                 <span>Class: {assignment.class} Section: <span className="border-b border-gray-400 inline-block w-20 ml-2"></span></span>
// // // //               </div>
// // // //             </div>

// // // //             {/* GENERAL INSTRUCTIONS */}
// // // //             <div className="mb-6">
// // // //               <h3 className="text-sm font-bold uppercase tracking-wide mb-2">
// // // //                 GENERAL INSTRUCTIONS:
// // // //               </h3>
// // // //               <div className="text-sm leading-relaxed space-y-1 ml-4">
// // // //                 <p>1. All questions are compulsory.</p>
// // // //                 <p>2. Write your answers in the space provided.</p>
// // // //                 <p>3. Read each question carefully before answering.</p>
// // // //                 <p>4. Marks are indicated against each question.</p>
// // // //                 <p className="mt-2">{paper.instructions}</p>
// // // //               </div>
// // // //             </div>

// // // //             {/* QUESTION SECTIONS */}
// // // //             {fixedSections.map((section, sectionIdx) => (
// // // //               <div key={sectionIdx} className="mb-6">
// // // //                 <h2 className="text-center text-lg font-bold uppercase tracking-wide mb-1">
// // // //                   {section.title}
// // // //                 </h2>
// // // //                 <p className="text-center text-sm font-semibold mb-0">
// // // //                   {section.title === "Section A" ? "Short Answer Questions" : 
// // // //                    section.title === "Section B" ? "Long Answer Questions" : 
// // // //                    "Analytical Questions"}
// // // //                 </p>
// // // //                 <p className="text-center text-xs italic text-gray-600 mb-3">
// // // //                   {section.instruction}. Each question carries appropriate marks.
// // // //                 </p>
                
// // // //                 {section.questions?.map((q, qIdx) => (
// // // //                   <div key={qIdx} className="mb-1">
// // // //                     <div className="flex justify-between items-start gap-4">
// // // //                       <p className="text-sm leading-relaxed flex-1">
// // // //                         <span className="font-bold">{q.number}.</span>{' '}
// // // //                         {q.text}
// // // //                       </p>
// // // //                       <span className="text-sm whitespace-nowrap ml-4">
// // // //                         ({q.marks})
// // // //                       </span>
// // // //                     </div>
// // // //                     {q.hint && (
// // // //                       <p className="text-xs text-gray-500 mt-0 italic ml-6">
// // // //                         Hint: {q.hint}
// // // //                       </p>
// // // //                     )}
// // // //                     {/* Minimal answer space */}
// // // //                     <div className="mt-1 ml-6 h-4"></div>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             ))}

// // // //             {/* FOOTER */}
// // // //             <div className="text-center text-xs text-gray-400 mt-4 pt-2">
// // // //               Best of Luck!
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return null;
// // // // }



// // // "use client";

// // // import { useEffect, useRef, useState, useCallback } from "react";
// // // import { useParams, useRouter } from "next/navigation";
// // // import axios from "axios";
// // // import Header from "@/components/layout/Header";
// // // import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// // // import { printPDF } from "../../lib/printPdf";
// // // import { useUserStore } from "../../store/userStore";

// // // type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

// // // interface Question {
// // //   number: number;
// // //   text: string;
// // //   type: string;
// // //   difficulty: string;
// // //   marks: number;
// // //   hint?: string;
// // // }

// // // interface Section {
// // //   title: string;
// // //   instruction: string;
// // //   questions: Question[];
// // // }

// // // interface Assignment {
// // //   _id: string;
// // //   schoolName?: string;
// // //   class: string;
// // //   subject: string;
// // //   topic: string;
// // //   totalMarks: number;
// // //   timeAllowed: string;
// // //   instructions: string;
// // //   status: AssignmentStatus;
// // //   paper?: {
// // //     instructions: string;
// // //     sections: Section[];
// // //     studentInfo?: {
// // //       name: string;
// // //       rollNumber: string;
// // //       section: string;
// // //       class: string;
// // //       subject: string;
// // //       date: string;
// // //     };
// // //   };
// // //   errorMessage?: string;
// // // }

// // // export default function AssignmentPage() {
// // //   const { id } = useParams();
// // //   const router = useRouter();
// // //   const { user, token } = useUserStore();
  
// // //   const [assignment, setAssignment] = useState<Assignment | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [statusMessage, setStatusMessage] = useState("");
// // //   const [retryCount, setRetryCount] = useState(0);
// // //   const [socketError, setSocketError] = useState(false);
  
// // //   const pdfRef = useRef<HTMLDivElement>(null);
// // //   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // //   const fetchAssignment = useCallback(async () => {
// // //     try {
// // //       const response = await axios.get(
// // //         `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
// // //       );

// // //       const data = response.data.data;
// // //       setAssignment(data);

// // //       switch (data.status) {
// // //         case "pending":
// // //           setStatusMessage("Assignment is queued. Waiting for processing...");
// // //           break;
// // //         case "processing":
// // //           setStatusMessage("AI is generating your assignment. This may take 30-60 seconds...");
// // //           break;
// // //         case "completed":
// // //           setStatusMessage("Assignment ready!");
// // //           setLoading(false);
// // //           if (pollIntervalRef.current) {
// // //             clearInterval(pollIntervalRef.current);
// // //             pollIntervalRef.current = null;
// // //           }
// // //           break;
// // //         case "failed":
// // //           setStatusMessage(`Failed: ${data.errorMessage || "Unknown error"}`);
// // //           setLoading(false);
// // //           break;
// // //       }

// // //       if (data.status !== "completed") {
// // //         setLoading(true);
// // //       } else {
// // //         setLoading(false);
// // //       }

// // //     } catch (err: any) {
// // //       console.error("Fetch assignment error:", err);
// // //       if (err?.response?.status === 404) {
// // //         setStatusMessage("Assignment not found");
// // //       } else {
// // //         setStatusMessage("Failed to load assignment");
// // //       }
// // //       setLoading(false);
// // //     }
// // //   }, [id]);

// // //   const startPolling = useCallback(() => {
// // //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
// // //     pollIntervalRef.current = setInterval(() => {
// // //       if (assignment?.status === "completed" || assignment?.status === "failed") {
// // //         if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // //         return;
// // //       }
// // //       fetchAssignment();
// // //     }, 5000);
// // //   }, [assignment?.status, fetchAssignment]);

// // //   useEffect(() => {
// // //     fetchAssignment();
    
// // //     let socket: any = null;
// // //     let unsubscribe: (() => void) | null = null;
    
// // //     try {
// // //       socket = getSocket(token || undefined);
// // //       joinAssignmentRoom(id as string, token || undefined);
      
// // //       unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
// // //         console.log("Socket update:", data);
// // //         setSocketError(false);
        
// // //         setAssignment((prev) => {
// // //           if (!prev) return prev;
// // //           return {
// // //             ...prev,
// // //             status: data.status,
// // //             paper: data.data || prev.paper,
// // //             errorMessage: data.error,
// // //           };
// // //         });

// // //         if (data.status === "processing") {
// // //           setStatusMessage("AI is generating your assignment...");
// // //           setLoading(true);
// // //         } else if (data.status === "completed") {
// // //           setStatusMessage("Assignment ready!");
// // //           setLoading(false);
// // //           if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // //         } else if (data.status === "failed") {
// // //           setStatusMessage(`Failed: ${data.error || "Unknown error"}`);
// // //           setLoading(false);
// // //         } else if (data.status === "ai_attempt") {
// // //           setStatusMessage(`AI attempt ${data.attempt || 1}...`);
// // //         } else if (data.status === "retrying") {
// // //           setStatusMessage(`Retrying... Reason: ${data.reason || "unknown"}`);
// // //         } else if (data.status === "switching_provider") {
// // //           setStatusMessage(`Switching from ${data.from} to ${data.to}...`);
// // //         }
// // //       }, token || undefined);
      
// // //       startPolling();
      
// // //     } catch (err) {
// // //       console.error("Socket connection error:", err);
// // //       setSocketError(true);
// // //       startPolling();
// // //     }

// // //     return () => {
// // //       if (unsubscribe) unsubscribe();
// // //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// // //     };
// // //   }, [id, fetchAssignment, token, startPolling]);

// // //   const handlePrint = () => {
// // //     if (pdfRef.current) {
// // //       printPDF(pdfRef.current, `${assignment?.topic || "assignment"}`);
// // //     }
// // //   };

// // //   const handleRetry = () => {
// // //     setRetryCount(prev => prev + 1);
// // //     fetchAssignment();
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="bg-black text-white min-h-screen">
// // //         <Header />
// // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // //           <div className="relative">
// // //             <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
// // //             <div className="absolute inset-0 flex items-center justify-center">
// // //               <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
// // //             </div>
// // //           </div>
// // //           <h2 className="text-xl font-semibold mt-6 text-center">
// // //             {statusMessage || "Preparing your assignment..."}
// // //           </h2>
// // //           {socketError && (
// // //             <p className="text-gray-500 text-sm mt-2">
// // //               Real-time connection lost. Updates may be delayed.
// // //             </p>
// // //           )}
// // //           <p className="text-gray-400 text-sm mt-4">
// // //             Please don't close this page
// // //           </p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (assignment?.status === "failed") {
// // //     return (
// // //       <div className="bg-black text-white min-h-screen">
// // //         <Header />
// // //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// // //           <div className="text-center">
// // //             <div className="text-6xl mb-4">✗</div>
// // //             <h2 className="text-2xl font-bold text-red-500 mb-2">
// // //               Generation Failed
// // //             </h2>
// // //             <p className="text-gray-400 mb-6 max-w-md">
// // //               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
// // //             </p>
// // //             <div className="flex gap-4 justify-center">
// // //               <button
// // //                 onClick={handleRetry}
// // //                 className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
// // //               >
// // //                 Try Again
// // //               </button>
// // //               <button
// // //                 onClick={() => router.push("/create-assignment")}
// // //                 className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
// // //               >
// // //                 Create New
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (assignment?.status === "completed" && assignment.paper) {
// // //     const paper = assignment.paper;
// // //     const currentDate = new Date().toLocaleDateString('en-GB');
    
// // //     const fixedSections = paper.sections?.map(section => ({
// // //       ...section,
// // //       instruction: "Attempt all questions"
// // //     })) || [];
    
// // //     return (
// // //       <div className="bg-black text-white min-h-screen">
// // //         <Header />
        
// // //         <div className="max-w-4xl mx-auto p-6">
// // //           <div className="flex justify-end gap-3 mb-6 no-print">
// // //             <button
// // //               onClick={handlePrint}
// // //               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
// // //             >
// // //               Print / Save as PDF
// // //             </button>
// // //             <button
// // //               onClick={() => router.push("/create-assignment")}
// // //               className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition text-sm font-medium"
// // //             >
// // //               New Assignment
// // //             </button>
// // //           </div>

// // //           {/* Professional Question Paper Format */}
// // //           <div
// // //             ref={pdfRef}
// // //             className="bg-white text-black"
// // //             style={{ 
// // //               fontFamily: "'Times New Roman', Times, serif", 
// // //               fontSize: '12pt', 
// // //               lineHeight: '1.3',
// // //               padding: '0.75in',
// // //               maxWidth: '100%',
// // //               margin: '0 auto'
// // //             }}
// // //           >
// // //             {/* TOP SECTION - School Header */}
// // //             <div className="mb-4">
// // //               {assignment.schoolName && (
// // //                 <h1 className="text-center text-xl font-bold uppercase tracking-wide mb-1">
// // //                   {assignment.schoolName}
// // //                 </h1>
// // //               )}
// // //               <p className="text-sm font-semibold mt-2">
// // //                 Subject: {assignment.subject}
// // //               </p>
// // //               <p className="text-sm font-semibold">
// // //                 Class: {assignment.class}
// // //               </p>
              
// // //               <div className="my-2"></div>
              
// // //               <p className="text-sm">
// // //                 Time Allowed: {assignment.timeAllowed}
// // //               </p>
// // //               <p className="text-sm">
// // //                 Maximum Marks: {assignment.totalMarks}
// // //               </p>
              
// // //               <div className="my-2"></div>
              
// // //               <p className="text-sm italic">
// // //                 All questions are compulsory unless stated otherwise.
// // //               </p>
              
// // //               <div className="my-3"></div>
              
// // //               <div className="flex flex-wrap gap-6 text-sm">
// // //                 <span>Name: <span className="border-b border-gray-400 inline-block w-40 ml-2"></span></span>
// // //                 <span>Roll Number: <span className="border-b border-gray-400 inline-block w-32 ml-2"></span></span>
// // //                 <span>Class: {assignment.class} Section: <span className="border-b border-gray-400 inline-block w-20 ml-2"></span></span>
// // //               </div>
// // //             </div>

// // //             {/* GENERAL INSTRUCTIONS */}
// // //             <div className="mb-4">
// // //               <h3 className="text-sm font-bold uppercase tracking-wide mb-1">
// // //                 GENERAL INSTRUCTIONS:
// // //               </h3>
// // //               <div className="text-sm leading-relaxed space-y-0 ml-4">
// // //                 <p>1. All questions are compulsory.</p>
// // //                 <p>2. Write your answers in the space provided.</p>
// // //                 <p>3. Read each question carefully before answering.</p>
// // //                 <p>4. Marks are indicated against each question.</p>
// // //                 <p className="mt-1">{paper.instructions}</p>
// // //               </div>
// // //             </div>

// // //             {/* QUESTION SECTIONS */}
// // //             {fixedSections.map((section, sectionIdx) => (
// // //               <div key={sectionIdx} className="mb-4">
// // //                 <h2 className="text-center text-lg font-bold uppercase tracking-wide mb-0">
// // //                   {section.title}
// // //                 </h2>
// // //                 <p className="text-center text-sm font-semibold mb-0">
// // //                   {section.title === "Section A" ? "Short Answer Questions" : 
// // //                    section.title === "Section B" ? "Long Answer Questions" : 
// // //                    "Analytical Questions"}
// // //                 </p>
// // //                 <p className="text-center text-xs italic text-gray-600 mb-2">
// // //                   {section.instruction}. Each question carries appropriate marks.
// // //                 </p>
                
// // //                 {section.questions?.map((q, qIdx) => (
// // //                   <div key={qIdx} className="mb-0">
// // //                     <div className="flex justify-between items-start gap-4">
// // //                       <p className="text-sm leading-tight flex-1">
// // //                         <span className="font-bold">{q.number}.</span>{' '}
// // //                         {q.text}
// // //                       </p>
// // //                       <span className="text-sm whitespace-nowrap ml-4">
// // //                         ({q.marks})
// // //                       </span>
// // //                     </div>
// // //                     {q.hint && (
// // //                       <p className="text-xs text-gray-500 mt-0 italic ml-6">
// // //                         Hint: {q.hint}
// // //                       </p>
// // //                     )}
// // //                     {/* Minimal answer space - no visible line */}
// // //                     <div className="mt-0 ml-6 h-3"></div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             ))}

// // //             {/* FOOTER */}
// // //             <div className="text-center text-xs text-gray-400 mt-2 pt-1">
// // //               Best of Luck!
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return null;
// // // }



// // "use client";

// // import { useEffect, useRef, useState, useCallback } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import axios from "axios";
// // import Header from "@/components/layout/Header";
// // import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// // import { printPDF } from "../../lib/printPdf";
// // import { useUserStore } from "../../store/userStore";

// // type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

// // interface Question {
// //   number: number;
// //   text: string;
// //   type: string;
// //   difficulty: string;
// //   marks: number;
// //   hint?: string;
// // }

// // interface Section {
// //   title: string;
// //   instruction: string;
// //   questions: Question[];
// // }

// // interface Assignment {
// //   _id: string;
// //   schoolName?: string;
// //   class: string;
// //   subject: string;
// //   topic: string;
// //   totalMarks: number;
// //   timeAllowed: string;
// //   instructions: string;
// //   status: AssignmentStatus;
// //   paper?: {
// //     instructions: string;
// //     sections: Section[];
// //     studentInfo?: {
// //       name: string;
// //       rollNumber: string;
// //       section: string;
// //       class: string;
// //       subject: string;
// //       date: string;
// //     };
// //   };
// //   errorMessage?: string;
// // }

// // export default function AssignmentPage() {
// //   const { id } = useParams();
// //   const router = useRouter();
// //   const { user, token } = useUserStore();
  
// //   const [assignment, setAssignment] = useState<Assignment | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [statusMessage, setStatusMessage] = useState("");
// //   const [retryCount, setRetryCount] = useState(0);
// //   const [socketError, setSocketError] = useState(false);
  
// //   const pdfRef = useRef<HTMLDivElement>(null);
// //   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

// //   const fetchAssignment = useCallback(async () => {
// //     try {
// //       const response = await axios.get(
// //         `${process.env.NEXT_PUBLIC_API_URL}/assignment/${id}`
// //       );

// //       const data = response.data.data;
// //       setAssignment(data);

// //       switch (data.status) {
// //         case "pending":
// //           setStatusMessage("Assignment is queued. Waiting for processing...");
// //           break;
// //         case "processing":
// //           setStatusMessage("AI is generating your assignment. This may take 30-60 seconds...");
// //           break;
// //         case "completed":
// //           setStatusMessage("Assignment ready!");
// //           setLoading(false);
// //           if (pollIntervalRef.current) {
// //             clearInterval(pollIntervalRef.current);
// //             pollIntervalRef.current = null;
// //           }
// //           break;
// //         case "failed":
// //           setStatusMessage(`Failed: ${data.errorMessage || "Unknown error"}`);
// //           setLoading(false);
// //           break;
// //       }

// //       if (data.status !== "completed") {
// //         setLoading(true);
// //       } else {
// //         setLoading(false);
// //       }

// //     } catch (err: any) {
// //       console.error("Fetch assignment error:", err);
// //       if (err?.response?.status === 404) {
// //         setStatusMessage("Assignment not found");
// //       } else {
// //         setStatusMessage("Failed to load assignment");
// //       }
// //       setLoading(false);
// //     }
// //   }, [id]);

// //   const startPolling = useCallback(() => {
// //     if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
// //     pollIntervalRef.current = setInterval(() => {
// //       if (assignment?.status === "completed" || assignment?.status === "failed") {
// //         if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// //         return;
// //       }
// //       fetchAssignment();
// //     }, 5000);
// //   }, [assignment?.status, fetchAssignment]);

// //   useEffect(() => {
// //     fetchAssignment();
    
// //     let socket: any = null;
// //     let unsubscribe: (() => void) | null = null;
    
// //     try {
// //       socket = getSocket(token || undefined);
// //       joinAssignmentRoom(id as string, token || undefined);
      
// //       unsubscribe = onAssignmentUpdate(id as string, (data: any) => {
// //         console.log("Socket update:", data);
// //         setSocketError(false);
        
// //         setAssignment((prev) => {
// //           if (!prev) return prev;
// //           return {
// //             ...prev,
// //             status: data.status,
// //             paper: data.data || prev.paper,
// //             errorMessage: data.error,
// //           };
// //         });

// //         if (data.status === "processing") {
// //           setStatusMessage("AI is generating your assignment...");
// //           setLoading(true);
// //         } else if (data.status === "completed") {
// //           setStatusMessage("Assignment ready!");
// //           setLoading(false);
// //           if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// //         } else if (data.status === "failed") {
// //           setStatusMessage(`Failed: ${data.error || "Unknown error"}`);
// //           setLoading(false);
// //         } else if (data.status === "ai_attempt") {
// //           setStatusMessage(`AI attempt ${data.attempt || 1}...`);
// //         } else if (data.status === "retrying") {
// //           setStatusMessage(`Retrying... Reason: ${data.reason || "unknown"}`);
// //         } else if (data.status === "switching_provider") {
// //           setStatusMessage(`Switching from ${data.from} to ${data.to}...`);
// //         }
// //       }, token || undefined);
      
// //       startPolling();
      
// //     } catch (err) {
// //       console.error("Socket connection error:", err);
// //       setSocketError(true);
// //       startPolling();
// //     }

// //     return () => {
// //       if (unsubscribe) unsubscribe();
// //       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
// //     };
// //   }, [id, fetchAssignment, token, startPolling]);

// //   const handlePrint = () => {
// //     if (pdfRef.current) {
// //       printPDF(pdfRef.current, `${assignment?.topic || "assignment"}`);
// //     }
// //   };

// //   const handleRetry = () => {
// //     setRetryCount(prev => prev + 1);
// //     fetchAssignment();
// //   };

// //   if (loading) {
// //     return (
// //       <div className="bg-black text-white min-h-screen">
// //         <Header />
// //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// //           <div className="relative">
// //             <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
// //             <div className="absolute inset-0 flex items-center justify-center">
// //               <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
// //             </div>
// //           </div>
// //           <h2 className="text-xl font-semibold mt-6 text-center">
// //             {statusMessage || "Preparing your assignment..."}
// //           </h2>
// //           {socketError && (
// //             <p className="text-gray-500 text-sm mt-2">
// //               Real-time connection lost. Updates may be delayed.
// //             </p>
// //           )}
// //           <p className="text-gray-400 text-sm mt-4">
// //             Please don't close this page
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (assignment?.status === "failed") {
// //     return (
// //       <div className="bg-black text-white min-h-screen">
// //         <Header />
// //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// //           <div className="text-center">
// //             <div className="text-6xl mb-4">✗</div>
// //             <h2 className="text-2xl font-bold text-red-500 mb-2">
// //               Generation Failed
// //             </h2>
// //             <p className="text-gray-400 mb-6 max-w-md">
// //               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
// //             </p>
// //             <div className="flex gap-4 justify-center">
// //               <button
// //                 onClick={handleRetry}
// //                 className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
// //               >
// //                 Try Again
// //               </button>
// //               <button
// //                 onClick={() => router.push("/create-assignment")}
// //                 className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
// //               >
// //                 Create New
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (assignment?.status === "completed" && assignment.paper) {
// //     const paper = assignment.paper;
// //     const currentDate = new Date().toLocaleDateString('en-GB');
    
// //     const fixedSections = paper.sections?.map(section => ({
// //       ...section,
// //       instruction: "Attempt all questions"
// //     })) || [];
    
// //     return (
// //       <div className="bg-black text-white min-h-screen">
// //         <Header />
        
// //         <div className="max-w-4xl mx-auto p-6">
// //           <div className="flex justify-end gap-3 mb-6 no-print">
// //             <button
// //               onClick={handlePrint}
// //               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
// //             >
// //               Print / Save as PDF
// //             </button>
// //             <button
// //               onClick={() => router.push("/create-assignment")}
// //               className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition text-sm font-medium"
// //             >
// //               New Assignment
// //             </button>
// //           </div>

// //           {/* Professional Question Paper Format */}
// //           <div
// //             ref={pdfRef}
// //             className="bg-white text-black"
// //             style={{ 
// //               fontFamily: "'Times New Roman', Times, serif", 
// //               fontSize: '12pt', 
// //               lineHeight: '1.3',
// //               padding: '0.75in',
// //               maxWidth: '100%',
// //               margin: '0 auto'
// //             }}
// //           >
// //             {/* TOP SECTION - School Header */}
// //             <div className="mb-4">
// //               {assignment.schoolName && (
// //                 <h1 className="text-center text-xl font-bold uppercase tracking-wide mb-1">
// //                   {assignment.schoolName}
// //                 </h1>
// //               )}
// //               <p className="text-sm font-semibold mt-2">
// //                 Subject: {assignment.subject}
// //               </p>
// //               <p className="text-sm font-semibold">
// //                 Class: {assignment.class}
// //               </p>
              
// //               <div className="my-2"></div>
              
// //               <p className="text-sm">
// //                 Time Allowed: {assignment.timeAllowed}
// //               </p>
// //               <p className="text-sm">
// //                 Maximum Marks: {assignment.totalMarks}
// //               </p>
              
// //               <div className="my-2"></div>
              
// //               <p className="text-sm italic">
// //                 All questions are compulsory unless stated otherwise.
// //               </p>
              
// //               <div className="my-3"></div>
              
// //               {/* ✅ Student Info - Class removed, only Name, Roll Number, Section */}
// //               <div className="flex flex-wrap gap-6 text-sm">
// //                 <span>Name: <span className="border-b border-gray-400 inline-block w-40 ml-2"></span></span>
// //                 <span>Roll Number: <span className="border-b border-gray-400 inline-block w-32 ml-2"></span></span>
// //                 <span>Section: <span className="border-b border-gray-400 inline-block w-20 ml-2"></span></span>
// //               </div>
// //             </div>

// //             {/* GENERAL INSTRUCTIONS */}
// //             <div className="mb-4">
// //               <h3 className="text-sm font-bold uppercase tracking-wide mb-1">
// //                 GENERAL INSTRUCTIONS:
// //               </h3>
// //               <div className="text-sm leading-relaxed space-y-0 ml-4">
// //                 <p>1. All questions are compulsory.</p>
// //                 <p>2. Write your answers in the space provided.</p>
// //                 <p>3. Read each question carefully before answering.</p>
// //                 <p>4. Marks are indicated against each question.</p>
// //                 <p className="mt-1">{paper.instructions}</p>
// //               </div>
// //             </div>

// //             {/* QUESTION SECTIONS */}
// //             {fixedSections.map((section, sectionIdx) => (
// //               <div key={sectionIdx} className="mb-4">
// //                 <h2 className="text-center text-lg font-bold uppercase tracking-wide mb-0">
// //                   {section.title}
// //                 </h2>
// //                 <p className="text-center text-sm font-semibold mb-0">
// //                   {section.title === "Section A" ? "Short Answer Questions" : 
// //                    section.title === "Section B" ? "Long Answer Questions" : 
// //                    "Analytical Questions"}
// //                 </p>
// //                 <p className="text-center text-xs italic text-gray-600 mb-2">
// //                   {section.instruction}. Each question carries appropriate marks.
// //                 </p>
                
// //                 {section.questions?.map((q, qIdx) => (
// //                   <div key={qIdx} className="mb-0">
// //                     <div className="flex justify-between items-start gap-4">
// //                       <p className="text-sm leading-tight flex-1">
// //                         <span className="font-bold">{q.number}.</span>{' '}
// //                         {q.text}
// //                       </p>
// //                       <span className="text-sm whitespace-nowrap ml-4">
// //                         ({q.marks})
// //                       </span>
// //                     </div>
// //                     {q.hint && (
// //                       <p className="text-xs text-gray-500 mt-0 italic ml-6">
// //                         Hint: {q.hint}
// //                       </p>
// //                     )}
// //                     <div className="mt-0 ml-6 h-3"></div>
// //                   </div>
// //                 ))}
// //               </div>
// //             ))}

// //             {/* FOOTER */}
// //             <div className="text-center text-xs text-gray-400 mt-2 pt-1">
// //               Best of Luck!
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return null;
// // }



// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import Header from "@/components/layout/Header";
// import { getSocket, onAssignmentUpdate, joinAssignmentRoom } from "../../lib/socket";
// import { printPDF } from "../../lib/printPdf";
// import { useUserStore } from "../../store/userStore";

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
//       <div className="bg-black text-white min-h-screen">
//         <Header />
//         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
//           <div className="relative">
//             <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
//             </div>
//           </div>
//           <h2 className="text-xl font-semibold mt-6 text-center">
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
//       <div className="bg-black text-white min-h-screen">
//         <Header />
//         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
//           <div className="text-center">
//             <div className="text-6xl mb-4">✗</div>
//             <h2 className="text-2xl font-bold text-red-500 mb-2">
//               Generation Failed
//             </h2>
//             <p className="text-gray-400 mb-6 max-w-md">
//               {assignment?.errorMessage || "Something went wrong while generating your assignment."}
//             </p>
//             <div className="flex gap-4 justify-center">
//               <button
//                 onClick={handleRetry}
//                 className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
//               >
//                 Try Again
//               </button>
//               <button
//                 onClick={() => router.push("/create-assignment")}
//                 className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
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
//       <div className="bg-black text-white min-h-screen">
//         <Header />
        
//         <div className="max-w-4xl mx-auto p-6">
//           <div className="flex justify-end gap-3 mb-6 no-print">
//             <button
//               onClick={handlePrint}
//               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
//             >
//               Print / Save as PDF
//             </button>
//             <button
//               onClick={() => router.push("/create-assignment")}
//               className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition text-sm font-medium"
//             >
//               New Assignment
//             </button>
//           </div>

//           {/* Professional Question Paper Format */}
//           <div
//             ref={pdfRef}
//             className="bg-white text-black"
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
              
//               <p className="text-sm">
//                 Time Allowed: {assignment.timeAllowed}
//               </p>
//               <p className="text-sm">
//                 Maximum Marks: {assignment.totalMarks}
//               </p>
              
//               <div className="my-2"></div>
              
//               <p className="text-sm italic">
//                 All questions are compulsory unless stated otherwise.
//               </p>
              
//               <div className="my-3"></div>
              
//               {/* Student Info */}
//               <div className="flex flex-wrap gap-6 text-sm">
//                 <span>Name: <span className="border-b border-gray-400 inline-block w-40 ml-2"></span></span>
//                 <span>Roll Number: <span className="border-b border-gray-400 inline-block w-32 ml-2"></span></span>
//                 <span>Section: <span className="border-b border-gray-400 inline-block w-20 ml-2"></span></span>
//               </div>
//             </div>

//             {/* GENERAL INSTRUCTIONS */}
//             <div className="mb-4">
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
//                 <h2 className="text-center text-lg font-bold uppercase tracking-wide mb-0">
//                   {section.title}
//                 </h2>
//                 <p className="text-center text-sm font-semibold mb-0">
//                   {section.title === "Section A" ? "Short Answer Questions" : 
//                    section.title === "Section B" ? "Long Answer Questions" : 
//                    "Analytical Questions"}
//                 </p>
//                 <p className="text-center text-xs italic text-gray-600 mb-2">
//                   {section.instruction}
//                 </p>
                
//                 {section.questions?.map((q, qIdx) => (
//                   <div key={qIdx} className="mb-0">
//                     <p className="text-sm leading-tight">
//                       <span className="font-bold">{q.number}.</span>{' '}
//                       {q.text} <span className="font-semibold">({q.marks})</span>
//                     </p>
//                     {q.hint && (
//                       <p className="text-xs text-gray-500 mt-0 italic ml-6">
//                         Hint: {q.hint}
//                       </p>
//                     )}
//                     <div className="mt-0 ml-6 h-3"></div>
//                   </div>
//                 ))}
//               </div>
//             ))}

//             {/* FOOTER */}
//             <div className="text-center text-xs text-gray-400 mt-2 pt-1">
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
      <div className="bg-black text-white min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold mt-6 text-center">
            {statusMessage || "Preparing your assignment..."}
          </h2>
          {socketError && (
            <p className="text-gray-500 text-sm mt-2">
              Real-time connection lost. Updates may be delayed.
            </p>
          )}
          <p className="text-gray-400 text-sm mt-4">
            Please don't close this page
          </p>
        </div>
      </div>
    );
  }

  if (assignment?.status === "failed") {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">
              Generation Failed
            </h2>
            <p className="text-gray-400 mb-6 max-w-md">
              {assignment?.errorMessage || "Something went wrong while generating your assignment."}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/create-assignment")}
                className="border border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
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
      <div className="bg-black text-white min-h-screen">
        <Header />
        
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-end gap-3 mb-6 no-print">
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={() => router.push("/create-assignment")}
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              New Assignment
            </button>
          </div>

          {/* Professional Question Paper Format */}
          <div
            ref={pdfRef}
            className="bg-white text-black"
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
              {assignment.schoolName && (
                <h1 className="text-center text-xl font-bold uppercase tracking-wide mb-1">
                  {assignment.schoolName}
                </h1>
              )}
              <p className="text-sm font-semibold mt-2">
                Subject: {assignment.subject}
              </p>
              <p className="text-sm font-semibold">
                Class: {assignment.class}
              </p>
              
              <div className="my-2"></div>
              
              <p className="text-sm">
                Time Allowed: {assignment.timeAllowed}
              </p>
              <p className="text-sm">
                Maximum Marks: {assignment.totalMarks}
              </p>
              
              <div className="my-2"></div>
              
              <p className="text-sm italic">
                All questions are compulsory unless stated otherwise.
              </p>
              
              <div className="my-3"></div>
              
              {/* Student Info */}
              <div className="flex flex-wrap gap-6 text-sm">
                <span>Name: <span className="border-b border-gray-400 inline-block w-40 ml-2"></span></span>
                <span>Roll Number: <span className="border-b border-gray-400 inline-block w-32 ml-2"></span></span>
                <span>Section: <span className="border-b border-gray-400 inline-block w-20 ml-2"></span></span>
              </div>
            </div>

            {/* GENERAL INSTRUCTIONS */}
            <div className="mb-4">
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

            {/* QUESTION SECTIONS - Clean with marks only once */}
            {fixedSections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="mb-4">
                <h2 className="text-center text-lg font-bold uppercase tracking-wide mb-0">
                  {section.title}
                </h2>
                <p className="text-center text-sm font-semibold mb-0">
                  {section.title === "Section A" ? "Short Answer Questions" : 
                   section.title === "Section B" ? "Long Answer Questions" : 
                   "Analytical Questions"}
                </p>
                <p className="text-center text-xs italic text-gray-600 mb-2">
                  {section.instruction}
                </p>
                
                {section.questions?.map((q, qIdx) => {
                  // Clean question text - remove any existing marks from AI to avoid duplication
                  let cleanText = q.text;
                  cleanText = cleanText.replace(/\s*\([\d\s]+(Marks|marks)?\)/gi, '');
                  cleanText = cleanText.trim();
                  
                  return (
                    <div key={qIdx} className="mb-0">
                      <p className="text-sm leading-tight">
                        <span className="font-bold">{q.number}.</span>{' '}
                        {cleanText}
                        {!cleanText.includes(`(${q.marks}`) && (
                          <span className="font-semibold"> ({q.marks})</span>
                        )}
                      </p>
                      {q.hint && (
                        <p className="text-xs text-gray-500 mt-0 italic ml-6">
                          Hint: {q.hint}
                        </p>
                      )}
                      <div className="mt-0 ml-6 h-3"></div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* FOOTER */}
            <div className="text-center text-xs text-gray-400 mt-2 pt-1">
              Best of Luck!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}