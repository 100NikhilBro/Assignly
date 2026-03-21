"use client";

import { motion } from "framer-motion";
import { Target, BookOpen, Zap, FileText } from "lucide-react";

const features = [
  {
    title: "Smart Difficulty Levels",
    description: "Questions automatically balanced across easy, medium, and hard levels",
    icon: Target
  },
  {
    title: "Multiple Question Types",
    description: "Support for theory, short answer, long answer, and more",
    icon: BookOpen
  },
  {
    title: "Real-time Generation",
    description: "Watch your paper being created with live status updates",
    icon: Zap
  },
  {
    title: "Export Ready",
    description: "Download as beautifully formatted PDF, ready for printing",
    icon: FileText
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose PaperMind?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built for educators who demand quality and efficiency
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}