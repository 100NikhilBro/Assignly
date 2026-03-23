

"use client";

import { motion } from "framer-motion";
import { FileText, Brain, Download } from "lucide-react";

const steps = [
  {
    title: "Create Assignment",
    desc: "Enter subject, class, and topics. Choose difficulty and structure.",
    icon: FileText,
  },
  {
    title: "AI Generates",
    desc: "Our system builds balanced questions with proper structure.",
    icon: Brain,
  },
  {
    title: "Download & Use",
    desc: "Export clean PDF and use directly in your classroom.",
    icon: Download,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-[#faf7f2]">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Just three simple steps to create professional assignments
          </p>
        </motion.div>

        {/* STEPS */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">

                {/* ICON */}
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-amber-700" />
                </div>

                {/* STEP NUMBER */}
                <div className="text-xs font-medium text-amber-600 mb-2 tracking-wide">
                  STEP {i + 1}
                </div>

                {/* TITLE */}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>

                {/* DESC */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
