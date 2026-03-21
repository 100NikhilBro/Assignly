"use client";

import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useUserStore } from "./store/userStore";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();  // ✅ Use isAuthenticated instead

  const handleStart = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/create-assignment");
    }
  };

  return (
    <div className="bg-[#0b0b0b] text-white min-h-screen">
      <Header />

      {/* HERO */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          AI Powered Assignment Generator
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Create structured exam papers with AI in seconds. Save time, generate
          better questions, and manage everything in one place.
        </p>

        <button
          onClick={handleStart}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg text-lg font-medium transition"
        >
          Create Assignment
        </button>

        <p className="mt-4 text-sm text-gray-500">
          Free credits available for new users 🚀
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 bg-[#111]">
        <h2 className="text-2xl font-semibold text-center mb-12">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-[#1a1a1a] rounded-xl">
            <h3 className="font-semibold mb-2">1. Create Assignment</h3>
            <p className="text-gray-400 text-sm">
              Enter topic, subject and preferences
            </p>
          </div>

          <div className="p-6 bg-[#1a1a1a] rounded-xl">
            <h3 className="font-semibold mb-2">2. AI Generates Paper</h3>
            <p className="text-gray-400 text-sm">
              AI creates structured questions with difficulty levels
            </p>
          </div>

          <div className="p-6 bg-[#1a1a1a] rounded-xl">
            <h3 className="font-semibold mb-2">3. Download & Use</h3>
            <p className="text-gray-400 text-sm">
              View, edit or download your exam paper
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-800">
        © 2026 VedaAI. Built for educators.
      </footer>
    </div>
  );
}