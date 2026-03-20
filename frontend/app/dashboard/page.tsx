"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUserStore();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/assignment", // 👈 add this API
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setAssignments(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === "completed").length,
    processing: assignments.filter(a => a.status === "processing").length,
    failed: assignments.filter(a => a.status === "failed").length,
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto p-6">

        {/* 🔝 USER INFO */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Welcome {user?.name || "User"} 👋
          </h1>
          <p className="text-gray-400">
            Credits: {user?.credits ?? 0}
          </p>
        </div>

        {/* ⚡ ACTIONS */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => router.push("/create-assignment")}
            className="bg-orange-500 px-4 py-2 rounded"
          >
            + Create Assignment
          </button>

          <button
            onClick={fetchAssignments}
            className="border border-gray-600 px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">

          <div className="card">Total: {stats.total}</div>
          <div className="card">Completed: {stats.completed}</div>
          <div className="card">Processing: {stats.processing}</div>
          <div className="card">Failed: {stats.failed}</div>

        </div>

        {/* 📄 LIST */}
        <div className="space-y-4">

          {loading && <p>Loading...</p>}

          {!loading && assignments.length === 0 && (
            <p className="text-gray-400">No assignments yet</p>
          )}

          {assignments.map((a) => (
            <div
              key={a._id}
              className="bg-[#111] p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{a.topic}</p>
                <p className="text-sm text-gray-400">
                  {a.subject} • {a.class}
                </p>
              </div>

              <div className="flex items-center gap-4">

                <span className={`text-xs px-2 py-1 rounded ${
                  a.status === "completed"
                    ? "bg-green-600"
                    : a.status === "processing"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}>
                  {a.status}
                </span>

                <button
                  onClick={() => router.push(`/assignment/${a._id}`)}
                  className="text-orange-400 text-sm"
                >
                  View →
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* styles */}
      <style jsx>{`
        .card {
          background: #111;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}