/*
 * Copyright (c) 2025 Siem Lemlem
 * This file is part of 404Dashboard.
 * Licensed under the GNU Affero General Public License v3.0 or later.
 * See the LICENSE file for more details.
 */


import { lazy, Suspense } from "react";
import NavBar from "./landing/NavBar";
import Hero from "./landing/Hero";
// import { Coffee } from "lucide-react";

const Why = lazy(() => import("./landing/Why"));
const Features = lazy(() => import("./landing/Features"));
const CTA = lazy(() => import("./landing/CTA"));
const Footer = lazy(() => import("./landing/Footer"));

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-white antialiased overflow-hidden">
      {/* SINGLE UNIFIED BACKGROUND FOR ENTIRE PAGE */}
      <div className="fixed inset-0 -z-10 bg-black">
        {/* Smooth gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        {/* Single purple glow that affects whole page */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] bg-purple-500/8 blur-[200px]" />
      </div>
      {/* <a
        href="https://www.buymeacoffee.com/Siem"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <Coffee className="w-5 h-5" />
        <span className="hidden sm:inline">Support</span>
      </a> */}
      <NavBar />
      <Hero />
      
      <Suspense fallback={<div className="h-screen" />}>
        <Why />
        <Features />
        <CTA />
        <Footer />
      </Suspense>
    </div>
  );
}