"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const router = useRouter();
  const { user, token, setUser, logout, setLoading, isLoading } = useUserStore();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  // Check if token is expired
  const checkTokenValidity = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  // Fetch user profile from backend
  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
      return null;
    } catch (error) {
      console.error("Fetch profile error:", error);
      return null;
    }
  };

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      const storedToken = localStorage.getItem("token");
      
      if (!storedToken) {
        setLoading(false);
        setIsTokenValid(false);
        return;
      }

      // Validate token
      const isValid = checkTokenValidity(storedToken);
      
      if (!isValid) {
        logout();
        setLoading(false);
        setIsTokenValid(false);
        return;
      }

      // Fetch fresh user data
      const userData = await fetchUserProfile(storedToken);
      
      if (userData) {
        setUser(userData, storedToken);
        setIsTokenValid(true);
      } else {
        logout();
        setIsTokenValid(false);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

//   // Google Login
//   const googleLogin = async (credential: string, userData: { email: string; name: string; googleId: string }) => {
//     setLoading(true);
    
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setUser(data.user, data.token);
//         router.push("/dashboard");
//         return { success: true };
//       } else {
//         return { success: false, error: data.message };
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       return { success: false, error: "Login failed" };
//     } finally {
//       setLoading(false);
//     }
//   };


// Update googleLogin function to accept sessionId
const googleLogin = async (
  credential: string, 
  userData: { email: string; name: string; googleId: string },
  guestSessionId?: string  // ✅ Add this parameter
) => {
  setLoading(true);
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(guestSessionId && { "x-session-id": guestSessionId }),  // ✅ Send guest session
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.success) {
      setUser(data.user, data.token);
      return { success: true };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed" };
  } finally {
    setLoading(false);
  }
};

  // Logout
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && isTokenValid === true,
    isTokenValid,
    googleLogin,
    logout: handleLogout,
    fetchUserProfile,
  };
};