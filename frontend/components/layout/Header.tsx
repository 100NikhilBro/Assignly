

// // // // "use client";

// // // // import Link from "next/link";
// // // // import { useRouter, usePathname } from "next/navigation";
// // // // import { useUserStore } from "@/app/store/userStore";
// // // // import { useState, useEffect } from "react";
// // // // import toast from "react-hot-toast";
// // // // import { FileText, LogOut, LogIn, LayoutDashboard, Plus, Star } from "lucide-react";

// // // // export default function Header() {
// // // //   const router = useRouter();
// // // //   const pathname = usePathname();
// // // //   const { user, logout } = useUserStore();
// // // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// // // //   const [credits, setCredits] = useState(user?.credits || 0);

// // // //   useEffect(() => {
// // // //     setCredits(user?.credits || 0);
// // // //   }, [user?.credits]);

// // // //   const handleCreate = () => {
// // // //     if (!user) {
// // // //       toast.error("Please login to create assignments");
// // // //       router.push("/login");
// // // //       return;
// // // //     }

// // // //     if (user.credits <= 0) {
// // // //       toast.error("No credits left. Please upgrade to continue.");
// // // //       return;
// // // //     }

// // // //     router.push("/create-assignment");
// // // //   };

// // // //   const handleLogout = () => {
// // // //     logout();
// // // //     toast.success("Logged out successfully");
// // // //     router.push("/");
// // // //   };

// // // //   const isActive = (path: string) => pathname === path;

// // // //   return (
// // // //     <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
// // // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // // //         <div className="flex justify-between items-center h-16">
          
// // // //           {/* Logo */}
// // // //           <Link 
// // // //             href="/" 
// // // //             className="flex flex-col items-start hover:opacity-80 transition"
// // // //           >
// // // //             <span className="text-xl font-bold text-indigo-600">
// // // //               PaperMind
// // // //             </span>
// // // //             <span className="text-[10px] text-gray-400 -mt-1">
// // // //               Forge Better Assignments
// // // //             </span>
// // // //           </Link>

// // // //           {/* Desktop Navigation */}
// // // //           <div className="hidden md:flex items-center gap-4">
// // // //             {/* Credits Display */}
// // // //             {user && (
// // // //               <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
// // // //                 <Star className="w-4 h-4 text-amber-500" />
// // // //                 <span className="text-sm font-medium text-gray-700">
// // // //                   Credits: <span className="text-amber-600 font-bold">{credits}</span>
// // // //                 </span>
// // // //               </div>
// // // //             )}

// // // //             {/* Dashboard Link */}
// // // //             {user && (
// // // //               <Link
// // // //                 href="/dashboard"
// // // //                 className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
// // // //                   isActive("/dashboard") 
// // // //                     ? "text-indigo-600 bg-indigo-50" 
// // // //                     : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
// // // //                 }`}
// // // //               >
// // // //                 <LayoutDashboard className="w-4 h-4" />
// // // //                 Dashboard
// // // //               </Link>
// // // //             )}

// // // //             {/* Create Button */}
// // // //             <button
// // // //               onClick={handleCreate}
// // // //               className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
// // // //             >
// // // //               <Plus className="w-4 h-4" />
// // // //               Create Assignment
// // // //             </button>

// // // //             {/* Auth Buttons */}
// // // //             {!user ? (
// // // //               <button
// // // //                 onClick={() => router.push("/login")}
// // // //                 className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
// // // //               >
// // // //                 <LogIn className="w-4 h-4" />
// // // //                 Login
// // // //               </button>
// // // //             ) : (
// // // //               <button
// // // //                 onClick={handleLogout}
// // // //                 className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition"
// // // //               >
// // // //                 <LogOut className="w-4 h-4" />
// // // //                 Logout
// // // //               </button>
// // // //             )}
// // // //           </div>

// // // //           {/* Mobile Menu Button */}
// // // //           <button
// // // //             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // // //             className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
// // // //           >
// // // //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //               {mobileMenuOpen ? (
// // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// // // //               ) : (
// // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// // // //               )}
// // // //             </svg>
// // // //           </button>
// // // //         </div>

// // // //         {/* Mobile Menu */}
// // // //         {mobileMenuOpen && (
// // // //           <div className="md:hidden py-4 border-t border-gray-200 space-y-3 bg-white">
// // // //             {user && (
// // // //               <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg border border-amber-200">
// // // //                 <span className="text-sm text-gray-700">⭐ Credits</span>
// // // //                 <span className="text-amber-600 font-bold">{credits}</span>
// // // //               </div>
// // // //             )}
            
// // // //             <button
// // // //               onClick={() => {
// // // //                 handleCreate();
// // // //                 setMobileMenuOpen(false);
// // // //               }}
// // // //               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
// // // //             >
// // // //               <Plus className="w-4 h-4" />
// // // //               Create Assignment
// // // //             </button>
            
// // // //             {user && (
// // // //               <Link
// // // //                 href="/dashboard"
// // // //                 onClick={() => setMobileMenuOpen(false)}
// // // //                 className="block w-full text-center border border-gray-300 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
// // // //               >
// // // //                 Dashboard
// // // //               </Link>
// // // //             )}
            
// // // //             {!user ? (
// // // //               <button
// // // //                 onClick={() => {
// // // //                   router.push("/login");
// // // //                   setMobileMenuOpen(false);
// // // //                 }}
// // // //                 className="w-full border border-gray-300 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
// // // //               >
// // // //                 Login
// // // //               </button>
// // // //             ) : (
// // // //               <button
// // // //                 onClick={() => {
// // // //                   handleLogout();
// // // //                   setMobileMenuOpen(false);
// // // //                 }}
// // // //                 className="w-full border border-gray-300 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition"
// // // //               >
// // // //                 Logout
// // // //               </button>
// // // //             )}
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </header>
// // // //   );
// // // // }


// // // "use client";

// // // import Link from "next/link";
// // // import { useRouter, usePathname } from "next/navigation";
// // // import { useUserStore } from "@/app/store/userStore";
// // // import { useState, useEffect } from "react";
// // // import toast from "react-hot-toast";
// // // import {
// // //   LogOut,
// // //   LogIn,
// // //   LayoutDashboard,
// // //   Plus,
// // //   Star,
// // //   Menu,
// // //   X,
// // // } from "lucide-react";

// // // export default function Header() {
// // //   const router = useRouter();
// // //   const pathname = usePathname();
// // //   const { user, logout } = useUserStore();

// // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// // //   const [credits, setCredits] = useState(user?.credits || 0);

// // //   useEffect(() => {
// // //     setCredits(user?.credits || 0);
// // //   }, [user?.credits]);

// // //   const handleCreate = () => {
// // //     if (!user) {
// // //       toast.error("Login required");
// // //       router.push("/login");
// // //       return;
// // //     }

// // //     if (user.credits <= 0) {
// // //       toast.error("No credits left");
// // //       return;
// // //     }

// // //     router.push("/create-assignment");
// // //   };

// // //   const handleLogout = () => {
// // //     logout();
// // //     toast.success("Logged out");
// // //     router.push("/");
// // //   };

// // //   const isActive = (path: string) => pathname === path;

// // //   return (
// // //     <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-amber-100 shadow-sm">
// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// // //         {/* MAIN BAR */}
// // //         <div className="flex justify-between items-center h-16">

// // //           {/* LOGO */}
// // //           <Link href="/" className="flex flex-col leading-tight">
// // //             <span className="text-lg sm:text-xl font-bold text-amber-700">
// // //               Assignly
// // //             </span>
// // //             <span className="text-[9px] sm:text-[10px] text-gray-400 -mt-1">
// // //               Craft smarter assignments ✍️
// // //             </span>
// // //           </Link>

// // //           {/* DESKTOP NAV */}
// // //           <div className="hidden md:flex items-center gap-3 lg:gap-4">

// // //             {/* Credits */}
// // //             {user && (
// // //               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
// // //                 <Star className="w-4 h-4 text-amber-600" />
// // //                 <span className="text-sm font-medium text-gray-700">
// // //                   Credits:{" "}
// // //                   <span className="text-amber-700 font-bold">{credits}</span>
// // //                 </span>
// // //               </div>
// // //             )}

// // //             {/* Dashboard */}
// // //             {user && (
// // //               <Link
// // //                 href="/dashboard"
// // //                 className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
// // //                   isActive("/dashboard")
// // //                     ? "bg-amber-100 text-amber-700"
// // //                     : "text-gray-600 hover:bg-gray-100"
// // //                 }`}
// // //               >
// // //                 <LayoutDashboard className="w-4 h-4" />
// // //                 Dashboard
// // //               </Link>
// // //             )}

// // //             {/* CREATE BUTTON */}
// // //             <button
// // //               onClick={handleCreate}
// // //               className="flex items-center gap-2 px-4 lg:px-5 py-2 rounded-xl text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 shadow-md hover:shadow-lg transition-all"
// // //             >
// // //               <Plus className="w-4 h-4" />
// // //               Create
// // //             </button>

// // //             {/* LOGIN */}
// // //             {!user ? (
// // //               <button
// // //                 onClick={() => router.push("/login")}
// // //                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-amber-200 text-amber-700 hover:bg-amber-50 transition"
// // //               >
// // //                 <LogIn className="w-4 h-4 text-amber-700" />
// // //                 Login
// // //               </button>
// // //             ) : (
// // //               <button
// // //                 onClick={handleLogout}
// // //                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
// // //               >
// // //                 <LogOut className="w-4 h-4" />
// // //                 Logout
// // //               </button>
// // //             )}
// // //           </div>

// // //           {/* MOBILE BUTTON */}
// // //           <button
// // //             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // //             className="md:hidden p-2 rounded-lg hover:bg-gray-100"
// // //           >
// // //             {mobileMenuOpen ? (
// // //               <X className="w-6 h-6 text-gray-700" />
// // //             ) : (
// // //               <Menu className="w-6 h-6 text-gray-700" />
// // //             )}
// // //           </button>
// // //         </div>

// // //         {/* MOBILE MENU */}
// // //         {mobileMenuOpen && (
// // //           <div className="md:hidden pb-4 space-y-3 animate-in slide-in-from-top-2">

// // //             {/* Credits */}
// // //             {user && (
// // //               <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
// // //                 <span className="flex items-center gap-2 text-sm text-gray-700">
// // //                   <Star className="w-4 h-4 text-amber-600" />
// // //                   Credits
// // //                 </span>
// // //                 <span className="font-bold text-amber-700">{credits}</span>
// // //               </div>
// // //             )}

// // //             {/* Create */}
// // //             <button
// // //               onClick={() => {
// // //                 handleCreate();
// // //                 setMobileMenuOpen(false);
// // //               }}
// // //               className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-xl font-medium"
// // //             >
// // //               <Plus className="w-4 h-4" />
// // //               Create Assignment
// // //             </button>

// // //             {/* Dashboard */}
// // //             {user && (
// // //               <Link
// // //                 href="/dashboard"
// // //                 onClick={() => setMobileMenuOpen(false)}
// // //                 className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:bg-gray-50"
// // //               >
// // //                 <LayoutDashboard className="w-4 h-4" />
// // //                 Dashboard
// // //               </Link>
// // //             )}

// // //             {/* Login */}
// // //             {!user ? (
// // //               <button
// // //                 onClick={() => {
// // //                   router.push("/login");
// // //                   setMobileMenuOpen(false);
// // //                 }}
// // //                 className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50"
// // //               >
// // //                 <LogIn className="w-4 h-4 text-amber-700" />
// // //                 Login
// // //               </button>
// // //             ) : (
// // //               <button
// // //                 onClick={() => {
// // //                   handleLogout();
// // //                   setMobileMenuOpen(false);
// // //                 }}
// // //                 className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-600"
// // //               >
// // //                 <LogOut className="w-4 h-4" />
// // //                 Logout
// // //               </button>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </header>
// // //   );
// // // }



// // "use client";

// // import Link from "next/link";
// // import { useRouter, usePathname } from "next/navigation";
// // import { useUserStore } from "@/app/store/userStore";
// // import { useState, useEffect } from "react";
// // import toast from "react-hot-toast";
// // import {
// //   LogOut,
// //   LogIn,
// //   LayoutDashboard,
// //   Plus,
// //   Star,
// //   Menu,
// //   X,
// //   Github,
// // } from "lucide-react";

// // export default function Header() {
// //   const router = useRouter();
// //   const pathname = usePathname();
// //   const { user, logout } = useUserStore();

// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// //   const [credits, setCredits] = useState(user?.credits || 0);

// //   useEffect(() => {
// //     setCredits(user?.credits || 0);
// //   }, [user?.credits]);

// //   const handleCreate = () => {
// //     if (!user) {
// //       toast.error("Login required");
// //       router.push("/login");
// //       return;
// //     }

// //     if (user.credits <= 0) {
// //       toast.error("No credits left");
// //       return;
// //     }

// //     router.push("/create-assignment");
// //   };

// //   const handleLogout = () => {
// //     logout();
// //     toast.success("Logged out");
// //     router.push("/");
// //   };

// //   const isActive = (path: string) => pathname === path;

// //   return (
// //     <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-amber-100 shadow-sm">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// //         {/* MAIN BAR */}
// //         <div className="flex justify-between items-center h-16">

// //           {/* LOGO */}
// //           <Link href="/" className="flex flex-col leading-tight">
// //             <span className="text-lg sm:text-xl font-bold text-amber-700">
// //               Assignly
// //             </span>
// //             <span className="text-[9px] sm:text-[10px] text-gray-400 -mt-1">
// //               Craft smarter assignments ✍️
// //             </span>
// //           </Link>

// //           {/* DESKTOP NAV */}
// //           <div className="hidden md:flex items-center gap-3 lg:gap-4">

// //             {/* Credits */}
// //             {user && (
// //               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
// //                 <Star className="w-4 h-4 text-amber-600" />
// //                 <span className="text-sm font-medium text-gray-700">
// //                   Credits:{" "}
// //                   <span className="text-amber-700 font-bold">{credits}</span>
// //                 </span>
// //               </div>
// //             )}

// //             {/* Dashboard */}
// //             {user && (
// //               <Link
// //                 href="/dashboard"
// //                 className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
// //                   isActive("/dashboard")
// //                     ? "bg-amber-100 text-amber-700"
// //                     : "text-gray-600 hover:bg-gray-100"
// //                 }`}
// //               >
// //                 <LayoutDashboard className="w-4 h-4" />
// //                 Dashboard
// //               </Link>
// //             )}

// //             {/* CREATE BUTTON */}
// //             <button
// //               onClick={handleCreate}
// //               className="flex items-center gap-2 px-4 lg:px-5 py-2 rounded-xl text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 shadow-md hover:shadow-lg transition-all"
// //             >
// //               <Plus className="w-4 h-4" />
// //               Create
// //             </button>

// //             {/* LOGIN/LOGOUT */}
// //             {!user ? (
// //               <button
// //                 onClick={() => router.push("/login")}
// //                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-amber-200 text-amber-700 hover:bg-amber-50 transition"
// //               >
// //                 <LogIn className="w-4 h-4 text-amber-700" />
// //                 Login
// //               </button>
// //             ) : (
// //               <button
// //                 onClick={handleLogout}
// //                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
// //               >
// //                 <LogOut className="w-4 h-4" />
// //                 Logout
// //               </button>
// //             )}
// //           </div>

// //           {/* MOBILE - Only GitHub and Login/Logout */}
// //           <div className="md:hidden flex items-center gap-3">
// //             {/* GitHub Icon */}
// //             <a
// //               href="https://github.com"
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
// //             >
// //               <Github className="w-5 h-5 text-gray-700" />
// //             </a>

// //             {/* Login/Logout Icon */}
// //             {!user ? (
// //               <button
// //                 onClick={() => router.push("/login")}
// //                 className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
// //               >
// //                 <LogIn className="w-5 h-5 text-gray-700" />
// //               </button>
// //             ) : (
// //               <button
// //                 onClick={handleLogout}
// //                 className="p-2 rounded-lg hover:bg-red-50 transition-colors"
// //               >
// //                 <LogOut className="w-5 h-5 text-gray-700 hover:text-red-600" />
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }



// "use client";

// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import { useUserStore } from "@/app/store/userStore";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import {
//   LogOut,
//   LogIn,
//   LayoutDashboard,
//   Plus,
//   Star,
//   Github,
// } from "lucide-react";

// export default function Header() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { user, logout } = useUserStore();

//   const [credits, setCredits] = useState(user?.credits || 0);

//   useEffect(() => {
//     setCredits(user?.credits || 0);
//   }, [user?.credits]);

//   const handleCreate = () => {
//     if (!user) {
//       toast.error("Login required");
//       router.push("/login");
//       return;
//     }

//     if (user.credits <= 0) {
//       toast.error("No credits left");
//       return;
//     }

//     router.push("/create-assignment");
//   };

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out");
//     router.push("/");
//   };

//   const isActive = (path: string) => pathname === path;

//   return (
//     <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-amber-100 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* MAIN BAR */}
//         <div className="flex justify-between items-center h-16">

//           {/* LOGO */}
//           <Link href="/" className="flex flex-col leading-tight">
//             <span className="text-lg sm:text-xl font-bold text-amber-700">
//               Assignly
//             </span>
//             <span className="text-[9px] sm:text-[10px] text-gray-400 -mt-1">
//               Craft smarter assignments ✍️
//             </span>
//           </Link>

//           {/* DESKTOP NAV */}
//           <div className="hidden md:flex items-center gap-3 lg:gap-4">

//             {/* Credits */}
//             {user && (
//               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
//                 <Star className="w-4 h-4 text-amber-600" />
//                 <span className="text-sm font-medium text-gray-700">
//                   Credits:{" "}
//                   <span className="text-amber-700 font-bold">{credits}</span>
//                 </span>
//               </div>
//             )}

//             {/* Dashboard */}
//             {user && (
//               <Link
//                 href="/dashboard"
//                 className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
//                   isActive("/dashboard")
//                     ? "bg-amber-100 text-amber-700"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <LayoutDashboard className="w-4 h-4" />
//                 Dashboard
//               </Link>
//             )}

//             {/* CREATE BUTTON */}
//             <button
//               onClick={handleCreate}
//               className="flex items-center gap-2 px-4 lg:px-5 py-2 rounded-xl text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 shadow-md hover:shadow-lg transition-all"
//             >
//               <Plus className="w-4 h-4" />
//               Create
//             </button>

//             {/* LOGIN/LOGOUT */}
//             {!user ? (
//               <button
//                 onClick={() => router.push("/login")}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-amber-200 text-amber-700 hover:bg-amber-50 transition"
//               >
//                 <LogIn className="w-4 h-4 text-amber-700" />
//                 Login
//               </button>
//             ) : (
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
//               >
//                 <LogOut className="w-4 h-4" />
//                 Logout
//               </button>
//             )}
//           </div>

//           {/* MOBILE - Login/Logout text with icon */}
//           <div className="md:hidden">
//             {!user ? (
//               <button
//                 onClick={() => router.push("/login")}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-amber-200 text-amber-700 hover:bg-amber-50 transition"
//               >
//                 <LogIn className="w-4 h-4" />
//                 Login
//               </button>
//             ) : (
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
//               >
//                 <LogOut className="w-4 h-4" />
//                 Logout
//               </button>
//             )}
//           </div>
//         </div>
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
