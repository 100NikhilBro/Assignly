// "use client";

// import { motion } from "framer-motion";
// import { ArrowRight, Star } from "lucide-react";

// interface CTASectionProps {
//   onStart: () => void;
// }

// export default function CTASection({ onStart }: CTASectionProps) {
//   return (
//     <section className="py-20 bg-indigo-600">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//             Ready to transform your teaching?
//           </h2>
//           <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
//             Join thousands of educators saving hours with AI-powered assignment generation
//           </p>
//           <button
//             onClick={onStart}
//             className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition shadow-lg flex items-center gap-2 mx-auto"
//           >
//             Start Creating Now
//             <ArrowRight className="w-5 h-5" />
//           </button>
//           <p className="mt-4 text-sm text-indigo-200 flex items-center justify-center gap-1">
//             <Star className="w-4 h-4" />
//             Free credits included • No commitment
//           </p>
//         </motion.div>
//       </div>
//     </section>
//   );
// }



"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

interface CTASectionProps {
  onStart: () => void;
}

export default function CTASection({ onStart }: CTASectionProps) {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#3b2f2f] via-[#5a4634] to-[#2c2218] overflow-hidden">

      {/* Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Start Creating Better Assignments
            <br />
            <span className="text-amber-300">
              in Seconds
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-amber-100 mb-8 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Save hours of manual work and generate structured, 
            ready-to-use assignments instantly with AI.
          </p>

          {/* CTA BUTTON */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStart}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition flex items-center gap-2 mx-auto"
          >
            Start Creating
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Trust line */}
          <p className="mt-5 text-sm text-amber-200 flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-amber-300" />
            Free credits included • No commitment
          </p>

        </motion.div>
      </div>
    </section>
  );
}
