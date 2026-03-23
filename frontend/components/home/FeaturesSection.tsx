

"use client";

import { motion } from "framer-motion";
import { Target, BookOpen, Zap, FileText } from "lucide-react";

const features = [
  {
    title: "Smart Difficulty Levels",
    description:
      "Automatically balances questions across easy, medium, and hard levels.",
    icon: Target,
  },
  {
    title: "Multiple Question Types",
    description:
      "Supports short answers, long answers, and structured theory questions.",
    icon: BookOpen,
  },
  {
    title: "Real-time Generation",
    description:
      "Watch your assignment being generated with live progress updates.",
    icon: Zap,
  },
  {
    title: "Export Ready",
    description:
      "Download beautifully formatted PDFs ready for classroom use.",
    icon: FileText,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-[#fdfaf5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Assignly?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base md:text-lg">
            Built for educators who value clarity, speed, and quality
          </p>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white p-6 md:p-8 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">

                {/* ICON */}
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-amber-700" />
                </div>

                {/* TITLE */}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>

                {/* DESC */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
