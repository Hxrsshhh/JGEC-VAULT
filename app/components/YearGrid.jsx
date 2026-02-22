"use client";

import { GraduationCap, ChevronRight } from "lucide-react";

export default function YearGrid({
  academicYears,
  theme,
  onSelectYear,
}) {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter italic italic-text">
          Select Cycle
        </h1>

        <p
          className={`${theme.textMuted} text-[10px] font-bold uppercase tracking-[0.5em]`}
        >
          Archive Protocol / Jalpaiguri Govt. Engineering College
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {academicYears.map((year) => (
          <div
            key={year.id}
            onClick={() => onSelectYear(year)}
            className={`p-10 rounded-[3rem] border ${theme.card} cursor-pointer group hover:bg-white/[0.04] transition-all relative overflow-hidden`}
          >
            <div className="text-9xl font-black opacity-[0.02] absolute -right-6 -bottom-6 group-hover:scale-110 group-hover:opacity-[0.04] transition-all duration-700 select-none">
              {year.code}
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <GraduationCap size={28} />
            </div>

            <h3 className="text-3xl font-black uppercase tracking-tight mb-3 italic">
              {year.label}
            </h3>

            <p
              className={`text-sm font-medium ${theme.textMuted} mb-10 leading-relaxed max-w-xs`}
            >
              {year.desc}
            </p>

            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 group-hover:gap-6 transition-all">
              Initialize Node{" "}
              <ChevronRight size={14} strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}