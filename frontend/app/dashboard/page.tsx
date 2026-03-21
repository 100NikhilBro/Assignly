// // "use client";

// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import Header from "@/components/layout/Header";
// // import { useRouter } from "next/navigation";
// // import { useUserStore } from "../store/userStore";

// // export default function DashboardPage() {
// //   const router = useRouter();
// //   const { user } = useUserStore();

// //   const [assignments, setAssignments] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   const fetchAssignments = async () => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       const res = await axios.get(
// //         "http://localhost:5000/api/assignment", // 👈 add this API
// //         {
// //           headers: {
// //             Authorization: token ? `Bearer ${token}` : "",
// //           },
// //         }
// //       );

// //       setAssignments(res.data.data || []);
// //     } catch (err) {
// //       console.log(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAssignments();
// //   }, []);

// //   const stats = {
// //     total: assignments.length,
// //     completed: assignments.filter(a => a.status === "completed").length,
// //     processing: assignments.filter(a => a.status === "processing").length,
// //     failed: assignments.filter(a => a.status === "failed").length,
// //   };

// //   return (
// //     <div className="bg-black text-white min-h-screen">
// //       <Header />

// //       <div className="max-w-6xl mx-auto p-6">

// //         {/* 🔝 USER INFO */}
// //         <div className="mb-6">
// //           <h1 className="text-2xl font-bold">
// //             Welcome {user?.name || "User"} 👋
// //           </h1>
// //           <p className="text-gray-400">
// //             Credits: {user?.credits ?? 0}
// //           </p>
// //         </div>

// //         {/* ⚡ ACTIONS */}
// //         <div className="flex gap-4 mb-6">
// //           <button
// //             onClick={() => router.push("/create-assignment")}
// //             className="bg-orange-500 px-4 py-2 rounded"
// //           >
// //             + Create Assignment
// //           </button>

// //           <button
// //             onClick={fetchAssignments}
// //             className="border border-gray-600 px-4 py-2 rounded"
// //           >
// //             Refresh
// //           </button>
// //         </div>

// //         {/* 📊 STATS */}
// //         <div className="grid grid-cols-4 gap-4 mb-6">

// //           <div className="card">Total: {stats.total}</div>
// //           <div className="card">Completed: {stats.completed}</div>
// //           <div className="card">Processing: {stats.processing}</div>
// //           <div className="card">Failed: {stats.failed}</div>

// //         </div>

// //         {/* 📄 LIST */}
// //         <div className="space-y-4">

// //           {loading && <p>Loading...</p>}

// //           {!loading && assignments.length === 0 && (
// //             <p className="text-gray-400">No assignments yet</p>
// //           )}

// //           {assignments.map((a) => (
// //             <div
// //               key={a._id}
// //               className="bg-[#111] p-4 rounded flex justify-between items-center"
// //             >
// //               <div>
// //                 <p className="font-semibold">{a.topic}</p>
// //                 <p className="text-sm text-gray-400">
// //                   {a.subject} • {a.class}
// //                 </p>
// //               </div>

// //               <div className="flex items-center gap-4">

// //                 <span className={`text-xs px-2 py-1 rounded ${
// //                   a.status === "completed"
// //                     ? "bg-green-600"
// //                     : a.status === "processing"
// //                     ? "bg-yellow-600"
// //                     : "bg-red-600"
// //                 }`}>
// //                   {a.status}
// //                 </span>

// //                 <button
// //                   onClick={() => router.push(`/assignment/${a._id}`)}
// //                   className="text-orange-400 text-sm"
// //                 >
// //                   View →
// //                 </button>

// //               </div>
// //             </div>
// //           ))}

// //         </div>
// //       </div>

// //       {/* styles */}
// //       <style jsx>{`
// //         .card {
// //           background: #111;
// //           padding: 16px;
// //           border-radius: 8px;
// //           text-align: center;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import Header from "@/components/layout/Header";
// import { useRouter } from "next/navigation";
// import { useUserStore } from "../store/userStore";
// import { useAuth } from "../hooks/useAuth";

// interface Assignment {
//   _id: string;
//   topic: string;
//   subject: string;
//   class: string;
//   status: "pending" | "processing" | "completed" | "failed";
//   createdAt: string;
//   totalMarks: number;
// }

// export default function DashboardPage() {
//   const router = useRouter();
//   const { user, token, updateCredits } = useUserStore();
//   const { isAuthenticated, isLoading: authLoading } = useAuth();
  
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchAssignments = useCallback(async () => {
//     if (!token) {
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setError("");
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/user/assignments`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
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
//     }
//   }, [token]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchAssignments();
//     } else if (!authLoading && !isAuthenticated) {
//       setLoading(false);
//     }
//   }, [isAuthenticated, authLoading, fetchAssignments]);

//   const stats = {
//     total: assignments.length,
//     completed: assignments.filter(a => a.status === "completed").length,
//     processing: assignments.filter(a => a.status === "processing").length,
//     failed: assignments.filter(a => a.status === "failed").length,
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Completed</span>;
//       case "processing":
//         return <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">Processing</span>;
//       case "pending":
//         return <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">Queued</span>;
//       case "failed":
//         return <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">Failed</span>;
//       default:
//         return null;
//     }
//   };

//   // Loading state
//   if (authLoading || loading) {
//     return (
//       <div className="bg-black text-white min-h-screen">
//         <Header />
//         <div className="flex items-center justify-center min-h-[70vh]">
//           <div className="text-center">
//             <div className="w-12 h-12 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
//             <p className="mt-4 text-gray-400">Loading dashboard...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Guest or not authenticated
//   if (!isAuthenticated) {
//     return (
//       <div className="bg-black text-white min-h-screen">
//         <Header />
//         <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
//           <div className="text-center">
//             <div className="text-6xl mb-4">🔒</div>
//             <h2 className="text-2xl font-bold mb-2">Login to View Dashboard</h2>
//             <p className="text-gray-400 mb-6">
//               Sign in to see your assignment history and track your credits.
//             </p>
//             <button
//               onClick={() => router.push("/login")}
//               className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
//             >
//               Login Now
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-black text-white min-h-screen">
//       <Header />

//       <div className="max-w-6xl mx-auto p-6">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold">
//             Welcome back, <span className="text-orange-500">{user?.name || "User"}!</span>
//           </h1>
//           <p className="text-gray-400 mt-1">
//             Track your assignments and create new ones
//           </p>
//         </div>

//         {/* Credits Card */}
//         <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6 mb-8">
//           <div className="flex justify-between items-center flex-wrap gap-4">
//             <div>
//               <p className="text-gray-300 text-sm">Available Credits</p>
//               <p className="text-4xl font-bold text-white">{user?.credits ?? 0}</p>
//             </div>
//             <button
//               onClick={() => router.push("/create-assignment")}
//               className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
//             >
//               + Create New Assignment
//             </button>
//           </div>
//           {user?.credits === 0 && (
//             <p className="text-red-400 text-sm mt-3">
//               ⚠️ You have 0 credits. Please upgrade to create more assignments.
//             </p>
//           )}
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
//             <p className="text-2xl font-bold text-white">{stats.total}</p>
//             <p className="text-gray-400 text-sm">Total</p>
//           </div>
//           <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
//             <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
//             <p className="text-gray-400 text-sm">Completed</p>
//           </div>
//           <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
//             <p className="text-2xl font-bold text-yellow-400">{stats.processing}</p>
//             <p className="text-gray-400 text-sm">Processing</p>
//           </div>
//           <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
//             <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
//             <p className="text-gray-400 text-sm">Failed</p>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
//             {error}
//           </div>
//         )}

//         {/* Assignments List */}
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">Recent Assignments</h2>
//             <button
//               onClick={fetchAssignments}
//               className="text-gray-400 hover:text-white text-sm transition"
//             >
//               Refresh ↻
//             </button>
//           </div>

//           {assignments.length === 0 ? (
//             <div className="bg-[#1a1a1a] rounded-lg p-12 text-center">
//               <div className="text-4xl mb-3">📝</div>
//               <p className="text-gray-400 mb-4">No assignments yet</p>
//               <button
//                 onClick={() => router.push("/create-assignment")}
//                 className="bg-orange-500 px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
//               >
//                 Create Your First Assignment
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {assignments.map((a) => (
//                 <div
//                   key={a._id}
//                   onClick={() => router.push(`/assignment/${a._id}`)}
//                   className="bg-[#1a1a1a] hover:bg-[#222] p-4 rounded-lg flex justify-between items-center cursor-pointer transition"
//                 >
//                   <div className="flex-1">
//                     <p className="font-semibold text-white">{a.topic}</p>
//                     <p className="text-sm text-gray-400">
//                       {a.subject} • Class {a.class} • {a.totalMarks} marks
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {new Date(a.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     {getStatusBadge(a.status)}
//                     <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";
import { useAuth } from "../hooks/useAuth";

interface Assignment {
  _id: string;
  topic: string;
  subject: string;
  class: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  totalMarks: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, updateCredits } = useUserStore();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignments = useCallback(async () => {
    console.log("🔍 Dashboard fetchAssignments - token:", token ? "present" : "null");
    
    if (!token) {
      console.log("❌ No token, skipping fetch");
      setLoading(false);
      return;
    }
    
    try {
      setError("");
      console.log("📤 Fetching assignments from:", `${process.env.NEXT_PUBLIC_API_URL}/user/assignments`);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/assignments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log("📥 Assignments response:", response.data);
      console.log("📊 Assignments count:", response.data.data?.length || 0);
      setAssignments(response.data.data || []);
    } catch (err: any) {
      console.error("❌ Fetch assignments error:", err);
      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load assignments");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    console.log("🔍 Dashboard useEffect - isAuthenticated:", isAuthenticated, "authLoading:", authLoading);
    
    if (isAuthenticated) {
      fetchAssignments();
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, fetchAssignments]);

  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === "completed").length,
    processing: assignments.filter(a => a.status === "processing").length,
    failed: assignments.filter(a => a.status === "failed").length,
  };

  console.log("📊 Dashboard stats:", stats);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Completed</span>;
      case "processing":
        return <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">Processing</span>;
      case "pending":
        return <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">Queued</span>;
      case "failed":
        return <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">Failed</span>;
      default:
        return null;
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Guest or not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-2">Login to View Dashboard</h2>
            <p className="text-gray-400 mb-6">
              Sign in to see your assignment history and track your credits.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-orange-500 px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-orange-500">{user?.name || "User"}!</span>
          </h1>
          <p className="text-gray-400 mt-1">
            Track your assignments and create new ones
          </p>
        </div>

        {/* Credits Card */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-gray-300 text-sm">Available Credits</p>
              <p className="text-4xl font-bold text-white">{user?.credits ?? 0}</p>
            </div>
            <button
              onClick={() => router.push("/create-assignment")}
              className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              + Create New Assignment
            </button>
          </div>
          {user?.credits === 0 && (
            <p className="text-red-400 text-sm mt-3">
              ⚠️ You have 0 credits. Please upgrade to create more assignments.
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-gray-400 text-sm">Total</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
            <p className="text-gray-400 text-sm">Completed</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.processing}</p>
            <p className="text-gray-400 text-sm">Processing</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
            <p className="text-gray-400 text-sm">Failed</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Assignments List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Assignments</h2>
            <button
              onClick={fetchAssignments}
              className="text-gray-400 hover:text-white text-sm transition"
            >
              Refresh ↻
            </button>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-lg p-12 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-400 mb-4">No assignments yet</p>
              <button
                onClick={() => router.push("/create-assignment")}
                className="bg-orange-500 px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
              >
                Create Your First Assignment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => (
                <div
                  key={a._id}
                  onClick={() => router.push(`/assignment/${a._id}`)}
                  className="bg-[#1a1a1a] hover:bg-[#222] p-4 rounded-lg flex justify-between items-center cursor-pointer transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white">{a.topic}</p>
                    <p className="text-sm text-gray-400">
                      {a.subject} • Class {a.class} • {a.totalMarks} marks
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(a.status)}
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}