

"use client";

import { motion } from "framer-motion";
import { PlusCircle, Github, Star, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

export default function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Cross/Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/80 to-amber-50/50" />
      
      {/* Animated Dots */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-300 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-amber-300 rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-1/4 right-1/2 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse delay-200" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-indigo-100">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-indigo-600 font-medium">AI-Powered Assessment Tool</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            Create AI-Powered
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-amber-500 bg-clip-text text-transparent">
              Assignments in Seconds
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Generate structured exam papers with intelligent questions, 
            difficulty levels, and complete answer keys — all powered by AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg flex items-center gap-2 justify-center"
            >
              <PlusCircle className="w-5 h-5" />
              Get Started Free
            </motion.button>
            
            <motion.a
              href="https://github.com/100NikhilBro/vedaai-intelligent-assessment"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2 justify-center"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </motion.a>
          </div>
          
          <p className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-1">
            <Star className="w-4 h-4 text-amber-500" />
            Free credits for new users • No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
