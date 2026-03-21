"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Create Assignment",
    desc: "Fill details like subject, class, topics, and difficulty preferences",
    icon: "📝",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "AI Generates",
    desc: "Smart AI creates structured questions with balanced difficulty levels",
    icon: "🤖",
    color: "from-blue-500 to-purple-500",
  },
  {
    title: "Download & Use",
    desc: "Export as PDF and use it directly in your classroom",
    icon: "📥",
    color: "from-green-500 to-teal-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
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
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${step.color} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition`} />
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="text-sm text-orange-500 font-mono mb-2">
                  Step {i + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-8 text-gray-300">→</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}