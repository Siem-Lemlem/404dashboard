"use client";
import { Github } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "../../hooks/Logo";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50 shadow-[0_0_20px_-10px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <a
            href="#features"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Features
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <a
            href="/dashboard"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 transition-all"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
