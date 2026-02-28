"use client";

import { GraduationCap, ChevronRight } from "lucide-react";
import Link from "next/link";

const academicYears = [
  {
    id: 1,
    label: "1st Year",
    code: "Y1",
    desc: "Foundational Sciences & Engineering Mathematics",
  },
  {
    id: 2,
    label: "2nd Year",
    code: "Y2",
    desc: "Core Departmental Fundamentals & Lab Work",
  },
  {
    id: 3,
    label: "3rd Year",
    code: "Y3",
    desc: "Advanced Technical Subjects & Specializations",
  },
  {
    id: 4,
    label: "4th Year",
    code: "Y4",
    desc: "Electives, Major Projects & Industrial Prep",
  },
];

export default function YearGrid() {
  return (
    <div className="h-max-screen max-w-6xl mx-auto space-y-8 md:space-y-4 animate-fade-in px-4 bg-white/10 dark:bg-black/10">
      {/* HEADER SECTION */}
      <div className="text-center space-y-2 mt-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white leading-tight ">
          Select Cycle
        </h1>

        <p className="text-zinc-400 dark:text-white/20 text-[8px] md:text-[10px] font-black uppercase tracking-[0.25em] md:tracking-[0.5em] px-4">
          Archive Protocol / Jalpaiguri Govt. Engineering College
        </p>
      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2  md:gap-0 ">
        {academicYears.map((year) => (
          <Link key={year.id} href={`/dashboard/${year.id}`} className="block">
            <div className="group relative p-1 md:p-4 cursor-pointer min-h-60 md:min-h-80 md:h-90">
              {/* Dynamic Glow Halo */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-indigo-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem] md:rounded-[3rem]" />

              {/* CARD CONTAINER */}
              <div className="relative h-full p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-black/20 backdrop-blur-xl transition-all duration-500 flex flex-col items-start overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-none hover:-translate-y-1 md:hover:-translate-y-2">
                {/* LARGE BACKGROUND TEXT */}
                <div className="absolute -bottom-3 -right-2 md:-bottom-6 md:-right-4 text-7xl sm:text-9xl md:text-[12rem] font-black uppercase tracking-tighter italic leading-none select-none pointer-events-none opacity-[0.06] dark:opacity-[0.03] text-zinc-900 dark:text-white group-hover:scale-110 group-hover:-translate-x-4 transition-transform duration-1000">
                  {year.code}
                </div>

                {/* Icon Container */}
                <div className="relative z-10">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-500 mb-5 md:mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-500">
                    {/* Fixed: Scaling via className */}
                    <GraduationCap className="w-5 h-5 md:w-8 md:h-8" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="relative z-10 space-y-1.5 md:space-y-3">
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight italic text-zinc-900 dark:text-white">
                    {year.label}
                  </h3>

                  <p className="text-[11px] md:text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-62.5 md:max-w-xs opacity-80 group-hover:opacity-100 transition-opacity">
                    {year.desc}
                  </p>
                </div>

                {/* Bottom Action Area */}
                <div className="w-full mt-auto pt-5 md:pt-8 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-blue-600 dark:text-blue-500 group-hover:gap-6 transition-all duration-500">
                    Initialize Node {/* Fixed: Scaling via className */}
                    <ChevronRight
                      strokeWidth={3}
                      className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform"
                    />
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[7px] md:text-[8px] font-bold text-zinc-400 dark:text-white/40 uppercase tracking-widest">
                      Active
                    </span>
                  </div>
                </div>

                {/* Decorative Corner Decal */}
                <div className="absolute top-6 right-6 md:top-10 md:right-10 text-[8px] font-black text-blue-600 dark:text-blue-500 opacity-0 group-hover:opacity-40 transition-opacity tracking-[0.5em] uppercase pointer-events-none">
                  Ref_{year.id}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
