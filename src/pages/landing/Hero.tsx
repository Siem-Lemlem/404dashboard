"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronRight as Arrow } from "lucide-react";
import ShinyText from "../../hooks/ShinyText";

export default function Hero() {
  const images = [
    "/Screenshot_1.png",
    "/Screenshot_2.png",
    "/Screenshot_3.png",
    "/Screenshot_4.png",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="bg-black text-white">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden pt-40 pb-32">
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6 px-5 py-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full text-sm text-purple-300"
          >
            <ShinyText
              text="Open Source & Free Forever"
              disabled={false}
              speed={4}
              className="text-xl"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6"
          >
            Your Resources,<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
              Always Ready
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Built for developers who value focus.  
            No subscriptions. No noise — just a clean, powerful dashboard to organize everything in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4"
          >
            <a
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg transition-all hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 flex items-center gap-2"
            >
              Start Organizing <Arrow className="w-5 h-5" />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-zinc-700 rounded-xl font-semibold text-lg text-zinc-300 hover:text-white hover:border-zinc-500 transition-all"
            >
              View on GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===================== SLIDESHOW SECTION ===================== */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-zinc-800/80 shadow-[0_0_60px_-15px_rgba(0,0,0,0.6)] bg-zinc-950/70 backdrop-blur-md">
            <div className="aspect-video relative flex items-center justify-center bg-zinc-900 overflow-hidden">
              {/* Fade transition between slides */}
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Dashboard preview ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    i === current ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              {/* Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition"
              >
                <ChevronLeft className="text-white w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition"
              >
                <ChevronRight className="text-white w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-5 w-full flex justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === current
                        ? "bg-white scale-110"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
