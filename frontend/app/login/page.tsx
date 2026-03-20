
"use client";

import Header from "@/components/layout/Header";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);

      // 🔥 send to backend
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          email: decoded.email,
          name: decoded.name,
          googleId: decoded.sub,
        }
      );

      const data = res.data;

      // 🧠 store user + token
      setUser(data.user);
      localStorage.setItem("token", data.token);

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="bg-[#0b0b0b] text-white min-h-screen">
      <Header />

      <div className="flex justify-center items-center h-[80vh]">
        <div className="bg-[#1a1a1a] p-10 rounded-xl text-center w-full max-w-md shadow-lg">

          <h1 className="text-2xl font-bold mb-3">
            Welcome to VedaAI
          </h1>

          <p className="text-gray-400 mb-6 text-sm">
            Continue with Google to create AI-powered assignments
          </p>

          {/* 🔥 GOOGLE LOGIN */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => alert("Google Login Failed")}
              theme="outline"
              size="large"
            />
          </div>

          {/* small note */}
          <p className="text-xs text-gray-500 mt-6">
            We only use your email to create your account and manage credits.
          </p>

        </div>
      </div>
    </div>
  );
}