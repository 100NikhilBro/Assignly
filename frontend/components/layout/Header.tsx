// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useUserStore } from "@/app/store/userStore";

// export default function Header() {
//   const router = useRouter();
//   const { user, logout } = useUserStore();

//   const handleCreate = () => {
//     if (!user) {
//       router.push("/login");
//       return;
//     }

//     if (user.credits <= 0) {
//       alert("No credits left 🚫");
//       return;
//     }

//     router.push("/create-assignment");
//   };

//   return (
//     <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">

//       {/* Logo */}
//       <Link href="/" className="text-xl font-bold text-orange-500">
//         VedaAI
//       </Link>

//       {/* Right Side */}
//       <div className="flex items-center gap-4">

//         {/* Credits */}
//         {user && (
//           <div className="text-sm text-gray-300">
//             Credits: <span className="text-orange-400">{user.credits}</span>
//           </div>
//         )}

//         {/* Create Button */}
//         <button
//           onClick={handleCreate}
//           className="bg-orange-500 px-4 py-2 rounded text-sm hover:opacity-90"
//         >
//           Create Assignment
//         </button>

//         {/* Auth */}
//         {!user ? (
//           <button
//             onClick={() => router.push("/login")}
//             className="border px-4 py-2 rounded text-sm"
//           >
//             Login
//           </button>
//         ) : (
//           <button
//             onClick={logout}
//             className="border px-4 py-2 rounded text-sm"
//           >
//             Logout
//           </button>
//         )}

//       </div>
//     </header>
//   );
// }


"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUserStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [credits, setCredits] = useState(user?.credits || 0);

  useEffect(() => {
    setCredits(user?.credits || 0);
  }, [user?.credits]);

  const handleCreate = () => {
    if (!user) {
      toast.error("Please login to create assignments");
      router.push("/login");
      return;
    }

    if (user.credits <= 0) {
      toast.error("No credits left. Please upgrade to continue.");
      return;
    }

    router.push("/create-assignment");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent hover:opacity-80 transition"
          >
            VedaAI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Credits Display */}
            {user && (
              <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full">
                <span className="text-yellow-500 text-sm">⭐</span>
                <span className="text-sm font-medium">
                  Credits: <span className="text-orange-400">{credits}</span>
                </span>
              </div>
            )}

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-lg"
            >
              + Create Assignment
            </button>

            {/* Dashboard Link */}
            {user && (
              <Link
                href="/dashboard"
                className={`text-sm transition ${
                  isActive("/dashboard") 
                    ? "text-orange-400" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
            )}

            {/* Auth Buttons */}
            {!user ? (
              <button
                onClick={() => router.push("/login")}
                className="border border-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="border border-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-red-500/10 hover:border-red-500 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 space-y-3">
            {user && (
              <div className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-lg">
                <span className="text-sm">⭐ Credits</span>
                <span className="text-orange-400 font-bold">{credits}</span>
              </div>
            )}
            
            <button
              onClick={() => {
                handleCreate();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-2 rounded-lg text-sm font-medium"
            >
              + Create Assignment
            </button>
            
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center border border-gray-600 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
              >
                Dashboard
              </Link>
            )}
            
            {!user ? (
              <button
                onClick={() => {
                  router.push("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full border border-gray-600 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full border border-gray-600 py-2 rounded-lg text-sm hover:bg-red-500/10 transition"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}