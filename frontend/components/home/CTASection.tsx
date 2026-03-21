"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

interface CTASectionProps {
  onStart: () => void;
}

export default function CTASection({ onStart }: CTASectionProps) {
  return (
    <section className="py-20 bg-indigo-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform your teaching?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators saving hours with AI-powered assignment generation
          </p>
          <button
            onClick={onStart}
            className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition shadow-lg flex items-center gap-2 mx-auto"
          >
            Start Creating Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-sm text-indigo-200 flex items-center justify-center gap-1">
            <Star className="w-4 h-4" />
            Free credits included • No commitment
          </p>
        </motion.div>
      </div>
    </section>
  );
}