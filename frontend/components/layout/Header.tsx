// "use client";

// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import { useUserStore } from "@/app/store/userStore";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// export default function Header() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { user, logout } = useUserStore();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [credits, setCredits] = useState(user?.credits || 0);

//   useEffect(() => {
//     setCredits(user?.credits || 0);
//   }, [user?.credits]);

//   const handleCreate = () => {
//     if (!user) {
//       toast.error("Please login to create assignments");
//       router.push("/login");
//       return;
//     }

//     if (user.credits <= 0) {
//       toast.error("No credits left. Please upgrade to continue.");
//       return;
//     }

//     router.push("/create-assignment");
//   };

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully");
//     router.push("/");
//   };

//   const isActive = (path: string) => pathname === path;

//   return (
//     <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
          
//           {/* Logo */}
//           <Link 
//             href="/" 
//             className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent hover:opacity-80 transition"
//           >
//             VedaAI
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-6">
//             {/* Credits Display */}
//             {user && (
//               <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full">
//                 <span className="text-yellow-500 text-sm">⭐</span>
//                 <span className="text-sm font-medium">
//                   Credits: <span className="text-orange-400">{credits}</span>
//                 </span>
//               </div>
//             )}

//             {/* Create Button */}
//             <button
//               onClick={handleCreate}
//               className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-lg"
//             >
//               + Create Assignment
//             </button>

//             {/* Dashboard Link */}
//             {user && (
//               <Link
//                 href="/dashboard"
//                 className={`text-sm transition ${
//                   isActive("/dashboard") 
//                     ? "text-orange-400" 
//                     : "text-gray-300 hover:text-white"
//                 }`}
//               >
//                 Dashboard
//               </Link>
//             )}

//             {/* Auth Buttons */}
//             {!user ? (
//               <button
//                 onClick={() => router.push("/login")}
//                 className="border border-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
//               >
//                 Login
//               </button>
//             ) : (
//               <button
//                 onClick={handleLogout}
//                 className="border border-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-red-500/10 hover:border-red-500 transition"
//               >
//                 Logout
//               </button>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               {mobileMenuOpen ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden py-4 border-t border-gray-800 space-y-3">
//             {user && (
//               <div className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-lg">
//                 <span className="text-sm">⭐ Credits</span>
//                 <span className="text-orange-400 font-bold">{credits}</span>
//               </div>
//             )}
            
//             <button
//               onClick={() => {
//                 handleCreate();
//                 setMobileMenuOpen(false);
//               }}
//               className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-2 rounded-lg text-sm font-medium"
//             >
//               + Create Assignment
//             </button>
            
//             {user && (
//               <Link
//                 href="/dashboard"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="block w-full text-center border border-gray-600 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
//               >
//                 Dashboard
//               </Link>
//             )}
            
//             {!user ? (
//               <button
//                 onClick={() => {
//                   router.push("/login");
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full border border-gray-600 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
//               >
//                 Login
//               </button>
//             ) : (
//               <button
//                 onClick={() => {
//                   handleLogout();
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full border border-gray-600 py-2 rounded-lg text-sm hover:bg-red-500/10 transition"
//               >
//                 Logout
//               </button>
//             )}
//           </div>
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
import { FileText, LogOut, LogIn, LayoutDashboard, Plus, Star } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex flex-col items-start hover:opacity-80 transition"
          >
            <span className="text-xl font-bold text-indigo-600">
              PaperMind
            </span>
            <span className="text-[10px] text-gray-400 -mt-1">
              Forge Better Assignments
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Credits Display */}
            {user && (
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">
                  Credits: <span className="text-amber-600 font-bold">{credits}</span>
                </span>
              </div>
            )}

            {/* Dashboard Link */}
            {user && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive("/dashboard") 
                    ? "text-indigo-600 bg-indigo-50" 
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Assignment
            </button>

            {/* Auth Buttons */}
            {!user ? (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
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
          <div className="md:hidden py-4 border-t border-gray-200 space-y-3 bg-white">
            {user && (
              <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg border border-amber-200">
                <span className="text-sm text-gray-700">⭐ Credits</span>
                <span className="text-amber-600 font-bold">{credits}</span>
              </div>
            )}
            
            <button
              onClick={() => {
                handleCreate();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Assignment
            </button>
            
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center border border-gray-300 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
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
                className="w-full border border-gray-300 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full border border-gray-300 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition"
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