"use client";

import React from "react";
import {
  ChevronLeft,
  ArrowUpRight,
  Calendar,
  BookOpen,
  FileText,
  Database,
  Hash,
  Activity,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import BackgroundDesign from "@/app/components/BackgroundDesign";
import Link from "next/link";
import { useParams } from "next/navigation";

// Accent mapping for consistent theme colors
const accentColorMap = {
  "emerald-500":
    "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
  "blue-500": "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
  "purple-500":
    "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10",
};

export default function App() {
  const params = useParams();
  const { dept , year } = params;
  const resourceTypes = [
    {
      id: "yearwise",
      label: "Chronological Archive",
      title: "Yearwise Papers",
      code: "YWP",
      icon: Calendar,
      color: "from-blue-500/20 to-blue-600/5",
      border: "group-hover:border-blue-500/50",
      accent: "blue-500",
      description: "Previous year questions organized by examination session.",
      stats: "2015 - 2024",
    },
    {
      id: "subjectwise",
      label: "Modular Taxonomy",
      title: "Subjectwise Papers",
      code: "SWP",
      icon: BookOpen,
      color: "from-emerald-500/20 to-emerald-600/5",
      border: "group-hover:border-emerald-500/50",
      accent: "emerald-500",
      description:
        "Question banks filtered by specific academic curriculum units.",
      stats: "48 Subjects",
    },
    {
      id: "notes",
      label: "Knowledge Repository",
      title: "Academic Notes",
      code: "NOTES",
      icon: FileText,
      color: "from-purple-500/20 to-purple-600/5",
      border: "group-hover:border-purple-500/50",
      accent: "purple-500",
      description:
        "Classroom summaries, digitized hand-outs and reference materials.",
      stats: "850+ PDF",
    },
  ];

  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-[#050505] transition-colors duration-500 overflow-hidden flex flex-col">
      {/* Decorative Grid Background */}
      <BackgroundDesign />

      <div className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-4 md:py-8 lg:py-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Responsive Header Section - Compact for non-scroll */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => window.history.back()}
              className="group w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white shadow-sm"
              aria-label="Go back"
            >
              <ChevronLeft
                className="group-hover:-translate-x-1 transition-transform"
                size={22}
              />
            </button>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-500">
                  System.Directory.Resources
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white leading-none">
                Resource Hub
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-start md:items-end font-mono">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-white/20 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mb-1">
              <ShieldCheck size={10} />
              <span>Security Clearance: Level 03</span>
            </div>
            <p className="text-[10px] md:text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-200/50 dark:bg-white/5 px-3 py-0.5 rounded-full border border-zinc-300/50 dark:border-white/10">
              JGEC_DB_V2.0
            </p>
          </div>
        </header>

        {/* Selection Grid: Optimized heights to fit screen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 flex-1 content-center py-6">
          {resourceTypes.map((type) => {
            const IconComponent = type.icon;
            const accentClasses = accentColorMap[type.accent];

            return (
              <Link href={`/dashboard/${year}/${dept}/${type.id}`} key={type.id}>
                <div
                  onClick={() => console.log(`Navigating to: ${type.id}`)}
                  className="relative p-1 group cursor-pointer h-full max-h-[450px]"
                >
                  {/* Dynamic Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${type.color} blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 rounded-[2rem] md:rounded-[2.5rem]`}
                  />

                  <div
                    className={`relative h-full p-5 md:p-8 lg:p-10 rounded-[2rem] md:rounded-[2.5rem] border bg-white/90 dark:bg-black/10 border-zinc-200 dark:border-white/10 ${type.border} transition-all duration-500 flex flex-col items-start overflow-hidden shadow-sm hover:shadow-2xl dark:shadow-none hover:-translate-y-2`}
                  >
                    {/* Decorative Watermark */}
                    <div className="absolute -bottom-6 -right-4 text-[4rem] md:text-[6rem] lg:text-[7rem] font-black uppercase tracking-tighter italic leading-none select-none pointer-events-none opacity-[0.03] dark:opacity-[0.08] text-zinc-900 dark:text-white group-hover:scale-110 group-hover:-translate-x-8 transition-transform duration-1000">
                      {type.code}
                    </div>

                    {/* Icon and Action Row */}
                    <div className="w-full flex justify-between items-start z-10 shrink-0">
                      <div
                        className={`p-3 md:p-4 rounded-xl md:rounded-2xl border border-zinc-200/50 dark:border-white/5 ${accentClasses} group-hover:scale-110 transition-transform duration-500 shadow-sm`}
                      >
                        <IconComponent className="w-5 h-5 md:w-8 md:h-8" />
                      </div>

                      <div className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-white/20 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-all duration-300">
                        <ArrowUpRight
                          size={16}
                          className="group-hover:rotate-45 transition-transform"
                        />
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="mt-4 md:mt-8 z-10 flex-grow">
                      <h3 className="text-xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter italic leading-tight text-zinc-900 dark:text-white">
                        {type.title}
                      </h3>
                      <div className="inline-flex items-center gap-2 mt-1">
                        <Terminal
                          size={10}
                          className="text-blue-600 dark:text-blue-500"
                        />
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-500">
                          {type.label}
                        </p>
                      </div>
                      <p className="mt-3 text-[11px] md:text-sm lg:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-[240px]">
                        {type.description}
                      </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-4 w-full z-10 shrink-0">
                      <div className="flex items-center gap-2 mb-3">
                        <Database size={10} className="text-zinc-400" />
                        <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                          {type.stats}
                        </span>
                      </div>

                      <div className="w-full h-px bg-zinc-200/50 dark:bg-white/5 mb-3" />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {[1, 2, 3].map((dot) => (
                            <div
                              key={dot}
                              className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${type.accent.includes("blue") ? "bg-blue-500" : type.accent.includes("emerald") ? "bg-emerald-500" : "bg-purple-500"} ${
                                dot > 2
                                  ? "opacity-20"
                                  : "opacity-100 animate-pulse"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[7px] md:text-[9px] font-mono font-bold text-zinc-300 dark:text-white/10 uppercase">
                          NODE_{type.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Global Footer - Compact */}
        <footer className="shrink-0 pt-4 border-t border-zinc-200 dark:border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                  System Status: Online
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Hash size={12} className="text-blue-500" />
                <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                  Active Nodes: 03
                </span>
              </div>
              <div className="hidden xs:flex items-center gap-2">
                <Activity size={12} className="text-purple-500" />
                <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                  Latency: 14ms
                </span>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-0.5">
              <p className="text-[8px] md:text-[10px] font-black text-zinc-400 dark:text-white/20 uppercase tracking-[0.2em]">
                &copy; 2024 JGEC Archive Management
              </p>
              <p className="text-[7px] font-mono text-zinc-300 dark:text-white/5 uppercase">
                Build_ID: 0xFF2840-ALPHA
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
