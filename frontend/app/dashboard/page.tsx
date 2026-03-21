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
  X
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
        return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case "processing":
        return <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Processing</span>;
      case "pending":
        return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">Queued</span>;
      case "failed":
        return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed</span>;
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
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
            <p className="mt-4 text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to View Dashboard</h2>
            <p className="text-gray-500 mb-6">
              Sign in to see your assignment history and track your credits.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-indigo-600">{user?.name || "User"}</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Track your assignments and create new ones
          </p>
        </div>

        {/* Credits Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-amber-50 border border-indigo-100 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-gray-600 text-sm flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500" />
                Available Credits
              </p>
              <p className="text-4xl font-bold text-indigo-600">{user?.credits ?? 0}</p>
            </div>
            <button
              onClick={() => router.push("/create-assignment")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Create New Assignment
            </button>
          </div>
          {user?.credits === 0 && (
            <p className="text-amber-600 text-sm mt-3">
              ⚠️ You have 0 credits. Please upgrade to create more assignments.
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
              <FileText className="w-3 h-3" />
              Total
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Completed
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.processing}</p>
            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
              <Loader2 className="w-3 h-3" />
              Processing
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
              <XCircle className="w-3 h-3" />
              Failed
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Search and Assignments Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by topic, subject, class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              onClick={() => fetchAssignments(true)}
              disabled={refreshing}
              className="text-gray-500 hover:text-indigo-600 text-sm transition flex items-center gap-1 whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Assignments List */}
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {searchQuery ? (
                <Search className="w-8 h-8 text-gray-400" />
              ) : (
                <FileText className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No assignments found matching "${searchQuery}"`
                : "No assignments yet"}
            </p>
            {searchQuery ? (
              <button
                onClick={clearSearch}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={() => router.push("/create-assignment")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Create Your First Assignment
              </button>
            )}
          </div>
        ) : (
          <>
            {searchQuery && (
              <p className="text-sm text-gray-500 mb-3">
                Found {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
            )}
            <div className="space-y-3">
              {filteredAssignments.map((a) => (
                <div
                  key={a._id}
                  onClick={() => router.push(`/assignment/${a._id}`)}
                  className="bg-white hover:bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start cursor-pointer transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{a.topic}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {a.subject} • Class {a.class} • {a.totalMarks} marks
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created: {formatCreatedDate(a.createdAt)}
                      </span>
                      {a.dueDate && (
                        <span className={`flex items-center gap-1 ${isOverdue(a.dueDate) && a.status !== "completed" ? "text-red-500" : ""}`}>
                          <Clock className="w-3 h-3" />
                          Due: {formatDate(a.dueDate)}
                          {isOverdue(a.dueDate) && a.status !== "completed" && " (Overdue)"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    {getStatusBadge(a.status)}
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
