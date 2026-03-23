// // "use client";

// // import { useEffect, useState, useCallback, useMemo } from "react";
// // import axios from "axios";
// // import Header from "@/components/layout/Header";
// // import { useRouter } from "next/navigation";
// // import { useUserStore } from "../store/userStore";
// // import { useAuth } from "../hooks/useAuth";
// // import { 
// //   FileText, 
// //   CheckCircle, 
// //   Loader2, 
// //   XCircle, 
// //   PlusCircle, 
// //   RefreshCw,
// //   LayoutDashboard,
// //   Star,
// //   Calendar,
// //   Clock,
// //   Search,
// //   X
// // } from "lucide-react";

// // interface Assignment {
// //   _id: string;
// //   topic: string;
// //   subject: string;
// //   class: string;
// //   status: "pending" | "processing" | "completed" | "failed";
// //   createdAt: string;
// //   dueDate?: string;
// //   totalMarks: number;
// // }

// // export default function DashboardPage() {
// //   const router = useRouter();
// //   const { user, token, updateCredits } = useUserStore();
// //   const { isAuthenticated, isLoading: authLoading } = useAuth();
  
// //   const [assignments, setAssignments] = useState<Assignment[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");

// //   const fetchAssignments = useCallback(async (showRefresh = false) => {
// //     if (!token) {
// //       setLoading(false);
// //       return;
// //     }
    
// //     if (showRefresh) setRefreshing(true);
// //     else setLoading(true);
    
// //     try {
// //       setError("");
// //       const response = await axios.get(
// //         `${process.env.NEXT_PUBLIC_API_URL}/user/assignments`,
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //           params: { _t: Date.now() },
// //         }
// //       );
      
// //       setAssignments(response.data.data || []);
// //     } catch (err: any) {
// //       console.error("Fetch assignments error:", err);
// //       if (err?.response?.status === 401) {
// //         setError("Session expired. Please login again.");
// //       } else {
// //         setError("Failed to load assignments");
// //       }
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   }, [token]);

// //   useEffect(() => {
// //     if (isAuthenticated) {
// //       fetchAssignments();
// //     } else if (!authLoading && !isAuthenticated) {
// //       setLoading(false);
// //     }
// //   }, [isAuthenticated, authLoading, fetchAssignments]);

// //   // Filter assignments based on search query
// //   const filteredAssignments = useMemo(() => {
// //     if (!searchQuery.trim()) return assignments;
    
// //     const query = searchQuery.toLowerCase().trim();
// //     return assignments.filter(assignment => 
// //       assignment.topic.toLowerCase().includes(query) ||
// //       assignment.subject.toLowerCase().includes(query) ||
// //       assignment.class.toLowerCase().includes(query) ||
// //       assignment.status.toLowerCase().includes(query)
// //     );
// //   }, [assignments, searchQuery]);

// //   const stats = {
// //     total: filteredAssignments.length,
// //     completed: filteredAssignments.filter(a => a.status === "completed").length,
// //     processing: filteredAssignments.filter(a => a.status === "processing").length,
// //     failed: filteredAssignments.filter(a => a.status === "failed").length,
// //   };

// //   const getStatusBadge = (status: string) => {
// //     switch (status) {
// //       case "completed":
// //         return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>;
// //       case "processing":
// //         return <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Processing</span>;
// //       case "pending":
// //         return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">Queued</span>;
// //       case "failed":
// //         return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed</span>;
// //       default:
// //         return null;
// //     }
// //   };

// //   const formatDate = (dateString?: string) => {
// //     if (!dateString) return "No due date";
// //     return new Date(dateString).toLocaleDateString('en-GB', {
// //       day: '2-digit',
// //       month: 'short',
// //       year: 'numeric'
// //     });
// //   };

// //   const formatCreatedDate = (dateString: string) => {
// //     return new Date(dateString).toLocaleDateString('en-GB', {
// //       day: '2-digit',
// //       month: 'short',
// //       year: 'numeric'
// //     });
// //   };

// //   const isOverdue = (dueDate?: string) => {
// //     if (!dueDate) return false;
// //     return new Date(dueDate) < new Date();
// //   };

// //   const clearSearch = () => {
// //     setSearchQuery("");
// //   };

// //   if (authLoading || loading) {
// //     return (
// //       <div className="bg-gray-50 min-h-screen">
// //         <Header />
// //         <div className="flex items-center justify-center min-h-[70vh]">
// //           <div className="text-center">
// //             <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
// //             <p className="mt-4 text-gray-500">Loading dashboard...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!isAuthenticated) {
// //     return (
// //       <div className="bg-gray-50 min-h-screen">
// //         <Header />
// //         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
// //           <div className="text-center">
// //             <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <LayoutDashboard className="w-10 h-10 text-indigo-600" />
// //             </div>
// //             <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to View Dashboard</h2>
// //             <p className="text-gray-500 mb-6">
// //               Sign in to see your assignment history and track your credits.
// //             </p>
// //             <button
// //               onClick={() => router.push("/login")}
// //               className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
// //             >
// //               Login Now
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="bg-gray-50 min-h-screen">
// //       <Header />

// //       <div className="max-w-6xl mx-auto p-6">
// //         {/* Welcome Section */}
// //         <div className="mb-8">
// //           <h1 className="text-3xl font-bold text-gray-900">
// //             Welcome back, <span className="text-indigo-600">{user?.name || "User"}</span>
// //           </h1>
// //           <p className="text-gray-500 mt-1">
// //             Track your assignments and create new ones
// //           </p>
// //         </div>

// //         {/* Credits Card */}
// //         <div className="bg-gradient-to-r from-indigo-50 to-amber-50 border border-indigo-100 rounded-2xl p-6 mb-8">
// //           <div className="flex justify-between items-center flex-wrap gap-4">
// //             <div>
// //               <p className="text-gray-600 text-sm flex items-center gap-1">
// //                 <Star className="w-4 h-4 text-amber-500" />
// //                 Available Credits
// //               </p>
// //               <p className="text-4xl font-bold text-indigo-600">{user?.credits ?? 0}</p>
// //             </div>
// //             <button
// //               onClick={() => router.push("/create-assignment")}
// //               className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2"
// //             >
// //               <PlusCircle className="w-5 h-5" />
// //               Create New Assignment
// //             </button>
// //           </div>
// //           {user?.credits === 0 && (
// //             <p className="text-amber-600 text-sm mt-3">
// //               ⚠️ You have 0 credits. Please upgrade to create more assignments.
// //             </p>
// //           )}
// //         </div>

// //         {/* Stats Grid */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
// //           <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
// //             <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
// //             <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
// //               <FileText className="w-3 h-3" />
// //               Total
// //             </p>
// //           </div>
// //           <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
// //             <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
// //             <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
// //               <CheckCircle className="w-3 h-3" />
// //               Completed
// //             </p>
// //           </div>
// //           <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
// //             <p className="text-2xl font-bold text-amber-600">{stats.processing}</p>
// //             <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
// //               <Loader2 className="w-3 h-3" />
// //               Processing
// //             </p>
// //           </div>
// //           <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
// //             <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
// //             <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
// //               <XCircle className="w-3 h-3" />
// //               Failed
// //             </p>
// //           </div>
// //         </div>

// //         {/* Error Message */}
// //         {error && (
// //           <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
// //             {error}
// //           </div>
// //         )}

// //         {/* Search and Assignments Header */}
// //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
// //           <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
// //           <div className="flex items-center gap-2 w-full sm:w-auto">
// //             <div className="relative flex-1 sm:flex-initial min-w-[200px]">
// //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
// //               <input
// //                 type="text"
// //                 placeholder="Search by topic, subject, class..."
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //                 className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //               />
// //               {searchQuery && (
// //                 <button
// //                   onClick={clearSearch}
// //                   className="absolute right-3 top-1/2 -translate-y-1/2"
// //                 >
// //                   <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
// //                 </button>
// //               )}
// //             </div>
// //             <button
// //               onClick={() => fetchAssignments(true)}
// //               disabled={refreshing}
// //               className="text-gray-500 hover:text-indigo-600 text-sm transition flex items-center gap-1 whitespace-nowrap"
// //             >
// //               <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
// //               Refresh
// //             </button>
// //           </div>
// //         </div>

// //         {/* Assignments List */}
// //         {filteredAssignments.length === 0 ? (
// //           <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
// //             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //               {searchQuery ? (
// //                 <Search className="w-8 h-8 text-gray-400" />
// //               ) : (
// //                 <FileText className="w-8 h-8 text-gray-400" />
// //               )}
// //             </div>
// //             <p className="text-gray-500 mb-4">
// //               {searchQuery 
// //                 ? `No assignments found matching "${searchQuery}"`
// //                 : "No assignments yet"}
// //             </p>
// //             {searchQuery ? (
// //               <button
// //                 onClick={clearSearch}
// //                 className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
// //               >
// //                 Clear search
// //               </button>
// //             ) : (
// //               <button
// //                 onClick={() => router.push("/create-assignment")}
// //                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
// //               >
// //                 Create Your First Assignment
// //               </button>
// //             )}
// //           </div>
// //         ) : (
// //           <>
// //             {searchQuery && (
// //               <p className="text-sm text-gray-500 mb-3">
// //                 Found {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? "s" : ""} for "{searchQuery}"
// //               </p>
// //             )}
// //             <div className="space-y-3">
// //               {filteredAssignments.map((a) => (
// //                 <div
// //                   key={a._id}
// //                   onClick={() => router.push(`/assignment/${a._id}`)}
// //                   className="bg-white hover:bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start cursor-pointer transition"
// //                 >
// //                   <div className="flex-1">
// //                     <p className="font-semibold text-gray-900">{a.topic}</p>
// //                     <p className="text-sm text-gray-500 mt-1">
// //                       {a.subject} • Class {a.class} • {a.totalMarks} marks
// //                     </p>
// //                     <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
// //                       <span className="flex items-center gap-1">
// //                         <Calendar className="w-3 h-3" />
// //                         Created: {formatCreatedDate(a.createdAt)}
// //                       </span>
// //                       {a.dueDate && (
// //                         <span className={`flex items-center gap-1 ${isOverdue(a.dueDate) && a.status !== "completed" ? "text-red-500" : ""}`}>
// //                           <Clock className="w-3 h-3" />
// //                           Due: {formatDate(a.dueDate)}
// //                           {isOverdue(a.dueDate) && a.status !== "completed" && " (Overdue)"}
// //                         </span>
// //                       )}
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center gap-4 ml-4">
// //                     {getStatusBadge(a.status)}
// //                     <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// //                     </svg>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }




// "use client";

// import { useEffect, useState, useCallback, useMemo } from "react";
// import axios from "axios";
// import Header from "@/components/layout/Header";
// import { useRouter } from "next/navigation";
// import { useUserStore } from "../store/userStore";
// import { useAuth } from "../hooks/useAuth";
// import { 
//   FileText, 
//   CheckCircle, 
//   Loader2, 
//   XCircle, 
//   PlusCircle, 
//   RefreshCw,
//   LayoutDashboard,
//   Star,
//   Calendar,
//   Clock,
//   Search,
//   X,
//   ChevronRight,
//   Sparkles
// } from "lucide-react";

// interface Assignment {
//   _id: string;
//   topic: string;
//   subject: string;
//   class: string;
//   status: "pending" | "processing" | "completed" | "failed";
//   createdAt: string;
//   dueDate?: string;
//   totalMarks: number;
// }

// export default function DashboardPage() {
//   const router = useRouter();
//   const { user, token, updateCredits } = useUserStore();
//   const { isAuthenticated, isLoading: authLoading } = useAuth();
  
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isMobile, setIsMobile] = useState(false);

//   // Check for mobile viewport
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const fetchAssignments = useCallback(async (showRefresh = false) => {
//     if (!token) {
//       setLoading(false);
//       return;
//     }
    
//     if (showRefresh) setRefreshing(true);
//     else setLoading(true);
    
//     try {
//       setError("");
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/user/assignments`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { _t: Date.now() },
//         }
//       );
      
//       setAssignments(response.data.data || []);
//     } catch (err: any) {
//       console.error("Fetch assignments error:", err);
//       if (err?.response?.status === 401) {
//         setError("Session expired. Please login again.");
//       } else {
//         setError("Failed to load assignments");
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchAssignments();
//     } else if (!authLoading && !isAuthenticated) {
//       setLoading(false);
//     }
//   }, [isAuthenticated, authLoading, fetchAssignments]);

//   // Filter assignments based on search query
//   const filteredAssignments = useMemo(() => {
//     if (!searchQuery.trim()) return assignments;
    
//     const query = searchQuery.toLowerCase().trim();
//     return assignments.filter(assignment => 
//       assignment.topic.toLowerCase().includes(query) ||
//       assignment.subject.toLowerCase().includes(query) ||
//       assignment.class.toLowerCase().includes(query) ||
//       assignment.status.toLowerCase().includes(query)
//     );
//   }, [assignments, searchQuery]);

//   const stats = {
//     total: filteredAssignments.length,
//     completed: filteredAssignments.filter(a => a.status === "completed").length,
//     processing: filteredAssignments.filter(a => a.status === "processing").length,
//     failed: filteredAssignments.filter(a => a.status === "failed").length,
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <span className="bg-green-100 text-green-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1"><CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Completed</span>;
//       case "processing":
//         return <span className="bg-amber-100 text-amber-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1"><Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" /> Processing</span>;
//       case "pending":
//         return <span className="bg-gray-100 text-gray-600 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1">Queued</span>;
//       case "failed":
//         return <span className="bg-red-100 text-red-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1"><XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Failed</span>;
//       default:
//         return null;
//     }
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "No due date";
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const formatCreatedDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const isOverdue = (dueDate?: string) => {
//     if (!dueDate) return false;
//     return new Date(dueDate) < new Date();
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="relative min-h-screen bg-[#fdfaf5]">
//         {/* Background Grid */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]" />
        
//         {/* Soft Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
        
//         <Header />
        
//         <div className="relative flex items-center justify-center min-h-[70vh] px-4">
//           <div className="text-center">
//             <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-amber-600 mx-auto" />
//             <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500">Loading dashboard...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="relative min-h-screen bg-[#fdfaf5]">
//         {/* Background Grid */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]" />
        
//         {/* Soft Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
        
//         <Header />
        
//         <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4">
//           <div className="text-center max-w-md mx-auto">
//             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
//             </div>
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Login to View Dashboard</h2>
//             <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6">
//               Sign in to see your assignment history and track your credits.
//             </p>
//             <button
//               onClick={() => router.push("/login")}
//               className="bg-amber-600 hover:bg-amber-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base transition"
//             >
//               Login Now
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen bg-[#fdfaf5] overflow-x-hidden">
//       {/* Background Grid */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]" />
      
//       {/* Soft Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
      
//       <Header />

//       <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
//         {/* Welcome Section */}
//         <div className="mb-6 sm:mb-8">
//           <div className="inline-flex items-center gap-2 bg-amber-50/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border border-amber-100">
//             <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
//             <span className="text-xs sm:text-sm text-amber-700 font-medium">Dashboard</span>
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//             Welcome back, <span className="text-amber-600">{user?.name || "User"}</span>
//           </h1>
//           <p className="text-sm sm:text-base text-gray-500 mt-1">
//             Track your assignments and create new ones
//           </p>
//         </div>

//         {/* Credits Card */}
//         <div className="bg-gradient-to-r from-amber-50/80 to-amber-100/50 backdrop-blur-sm border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1">
//                 <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
//                 Available Credits
//               </p>
//               <p className="text-3xl sm:text-4xl font-bold text-amber-600">{user?.credits ?? 0}</p>
//             </div>
//             <button
//               onClick={() => router.push("/create-assignment")}
//               className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base"
//             >
//               <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
//               Create New Assignment
//             </button>
//           </div>
//           {user?.credits === 0 && (
//             <p className="text-amber-600 text-xs sm:text-sm mt-3">
//               ⚠️ You have 0 credits. Please upgrade to create more assignments.
//             </p>
//           )}
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
//           <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 shadow-sm text-center">
//             <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.total}</p>
//             <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-1">
//               <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//               Total
//             </p>
//           </div>
//           <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 shadow-sm text-center">
//             <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
//             <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-1">
//               <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//               Completed
//             </p>
//           </div>
//           <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 shadow-sm text-center">
//             <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.processing}</p>
//             <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-1">
//               <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//               Processing
//             </p>
//           </div>
//           <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 shadow-sm text-center">
//             <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.failed}</p>
//             <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-1">
//               <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//               Failed
//             </p>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-5 sm:mb-6 bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-600 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm sm:text-base">
//             {error}
//           </div>
//         )}

//         {/* Search and Assignments Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Assignments</h2>
//           <div className="flex items-center gap-2 w-full sm:w-auto">
//             <div className="relative flex-1 sm:flex-initial min-w-[200px]">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder={isMobile ? "Search..." : "Search by topic, subject, class..."}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={clearSearch}
//                   className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2"
//                 >
//                   <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" />
//                 </button>
//               )}
//             </div>
//             <button
//               onClick={() => fetchAssignments(true)}
//               disabled={refreshing}
//               className="text-gray-500 hover:text-amber-600 text-xs sm:text-sm transition flex items-center gap-1 whitespace-nowrap"
//             >
//               <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
//               <span className="hidden sm:inline">Refresh</span>
//             </button>
//           </div>
//         </div>

//         {/* Assignments List */}
//         {filteredAssignments.length === 0 ? (
//           <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-amber-100">
//             <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//               {searchQuery ? (
//                 <Search className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
//               ) : (
//                 <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
//               )}
//             </div>
//             <p className="text-gray-500 text-sm sm:text-base mb-3 sm:mb-4">
//               {searchQuery 
//                 ? `No assignments found matching "${searchQuery}"`
//                 : "No assignments yet"}
//             </p>
//             {searchQuery ? (
//               <button
//                 onClick={clearSearch}
//                 className="text-amber-600 hover:text-amber-700 text-xs sm:text-sm font-medium"
//               >
//                 Clear search
//               </button>
//             ) : (
//               <button
//                 onClick={() => router.push("/create-assignment")}
//                 className="bg-amber-600 hover:bg-amber-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition"
//               >
//                 Create Your First Assignment
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {searchQuery && (
//               <p className="text-xs sm:text-sm text-gray-500 mb-3">
//                 Found {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? "s" : ""} for "{searchQuery}"
//               </p>
//             )}
//             <div className="space-y-2 sm:space-y-3">
//               {filteredAssignments.map((a) => (
//                 <div
//                   key={a._id}
//                   onClick={() => router.push(`/assignment/${a._id}`)}
//                   className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 cursor-pointer transition active:bg-amber-50 sm:active:bg-white"
//                 >
//                   <div className="flex-1 w-full">
//                     <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{a.topic}</p>
//                     <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                       {a.subject} • Class {a.class} • {a.totalMarks} marks
//                     </p>
//                     <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-[10px] sm:text-xs text-gray-400">
//                       <span className="flex items-center gap-1">
//                         <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                         Created: {formatCreatedDate(a.createdAt)}
//                       </span>
//                       {a.dueDate && (
//                         <span className={`flex items-center gap-1 ${isOverdue(a.dueDate) && a.status !== "completed" ? "text-red-500" : ""}`}>
//                           <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                           Due: {formatDate(a.dueDate)}
//                           {!isMobile && isOverdue(a.dueDate) && a.status !== "completed" && " (Overdue)"}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-4">
//                     {getStatusBadge(a.status)}
//                     <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";
import { useAuth } from "../hooks/useAuth";
import { 
  FileText, 
  CheckCircle, 
  Loader2, 
  XCircle, 
  PlusCircle, 
  RefreshCw,
  LayoutDashboard,
  Star,
  Calendar,
  Clock,
  Search,
  X,
  ChevronRight,
  Sparkles,
  Home,
  Plus,
  User
} from "lucide-react";

interface Assignment {
  _id: string;
  topic: string;
  subject: string;
  class: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  dueDate?: string;
  totalMarks: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, updateCredits } = useUserStore();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchAssignments = useCallback(async (showRefresh = false) => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      setError("");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/assignments`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { _t: Date.now() },
        }
      );
      
      setAssignments(response.data.data || []);
    } catch (err: any) {
      console.error("Fetch assignments error:", err);
      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load assignments");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssignments();
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, fetchAssignments]);

  // Filter assignments based on search query
  const filteredAssignments = useMemo(() => {
    if (!searchQuery.trim()) return assignments;
    
    const query = searchQuery.toLowerCase().trim();
    return assignments.filter(assignment => 
      assignment.topic.toLowerCase().includes(query) ||
      assignment.subject.toLowerCase().includes(query) ||
      assignment.class.toLowerCase().includes(query) ||
      assignment.status.toLowerCase().includes(query)
    );
  }, [assignments, searchQuery]);

  const stats = {
    total: filteredAssignments.length,
    completed: filteredAssignments.filter(a => a.status === "completed").length,
    processing: filteredAssignments.filter(a => a.status === "processing").length,
    failed: filteredAssignments.filter(a => a.status === "failed").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="bg-green-100 text-green-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1"><CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Completed</span>;
      case "processing":
        return <span className="bg-amber-100 text-amber-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1"><Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" /> Processing</span>;
      case "pending":
        return <span className="bg-gray-100 text-gray-600 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1">Queued</span>;
      case "failed":
        return <span className="bg-red-100 text-red-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1"><XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Failed</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCreatedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (authLoading || loading) {
    return (
      <div className="relative min-h-screen bg-[#fdfaf5]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
        <Header />
        <div className="relative flex items-center justify-center min-h-[70vh] px-4">
          <div className="text-center">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-amber-600 mx-auto" />
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#fdfaf5]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
        <Header />
        <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Login to View Dashboard</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6">
              Sign in to see your assignment history and track your credits.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base transition"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fdfaf5] overflow-x-hidden pb-20 sm:pb-0">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]" />
      
      {/* Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />
      
      <Header />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-50/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border border-amber-100">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            <span className="text-xs sm:text-sm text-amber-700 font-medium">Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-amber-600">{user?.name || "User"}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Track your assignments and create new ones
          </p>
        </div>

        {/* Credits Card - Desktop only */}
        <div className="hidden sm:block bg-gradient-to-r from-amber-50/80 to-amber-100/50 backdrop-blur-sm border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                Available Credits
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-amber-600">{user?.credits ?? 0}</p>
            </div>
            <button
              onClick={() => router.push("/create-assignment")}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Create New Assignment
            </button>
          </div>
          {user?.credits === 0 && (
            <p className="text-amber-600 text-xs sm:text-sm mt-3">
              ⚠️ You have 0 credits. Please upgrade to create more assignments.
            </p>
          )}
        </div>

        {/* Stats Grid - Desktop only */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 shadow-sm text-center">
            <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.total}</p>
            <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-1">
              <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Total
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 shadow-sm text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Completed
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 shadow-sm text-center">
            <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.processing}</p>
            <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-1">
              <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Processing
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 shadow-sm text-center">
            <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-1">
              <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Failed
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 sm:mb-6 bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-600 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Search and Assignments Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Assignments</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder={isMobile ? "Search..." : "Search by topic, subject, class..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              onClick={() => fetchAssignments(true)}
              disabled={refreshing}
              className="text-gray-500 hover:text-amber-600 text-xs sm:text-sm transition flex items-center gap-1 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Assignments List */}
        {filteredAssignments.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-amber-100">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              {searchQuery ? (
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
              ) : (
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
              )}
            </div>
            <p className="text-gray-500 text-sm sm:text-base mb-3 sm:mb-4">
              {searchQuery 
                ? `No assignments found matching "${searchQuery}"`
                : "No assignments yet"}
            </p>
            {searchQuery ? (
              <button
                onClick={clearSearch}
                className="text-amber-600 hover:text-amber-700 text-xs sm:text-sm font-medium"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={() => router.push("/create-assignment")}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition"
              >
                Create Your First Assignment
              </button>
            )}
          </div>
        ) : (
          <>
            {searchQuery && (
              <p className="text-xs sm:text-sm text-gray-500 mb-3">
                Found {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
            )}
            <div className="space-y-2 sm:space-y-3 mb-4">
              {filteredAssignments.map((a) => (
                <div
                  key={a._id}
                  onClick={() => router.push(`/assignment/${a._id}`)}
                  className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 cursor-pointer transition active:bg-amber-50 sm:active:bg-white"
                >
                  <div className="flex-1 w-full">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{a.topic}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {a.subject} • Class {a.class} • {a.totalMarks} marks
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-[10px] sm:text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Created: {formatCreatedDate(a.createdAt)}
                      </span>
                      {a.dueDate && (
                        <span className={`flex items-center gap-1 ${isOverdue(a.dueDate) && a.status !== "completed" ? "text-red-500" : ""}`}>
                          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          Due: {formatDate(a.dueDate)}
                          {!isMobile && isOverdue(a.dueDate) && a.status !== "completed" && " (Overdue)"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-4">
                    {getStatusBadge(a.status)}
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-amber-100 py-2 px-4 sm:hidden z-50 shadow-lg">
        <div className="flex justify-around items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex flex-col items-center gap-1 text-amber-600"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button
            onClick={() => router.push("/create-assignment")}
            disabled={user?.credits === 0}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-medium">Create</span>
          </button>
          
          <button
            onClick={() => router.push("/profile")}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
