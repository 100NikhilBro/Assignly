
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HeroSection() {
  const router = useRouter();

  const handleCreate = () => {
    // ❗ for now → always redirect to login
    router.push("/login");
  };

  return (
    <section className="py-20 text-center">

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-4"
      >
        Create AI Powered Question Papers
      </motion.h1>

      <p className="text-gray-600 mb-6">
        Generate structured exam papers instantly using AI
      </p>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleCreate}
        className="bg-orange-500 text-white px-6 py-3 rounded-full"
      >
        Create Assignment
      </motion.button>

    </section>
  );
}