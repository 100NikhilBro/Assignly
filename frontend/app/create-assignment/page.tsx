"use client";

import { useState } from "react";
import axios from "axios";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { user, updateCredits } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    schoolName: "",
    class: "",
    subject: "",
    topic: "",
    totalMarks: "",
    timeAllowed: "45 minutes",
    instructions: "",
    concepts: "",
    includeHints: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    setError("");

    // ✅ Basic validation
    if (!form.class || !form.subject || !form.topic || !form.totalMarks) {
      setError("Please fill all required fields");
      return;
    }

    // ✅ Credits check
    if (user && user.credits <= 0) {
      setError("No credits left 🚫");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        schoolName: form.schoolName,
        class: form.class,
        subject: form.subject,
        topic: form.topic,
        totalMarks: Number(form.totalMarks),
        timeAllowed: form.timeAllowed,
        instructions: form.instructions,
        concepts: form.concepts
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        questionTypes: ["theory"],
        includeHints: form.includeHints,
      };

      const res = await axios.post(
        "http://localhost:5000/api/assignment",
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = res.data;

      // 🔥 update credits locally
      if (user) {
        updateCredits(user.credits - 1);
      }

      router.push(`/assignment/${data.data.id}`);

    } catch (err: any) {
      console.log(err);
      setError(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      <div className="max-w-3xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">
          Create Assignment
        </h1>

        {/* 🔴 ERROR */}
        {error && (
          <div className="mb-4 bg-red-500/20 text-red-400 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">

          <input
            name="schoolName"
            placeholder="School Name"
            onChange={handleChange}
            className="input"
          />

          <input
            name="class"
            placeholder="Class *"
            onChange={handleChange}
            className="input"
          />

          <input
            name="subject"
            placeholder="Subject *"
            onChange={handleChange}
            className="input"
          />

          <input
            name="topic"
            placeholder="Topic *"
            onChange={handleChange}
            className="input"
          />

          <input
            name="totalMarks"
            type="number"
            placeholder="Total Marks *"
            onChange={handleChange}
            className="input"
          />

          <input
            name="timeAllowed"
            placeholder="Time Allowed (e.g. 45 minutes)"
            onChange={handleChange}
            className="input"
          />

        </div>

        {/* Concepts */}
        <div className="mt-4">
          <input
            name="concepts"
            placeholder="Concepts (comma separated)"
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        {/* Instructions */}
        <div className="mt-4">
          <textarea
            name="instructions"
            placeholder="Instructions"
            onChange={handleChange}
            className="input w-full h-24"
          />
        </div>

        {/* Hint Toggle */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            name="includeHints"
            checked={form.includeHints}
            onChange={handleChange}
          />
          <label>Include Hints</label>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-orange-500 py-3 rounded font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Generating Paper..." : "Create Assignment"}
        </button>

      </div>

      {/* styling */}
      <style jsx>{`
        .input {
          background: #0b0b0b;
          border: 1px solid #333;
          padding: 10px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}