"use client";

import { GraduationCap, ChevronRight } from "lucide-react";

export default function YearGrid({
  academicYears,
  theme,
  onSelectYear,
}) {
  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-6xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white">
          Select Cycle
        </h1>

        <p className="text-zinc-400 dark:text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
          Archive Protocol / Jalpaiguri Govt. Engineering College
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 ">
        {academicYears.map((year) => (
          <div
            key={year.id}
            onClick={() => onSelectYear(year)}
            className="group relative p-4 cursor-pointer h-90"
          >
            {/* Dynamic Glow Halo */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]" />

            <div className="relative  p-10 rounded-[3rem] border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-black/20 backdrop-blur-xl transition-all duration-500 flex flex-col items-start overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-none hover:-translate-y-2">
              
              {/* LARGE ENHANCED BACKGROUND TEXT */}
              <div className="absolute -bottom-6 -right-4 text-[12rem] font-black uppercase tracking-tighter italic leading-none select-none pointer-events-none opacity-[0.04] dark:opacity-[0.03] text-zinc-900 dark:text-white group-hover:scale-110 group-hover:-translate-x-4 transition-transform duration-1000">
                {year.code}
              </div>

              {/* Icon Container with Reflection */}
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-500">
                  <GraduationCap size={32} />
                </div>
              </div>

              <div className="relative z-10 space-y-3">
                <h3 className="text-4xl font-black uppercase tracking-tight italic text-zinc-900 dark:text-white">
                  {year.label}
                </h3>

                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs opacity-80 group-hover:opacity-100 transition-opacity">
                  {year.desc}
                </p>
              </div>

              {/* Bottom Action Area */}
              <div className="w-full mt-auto pt-8 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-500 group-hover:gap-6 transition-all duration-500">
                  Initialize Node{" "}
                  <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[8px] font-bold text-zinc-400 dark:text-white/40 uppercase tracking-widest">Active</span>
                </div>
              </div>

              {/* Decorative Corner Decal */}
              <div className="absolute top-10 right-10 text-[8px] font-black text-blue-600 dark:text-blue-500 opacity-0 group-hover:opacity-40 transition-opacity tracking-[0.5em] uppercase pointer-events-none">
                System_Ref_{year.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}