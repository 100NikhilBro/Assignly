// "use client";

// import Link from "next/link";

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-gray-900 border-t border-gray-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//           {/* Brand */}
//           <div className="col-span-2 md:col-span-1">
//             <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-3">
//               VedaAI
//             </h3>
//             <p className="text-gray-400 text-sm">
//               AI-powered assignment generator for modern educators
//             </p>
//           </div>

//           {/* Product */}
//           <div>
//             <h4 className="font-semibold text-white mb-3">Product</h4>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <Link href="/create-assignment" className="text-gray-400 hover:text-orange-400 transition">
//                   Create Assignment
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition">
//                   Dashboard
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/pricing" className="text-gray-400 hover:text-orange-400 transition">
//                   Pricing
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h4 className="font-semibold text-white mb-3">Support</h4>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-orange-400 transition">
//                   Help Center
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-orange-400 transition">
//                   Contact Us
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-orange-400 transition">
//                   API Docs
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Legal */}
//           <div>
//             <h4 className="font-semibold text-white mb-3">Legal</h4>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-orange-400 transition">
//                   Privacy Policy
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-orange-400 transition">
//                   Terms of Service
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="text-gray-400 hover:text-orange-400 transition">
//                   Cookie Policy
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-gray-800 mt-8 pt-8 text-center">
//           <p className="text-gray-500 text-sm">
//             © {currentYear} VedaAI. Built with ❤️ for educators worldwide.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }


"use client";

import Link from "next/link";
import { FileText, Heart, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex flex-col items-start hover:opacity-80 transition">
              <span className="text-lg font-bold text-indigo-600">
                PaperMind
              </span>
              <span className="text-[10px] text-gray-400 -mt-0.5">
                Forge Better Assignments
              </span>
            </Link>
            <p className="text-gray-500 text-xs mt-2">
              AI-powered assignment generator
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/create-assignment" className="text-gray-500 hover:text-indigo-600 transition text-sm">
                  Create Assignment
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-500 hover:text-indigo-600 transition text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Connect</h4>
            <a
              href="https://github.com/100NikhilBro/vedaai-intelligent-assessment"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
            © {currentYear} PaperMind. Made with <Heart className="w-3 h-3 text-red-500" /> for educators.
          </p>
        </div>
      </div>
    </footer>
  );
}