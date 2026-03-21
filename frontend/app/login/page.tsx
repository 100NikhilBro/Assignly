// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import { useAuth } from "../hooks/useAuth";
// import Header from "@/components/layout/Header";

// // Helper: Get or create guest session ID
// const getOrCreateSessionId = () => {
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
//   if (isAuthenticated) {
//     router.push("/dashboard");
//     return null;
//   }

//   const handleSuccess = async (credentialResponse: any) => {
//     try {
//       setError("");
//       const decoded: any = jwtDecode(credentialResponse.credential);
      
//       // ✅ Get guest session ID for migration
//       const sessionId = getOrCreateSessionId();

//       const result = await googleLogin(
//         credentialResponse.credential,
//         {
//           email: decoded.email,
//           name: decoded.name,
//           googleId: decoded.sub,
//         },
//         sessionId  // ✅ Pass session ID to backend
//       );

//       if (result.success) {
//         // ✅ Clear guest session after successful migration
//         localStorage.removeItem("guest_session_id");
//         localStorage.removeItem("guestCredits");
//         router.push("/dashboard");
//       } else {
//         setError(result.error || "Login failed");
//       }
//     } catch (err: any) {
//       console.error(err);
//       setError(err?.message || "Google login failed");
//     }
//   };

//   const handleGuestLogin = () => {
//     // Create guest session ID
//     getOrCreateSessionId();
//     router.push("/create-assignment");
//   };

//   return (
//     <div className="bg-black text-white min-h-screen">
//       <Header />

//       <div className="flex justify-center items-center min-h-[80vh] px-4">
//         <div className="bg-[#1a1a1a] p-8 rounded-xl text-center w-full max-w-md shadow-xl border border-gray-800">

//           <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
//             VedaAI
//           </h1>
          
//           <p className="text-gray-400 mb-6 text-sm">
//             AI-Powered Assignment Generator
//           </p>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded text-sm">
//               {error}
//             </div>
//           )}

//           {/* Google Login */}
//           <div className="flex justify-center mb-4">
//             <GoogleLogin
//               onSuccess={handleSuccess}
//               onError={() => setError("Google Login Failed")}
//               theme="outline"
//               size="large"
//               shape="rectangular"
//               text="continue_with"
//             />
//           </div>

//           {/* Divider */}
//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-700"></div>
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-[#1a1a1a] px-2 text-gray-500">or</span>
//             </div>
//           </div>

//           {/* Guest Button */}
//           <button
//             onClick={handleGuestLogin}
//             disabled={isLoading}
//             className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
//           >
//             Continue as Guest (3 free credits)
//           </button>

//           {/* Footer Note */}
//           <p className="text-xs text-gray-500 mt-6">
//             By continuing, you agree to our Terms and Privacy Policy
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../hooks/useAuth";
import Header from "@/components/layout/Header";
import { LogIn, Sparkles, Star } from "lucide-react";

// Helper: Get or create guest session ID
const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem("guest_session_id");
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("guest_session_id", sessionId);
  }
  return sessionId;
};

export default function LoginPage() {
  const router = useRouter();
  const { googleLogin, isLoading, isAuthenticated } = useAuth();
  const [error, setError] = useState("");

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  const handleSuccess = async (credentialResponse: any) => {
    try {
      setError("");
      const decoded: any = jwtDecode(credentialResponse.credential);
      
      const sessionId = getOrCreateSessionId();

      const result = await googleLogin(
        credentialResponse.credential,
        {
          email: decoded.email,
          name: decoded.name,
          googleId: decoded.sub,
        },
        sessionId
      );

      if (result.success) {
        localStorage.removeItem("guest_session_id");
        localStorage.removeItem("guestCredits");
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Google login failed");
    }
  };

  const handleGuestLogin = () => {
    getOrCreateSessionId();
    router.push("/create-assignment");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <div className="bg-white p-8 rounded-2xl text-center w-full max-w-md shadow-lg border border-gray-100">

          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            PaperMind
          </h1>
          
          <p className="text-gray-500 mb-6 text-sm">
            Forge Better Assignments
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Google Login */}
          <div className="flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError("Google Login Failed")}
              theme="outline"
              size="large"
              shape="rectangular"
              text="continue_with"
            />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">or</span>
            </div>
          </div>

          {/* Guest Button */}
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-lg font-medium transition disabled:opacity-50 border border-gray-200 flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4 text-amber-500" />
            Continue as Guest (3 free credits)
          </button>

          {/* Footer Note */}
          <p className="text-xs text-gray-400 mt-6">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}