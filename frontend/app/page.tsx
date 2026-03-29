"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "./store/userStore";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
// import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  const handleStart = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      router.push("/create-assignment");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <HeroSection onStart={handleStart} />
      {/* <StatsSection /> */}
      <HowItWorks />
      <FeaturesSection />
      <CTASection onStart={handleStart} />
      <Footer />
    </div>
  );
}
