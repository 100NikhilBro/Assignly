// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import { useAuth } from "../hooks/useAuth";
// import Header from "@/components/layout/Header";
// import { Sparkles, Star, ChevronLeft } from "lucide-react";

// // Helper: Get or create guest session ID
// const getOrCreateSessionId = (): string | undefined => {
//   if (typeof window === 'undefined') return undefined;
//   let sessionId = localStorage.getItem("guest_session_id");
//   if (!sessionId) {
//     sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     localStorage.setItem("guest_session_id", sessionId);
//   }
//   return sessionId;
// };

// export default function LoginPage() {
//   const router = useRouter();
//   const { googleLogin, isLoading, isAuthenticated } = useAuth();
//   const [error, setError] = useState("");

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push("/dashboard");
//     }
//   }, [isAuthenticated, router]);

//   const handleSuccess = async (credentialResponse: any) => {
//     try {
//       setError("");
      
//       const decoded: any = jwtDecode(credentialResponse.credential);
//       const sessionId = getOrCreateSessionId();

//       const result = await googleLogin(
//         credentialResponse.credential,
//         {
//           email: decoded.email,
//           name: decoded.name,
//           googleId: decoded.sub,
//         },
//         sessionId
//       );

//       if (result.success) {
//         localStorage.removeItem("guest_session_id");
//         localStorage.removeItem("guestCredits");
//         router.push("/dashboard");
//       } else {
//         setError(result.error || "Login failed");
//       }
//     } catch (err: any) {
//       setError(err?.message || "Google login failed");
//     }
//   };

//   const handleGuestLogin = () => {
//     getOrCreateSessionId();
//     router.push("/create-assignment");
//   };

//   // Don't render if already authenticated (prevents flash)
//   if (isAuthenticated) {
//     return null;
//   }

//   return (
//     <div className="relative min-h-screen bg-[#fdfaf5] overflow-x-hidden">
//       {/* Background Grid - Responsive pattern */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]" />

//       {/* Soft Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />

//       <Header />

//       <div className="relative flex justify-center items-center min-h-[80vh] px-3 sm:px-4 py-6 sm:py-8">
//         {/* Back Button - Mobile */}
//         <button
//           onClick={() => router.back()}
//           className="absolute top-4 left-4 sm:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 transition z-10"
//         >
//           <ChevronLeft className="w-5 h-5" />
//           <span className="text-sm">Back</span>
//         </button>

//         <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 md:p-8 rounded-2xl text-center w-full max-w-md mx-auto shadow-md border border-amber-100">
//           {/* Icon */}
//           <div className="flex justify-center mb-4 sm:mb-5">
//             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
//               <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
//             </div>
//           </div>

//           {/* Title */}
//           <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900">
//             Assignly
//           </h1>

//           <p className="text-gray-500 mb-5 sm:mb-6 text-xs sm:text-sm">
//             Smart Assignments, Simplified
//           </p>

//           {/* Error */}
//           {error && (
//             <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm">
//               {error}
//             </div>
//           )}

//           {/* Google Login - Responsive wrapper */}
//           <div className="flex justify-center mb-5 overflow-x-auto">
//             <div className="transform scale-90 sm:scale-100 origin-center">
//               <GoogleLogin
//                 onSuccess={handleSuccess}
//                 onError={() => setError("Google Login Failed")}
//                 theme="outline"
//                 size="large"
//                 shape="rectangular"
//                 text="continue_with"
//               />
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="relative my-5 sm:my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-amber-100"></div>
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-white px-2 sm:px-3 text-gray-400 text-[10px] sm:text-xs">or</span>
//             </div>
//           </div>

//           {/* Guest Button */}
//           <button
//             onClick={handleGuestLogin}
//             disabled={isLoading}
//             className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 py-2.5 sm:py-3 rounded-lg font-medium transition disabled:opacity-50 border border-amber-200 flex items-center justify-center gap-2 text-sm sm:text-base"
//           >
//             <Star className="w-4 h-4 text-amber-600" />
//             <span>Continue as Guest (3 free credits)</span>
//           </button>

//           {/* Footer */}
//           <p className="text-[10px] sm:text-xs text-gray-400 mt-5 sm:mt-6 px-2">
//             By continuing, you agree to our Terms and Privacy Policy
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../hooks/useAuth";
import Header from "@/components/layout/Header";
import { Sparkles, ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { googleLogin, isLoading, isAuthenticated } = useAuth();
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      setError("");

      const decoded: any = jwtDecode(credentialResponse.credential);

      const result = await googleLogin(
        credentialResponse.credential,
        {
          email: decoded.email,
          name: decoded.name,
          googleId: decoded.sub,
        }
      );

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err: any) {
      setError(err?.message || "Google login failed");
    }
  };

  // Prevent flash
  if (isAuthenticated) return null;

  return (
    <div className="relative min-h-screen bg-[#fdfaf5] overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3eee6_1px,transparent_1px),linear-gradient(to_bottom,#f3eee6_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-amber-50/40" />

      <Header />

      <div className="relative flex justify-center items-center min-h-[80vh] px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 sm:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-2xl text-center w-full max-w-md shadow-md border border-amber-100">
          
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-700" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">Assignly</h1>
          <p className="text-gray-500 mb-6 text-sm">
            Login to start creating smart assignments
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Google Login */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError("Google Login Failed")}
              theme="outline"
              size="large"
              shape="rectangular"
              text="continue_with"
            />
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
