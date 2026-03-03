"use client";
import { Globe, ShieldCheck, Palette } from 'lucide-react';
import { motion } from "framer-motion";

export default function Why() {
  const features = [
    {
      icon: <ShieldCheck className="text-red-900 on hover:text-red-600" />,
      title: "No Bloat",
      text: "Built out of frustration with bloated bookmark managers. Zero tracking, zero monetization, zero compromises.",
    },
    {
      icon: <Globe className="text-blue-800 " />,
      title: "Access Anywhere",
      text: "Cloud-synced with Firebase. Your resources follow you across devices. Always available, always in sync.",
    },
    {
      icon: <Palette className="text-gradient-to-r from-purple-400 to-pink-400" />,
      title: "Actually Beautiful",
      text: "Dark mode. Bento grid. Smooth animations. Because your tools should feel good to use.",
    },
  ];

  return (

    <section className="relative px-6 py-32 text-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4">
            Why{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              404Dashboard
            </span>
            ?
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            A dashboard designed for focus, not friction.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
              className="group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 backdrop-blur-sm 
                         hover:-translate-y-1 hover:border-purple-500/40 transition-all duration-500"
            >
              {/* shared highlight ring */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl rounded-2xl" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
