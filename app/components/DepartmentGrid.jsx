"use client";

import {
  ChevronRight,
  ArrowUpRight,
  Library,
  Cpu,
  Network,
  Radio,
  Zap,
  Settings,
  HardHat,
} from "lucide-react";
import { useRouter } from "next/navigation";

const accentColorMap = {
  "emerald-500": "text-emerald-500 bg-emerald-500",
  "cyan-500": "text-cyan-500 bg-cyan-500",
  "blue-500": "text-blue-500 bg-blue-500",
  "amber-500": "text-amber-500 bg-amber-500",
  "rose-500": "text-rose-500 bg-rose-500",
  "orange-500": "text-orange-500 bg-orange-500",
};

export default function DepartmentGrid({ year }) {
  const router = useRouter();

  const departments = [
    {
      id: "it",
      label: "Information Tech",
      code: "IT",
      icon: Network,
      color: "from-cyan-500/20 to-cyan-600/5",
      border: "group-hover:border-cyan-500/50",
      accent: "cyan-500",

      stats: "1.2k Files",
    },
    {
      id: "cse",
      label: "Computer Science",
      code: "CSE",
      icon: Cpu,
      color: "from-emerald-500/20 to-emerald-600/5",
      border: "group-hover:border-emerald-500/50",
      accent: "emerald-500",
      stats: "980 Files",
    },
    {
      id: "ece",
      label: "Electronics & Comm",
      code: "ECE",
      icon: Radio,
      color: "from-blue-500/20 to-blue-600/5",
      border: "group-hover:border-blue-500/50",
      accent: "blue-500",
      stats: "850 Files",
    },
    {
      id: "ee",
      label: "Electrical Eng",
      code: "EE",
      icon: Zap,
      color: "from-amber-500/20 to-amber-600/5",
      border: "group-hover:border-amber-500/50",
      accent: "amber-500",
      stats: "920 Files",
    },
    {
      id: "me",
      label: "Mechanical Eng",
      code: "ME",
      icon: Settings,
      color: "from-rose-500/20 to-rose-600/5",
      border: "group-hover:border-rose-500/50",
      accent: "rose-500",
      stats: "1.1k Files",
    },
    {
      id: "ce",
      label: "Civil Engineering",
      code: "CE",
      icon: HardHat,
      color: "from-orange-500/20 to-orange-600/5",
      border: "group-hover:border-orange-500/50",
      accent: "orange-500",
      stats: "740 Files",
    },
  ];

  const yearMap = {
    1: { label: "First Year", code: "1ST" },
    2: { label: "Second Year", code: "2ND" },
    3: { label: "Third Year", code: "3RD" },
    4: { label: "Fourth Year", code: "4TH" },
  };

  const selectedYear = yearMap[year];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in px-4 md:px-6 lg:px-8 dark:bg-black/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 mt-4 gap-6 md:gap-0">
        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 group text-zinc-900 dark:text-white shadow-sm shrink-0"
          >
            <ChevronRight
              className="rotate-180 group-hover:-translate-x-1 transition-transform"
              size={20}
            />
          </button>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-6 md:w-8 h-0.5 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-blue-600 dark:text-blue-500">
                Directory Level 02
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white">
              {selectedYear?.label}
            </h2>
          </div>
        </div>

        <div className="hidden sm:block text-left md:text-right">
          <p className="text-zinc-400 dark:text-white/20 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
            Node ID
          </p>
          <p className="text-xs md:text-sm font-mono font-bold text-zinc-600 dark:text-white dark:opacity-80">
            {`JGEC_ARCHIVE_${selectedYear?.code}_2024`}
          </p>
        </div>
      </div>

      {/* Grid - 1 col on mobile, 2 on tab, 3 on laptop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {departments.map((dept) => {
          const IconComponent = dept.icon;
          const accentClasses = accentColorMap[dept.accent];

          return (
            <div
              key={dept.id}
              onClick={() => router.push(`/dashboard/${year}/${dept.code}`)}
              className="relative p-1 group cursor-pointer h-72 md:h-80"
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${dept.color} blur-3xl opacity-0 group-hover:opacity-30 dark:group-hover:opacity-60 transition-opacity duration-700 rounded-4xl md:rounded-[2.5rem]`}
              />

              <div
                className={`relative h-full p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] border bg-white/80 dark:bg-black/20 backdrop-blur-md border-zinc-200 dark:border-white/10 ${dept.border} transition-all duration-500 flex flex-col items-start overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-none hover:-translate-y-1`}
              >
                {/* LARGE BACKGROUND TEXT */}
                <div className="absolute -bottom-4 -left-2 text-[5rem] md:text-[7rem] font-black uppercase tracking-tighter italic leading-none select-none pointer-events-none opacity-[0.03] dark:opacity-[0.05] text-zinc-900 dark:text-white group-hover:scale-110 group-hover:-translate-y-4 transition-transform duration-1000">
                  {dept.code}
                </div>

                <div className="w-full flex justify-between items-start z-10">
                  <div
                    className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 ${accentClasses.split(" ")[0]} group-hover:scale-110 transition-transform duration-500`}
                  >
                    <IconComponent className="w-5 h-5 md:w-7 md:h-7" />
                  </div>

                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-white/20 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                    <ArrowUpRight
                      size={18}
                      className="group-hover:rotate-45 transition-transform"
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-6 md:mt-8 mb-4 z-10">
                  <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white">
                    {dept.code}
                  </h4>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-white dark:opacity-50">
                    {dept.label}
                  </p>
                </div>

                <div className="mt-1 md:mt-2 text-[8px] md:text-[9px] font-bold text-zinc-400 dark:text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] z-10">
                  Accessing Secured Archive...
                </div>

                <div className="w-full mt-auto pt-4 md:pt-6 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between z-10">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((dot) => (
                      <div
                        key={dot}
                        className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${accentClasses.split(" ")[1]} ${
                          dot > 2 ? "opacity-20" : "opacity-100 animate-pulse"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Vertical Side Decal - Hidden on smallest mobile to avoid overflow */}
                <div className="hidden xs:block absolute top-8 -right-4 text-[9px] font-black tracking-[0.5em] text-zinc-900 dark:text-white opacity-[0.05] dark:opacity-10 rotate-90 origin-left select-none group-hover:opacity-30 transition-opacity">
                  {dept.id}_DATA_STREAM
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
