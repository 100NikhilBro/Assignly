
// "use client";

// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";

// export default function HeroSection() {
//   const router = useRouter();

//   const handleCreate = () => {
//     // ❗ for now → always redirect to login
//     router.push("/login");
//   };

//   return (
//     <section className="py-20 text-center">

//       <motion.h1
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl font-bold mb-4"
//       >
//         Create AI Powered Question Papers
//       </motion.h1>

//       <p className="text-gray-600 mb-6">
//         Generate structured exam papers instantly using AI
//       </p>

//       <motion.button
//         whileTap={{ scale: 0.95 }}
//         onClick={handleCreate}
//         className="bg-orange-500 text-white px-6 py-3 rounded-full"
//       >
//         Create Assignment
//       </motion.button>

//     </section>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserStore } from "@/app/store/userStore";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  const router = useRouter();
  const { user } = useUserStore();

  const handleStart = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/create-assignment");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Create AI-Powered
              <br />
              Assignments in Seconds
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Generate structured exam papers with intelligent questions, 
              difficulty levels, and complete answer keys — all powered by AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition shadow-lg"
              >
                Get Started Free →
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open("https://github.com", "_blank")}
                className="border border-gray-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
              >
                Watch Demo
              </motion.button>
            </div>
            
            <p className="mt-6 text-sm text-gray-500">
              🎁 Free credits for new users • No credit card required
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-500">500+</div>
              <div className="text-gray-400 text-sm mt-1">Assignments Generated</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-500">98%</div>
              <div className="text-gray-400 text-sm mt-1">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-500">10x</div>
              <div className="text-gray-400 text-sm mt-1">Faster Creation</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-500">24/7</div>
              <div className="text-gray-400 text-sm mt-1">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three simple steps to create professional exam papers
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "📝",
                title: "Create Assignment",
                description: "Enter subject, class, topic, and your preferences",
                color: "from-orange-500 to-red-500"
              },
              {
                step: "02",
                icon: "🤖",
                title: "AI Generates Paper",
                description: "Advanced AI creates structured questions with difficulty levels",
                color: "from-blue-500 to-purple-500"
              },
              {
                step: "03",
                icon: "📥",
                title: "Download & Use",
                description: "Export as PDF and use immediately in your classroom",
                color: "from-green-500 to-teal-500"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center hover:transform hover:scale-105 transition duration-300">
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.color} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition`} />
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-sm text-orange-500 font-mono mb-2">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose VedaAI?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built for educators who demand quality and efficiency
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Smart Difficulty Levels",
                description: "Questions automatically balanced across easy, medium, and hard levels",
                icon: "🎯"
              },
              {
                title: "Multiple Question Types",
                description: "Support for theory, short answer, long answer, and more",
                icon: "📚"
              },
              {
                title: "Real-time Generation",
                description: "Watch your paper being created with live status updates",
                icon: "⚡"
              },
              {
                title: "Export Ready",
                description: "Download as beautifully formatted PDF, ready for printing",
                icon: "📄"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-4 p-6 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-12 border border-orange-500/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your teaching?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of educators saving hours with AI-powered assignment generation
            </p>
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition shadow-lg"
            >
              Start Creating Now →
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Free credits included • No commitment
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}