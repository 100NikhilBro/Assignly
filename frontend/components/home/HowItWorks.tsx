


"use client";

import { motion } from "framer-motion";
import { FileText, Brain, Download } from "lucide-react";

const steps = [
  {
    title: "Create Assignment",
    desc: "Fill details like subject, class, topics, and difficulty preferences",
    icon: FileText,
    color: "from-indigo-500 to-indigo-600"
  },
  {
    title: "AI Generates",
    desc: "Smart AI creates structured questions with balanced difficulty levels",
    icon: Brain,
    color: "from-amber-500 to-amber-600"
  },
  {
    title: "Download & Use",
    desc: "Export as PDF and use it directly in your classroom",
    icon: Download,
    color: "from-emerald-500 to-emerald-600"
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Three simple steps to create professional exam papers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm text-indigo-500 font-mono mb-2">
                  Step {i + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
