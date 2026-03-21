// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useAuth } from "@/app/hooks/useAuth";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   redirectTo?: string;
// }

// export default function ProtectedRoute({ 
//   children, 
//   redirectTo = "/login" 
// }: ProtectedRouteProps) {
//   const router = useRouter();
//   const { isAuthenticated, isLoading, user } = useAuth();

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       router.push(redirectTo);
//     }
//   }, [isLoading, isAuthenticated, router, redirectTo]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
//           <p className="mt-4 text-gray-400">Verifying authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return null;
//   }

//   return <>{children}</>;
// }



"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-500">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}