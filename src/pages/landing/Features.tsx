"use client";
import { motion } from "framer-motion";
import {
  Zap,
  Search,
  Tag,
  BarChart3,
  Download,
  Target,
  Pin,
  FolderOpen,
} from "lucide-react";

export default function Features() {
  const features = [
    { icon: <Pin className="w-6 h-6 text-purple-400" />, title: "Pin Important Resources", desc: "Keep your most-used links front and center with smart pinning." },
    { icon: <FolderOpen className="w-6 h-6 text-purple-400" />, title: "Collections", desc: "Group related resources and open entire collections with one click." },
    { icon: <Search className="w-6 h-6 text-purple-400" />, title: "Instant Search", desc: "Find anything with lightning-fast search. Ctrl+K to get started." },
    { icon: <Tag className="w-6 h-6 text-purple-400" />, title: "Smart Tags", desc: "Organize with tags and categories. Filter exactly what you need." },
    { icon: <BarChart3 className="w-6 h-6 text-purple-400" />, title: "Analytics Dashboard", desc: "See what you use most. Track recently accessed resources." },
    { icon: <Zap className="w-6 h-6 text-purple-400" />, title: "Keyboard Shortcuts", desc: "Built for speed. Navigate everything without touching your mouse." },
    { icon: <Download className="w-6 h-6 text-purple-400" />, title: "Import/Export", desc: "JSON & CSV support. Your data, your control. No lock-in." },
    { icon: <Target className="w-6 h-6 text-purple-400" />, title: "Bulk Actions", desc: "Edit, categorize, or delete multiple resources at once." },
  ];

  return (
    <section className="relative px-6 py-32 text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto text-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-semibold tracking-tight mb-4 will-change-transform"
        >
          Everything You Need
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg text-zinc-400 max-w-2xl mx-auto will-change-transform"
        >
          Thoughtfully designed features for real workflows
        </motion.p>
      </div>

      <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
            className="group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm 
                       hover:-translate-y-1 hover:border-purple-500/40 transition-all duration-500"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl rounded-2xl" />
            <div className="relative z-10 flex flex-col items-start">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
