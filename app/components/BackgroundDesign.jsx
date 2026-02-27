"use client";

import React, { useState, useEffect } from "react";

export default function BackgroundDesign() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50 dark:bg-black">
      {/* 1. Enhanced Ambient Orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 dark:bg-blue-900/15 blur-[120px] rounded-full animate-pulse-slow" />
      <div
        className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/15 dark:bg-blue-800/10 blur-[120px] rounded-full animate-pulse-slow"
        style={{ animationDelay: "3s" }}
      />

      {/* 2. Tactical Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse at center, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black, transparent 80%)",
        }}
      />

      {/* 3. Improved Mouse Spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.12), transparent 40%)`,
        }}
      />

      {/* 4. Moving Scanline Effect */}
      <div className="absolute inset-0 w-full h-full">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent absolute top-0 animate-scanline" />
      </div>

      {/* 5. Grain & Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay pointer-events-none" />

      <style jsx global>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        .animate-scanline {
          animation: scanline 10s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
