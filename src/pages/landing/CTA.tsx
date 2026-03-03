"use client";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative px-6 py-32 bg-zinc-950 text-white overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 flex justify-center pointer-events-none opacity-20">
        <div className="w-[600px] h-[600px] bg-purple-500/30 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="inline-block mb-6 px-5 py-2 bg-green-500/10 border border-green-500/20 backdrop-blur-sm rounded-full text-sm text-green-400"
        >
          💚 Open Source
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-semibold tracking-tight mb-6"
        >
          Built in the Open
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-zinc-400 mb-8 leading-relaxed"
        >
          This isn’t a startup or a SaaS. It’s a focused tool, built for developers who wanted something faster, 
          cleaner, and truly theirs.
          It’s open for transparency.
          To keep it free, we rely on respectful, privacy-friendly ads- never bloated banners or tracking junk.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
          className="flex gap-6 justify-center flex-wrap text-sm mb-12"
        >
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-2xl">⭐</span>
            <span>MIT Licensed</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-2xl">🔓</span>
            <span>Self-Hostable</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-2xl">🤝</span>
            <span>Community Driven</span>
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-semibold mb-6"
        >
          Ready to Get Organized?
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          viewport={{ once: true }}
          className="text-lg text-zinc-400 mb-8"
        >
          Stop drowning in browser tabs. Start using 404Dashboard today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          viewport={{ once: true }}
        >
          
          <a href="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg transition-all hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] hover:-translate-y-0.5"
          >
            Launch Dashboard <ChevronRight className="w-5 h-5" />
          </a>

          <p className="mt-6 text-sm text-zinc-500">
            Free forever. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}