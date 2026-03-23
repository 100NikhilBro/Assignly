

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  LogOut,
  LogIn,
  LayoutDashboard,
  Plus,
  Star,
  PenTool,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUserStore();

  const [credits, setCredits] = useState(user?.credits || 0);

  useEffect(() => {
    setCredits(user?.credits || 0);
  }, [user?.credits]);

  const handleCreate = () => {
    if (!user) {
      toast.error("Login required");
      router.push("/login");
      return;
    }

    if (user.credits <= 0) {
      toast.error("No credits left");
      return;
    }

    router.push("/create-assignment");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* MAIN BAR */}
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 leading-tight">
            <PenTool className="w-6 h-6 text-amber-600" />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-amber-700">
                Assignly
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 -mt-1">
                Craft smarter assignments
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">

            {/* Credits */}
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                <Star className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">
                  Credits:{" "}
                  <span className="text-amber-700 font-bold">{credits}</span>
                </span>
              </div>
            )}

            {/* Dashboard */}
            {user && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
                  isActive("/dashboard")
                    ? "bg-amber-100 text-amber-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            {/* CREATE BUTTON */}
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 lg:px-5 py-2 rounded-xl text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>

            {/* LOGIN/LOGOUT */}
            {!user ? (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-amber-200 text-amber-700 hover:bg-amber-50 transition"
              >
                <LogIn className="w-4 h-4 text-amber-700" />
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>

          {/* MOBILE - Dashboard Icon (if logged in) and Login/Logout */}
          <div className="md:hidden flex items-center gap-3">
            {/* Dashboard Icon - Only when logged in */}
            {user && (
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-gray-700" />
              </Link>
            )}

            {/* Login/Logout Button */}
            {!user ? (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-amber-200 text-amber-700 hover:bg-amber-50 transition"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
