
"use client";

import { motion } from "framer-motion";
import { PlusCircle, Github, Star, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

export default function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#faf7f2] via-white to-[#fefaf4]">

      {/* Soft Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e8e2d8_1px,transparent_1px),linear-gradient(to_bottom,#e8e2d8_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-30" />

      {/* Soft Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full mb-6 border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-700 font-medium">
              AI-powered assessment builder
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            Create Better Assignments
            <br />
            <span className="bg-gradient-to-r from-amber-700 to-orange-500 bg-clip-text text-transparent">
              in Seconds
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate structured exam papers with balanced questions, 
            smart difficulty distribution, and ready-to-use formats — 
            all powered by AI.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            {/* Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
            >
              <PlusCircle className="w-5 h-5" />
              Start Creating
            </motion.button>

            {/* Secondary CTA */}
            <motion.a
              href="https://github.com/100NikhilBro/vedaai-intelligent-assessment"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-gray-300 bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2 justify-center"
            >
              <Github className="w-5 h-5" />
              View Code
            </motion.a>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Free credits for new users • No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
