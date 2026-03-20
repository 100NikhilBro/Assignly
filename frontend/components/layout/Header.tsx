"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useUserStore();

  const handleCreate = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.credits <= 0) {
      alert("No credits left 🚫");
      return;
    }

    router.push("/create-assignment");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">

      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-orange-500">
        VedaAI
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Credits */}
        {user && (
          <div className="text-sm text-gray-300">
            Credits: <span className="text-orange-400">{user.credits}</span>
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="bg-orange-500 px-4 py-2 rounded text-sm hover:opacity-90"
        >
          Create Assignment
        </button>

        {/* Auth */}
        {!user ? (
          <button
            onClick={() => router.push("/login")}
            className="border px-4 py-2 rounded text-sm"
          >
            Login
          </button>
        ) : (
          <button
            onClick={logout}
            className="border px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        )}

      </div>
    </header>
  );
}