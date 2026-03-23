

"use client";

import Link from "next/link";
import { Heart, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#fdfaf5] border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="flex flex-col items-start hover:opacity-80 transition"
            >
              <span className="text-xl font-bold text-amber-700">
                Assignly
              </span>
              <span className="text-xs text-gray-400 -mt-1">
                Smart Assignments, Simplified
              </span>
            </Link>

            <p className="text-gray-600 text-sm mt-3 leading-relaxed max-w-xs">
              AI-powered assignment generator designed for modern educators.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/create-assignment"
                  className="text-gray-600 hover:text-amber-700 transition"
                >
                  Create Assignment
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-amber-700 transition"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Connect
            </h4>
            <a
              href="https://github.com/100NikhilBro/vedaai-intelligent-assessment"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-amber-700 transition text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-amber-100 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-xs flex items-center justify-center gap-1">
            © {currentYear} Assignly. Made with{" "}
            <Heart className="w-3 h-3 text-amber-500" /> for educators.
          </p>
        </div>
      </div>
    </footer>
  );
}
