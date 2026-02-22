"use client";

import { ChevronRight, ArrowUpRight, Library } from "lucide-react";

const accentColorMap = {
  "emerald-500": "text-emerald-500 bg-emerald-500",
  "cyan-500": "text-cyan-500 bg-cyan-500",
  "blue-500": "text-blue-500 bg-blue-500",
  "amber-500": "text-amber-500 bg-amber-500",
  "rose-500": "text-rose-500 bg-rose-500",
  "orange-500": "text-orange-500 bg-orange-500",
};

export default function DepartmentGrid({
  departments,
  selectedYear,
  theme,
  onBack,
  onSelectDept,
}) {
  return (

   <div className="max-w-7xl mx-auto animate-fade-in">
  {/* Header */}
  <div className="flex items-end justify-between mb-8 px-2">
    <div className="flex items-center gap-8">
      <button
        onClick={onBack}
        className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 group text-zinc-900 dark:text-white shadow-sm"
      >
        <ChevronRight
          className="rotate-180 group-hover:-translate-x-1 transition-transform"
          size={24}
        />
      </button>

      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="w-8 h-[2px] bg-blue-600 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-500">
            Directory Level 02
          </span>
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white">
          {selectedYear?.label}
        </h2>
      </div>
    </div>

    <div className="hidden lg:block text-right">
      <p className="text-zinc-400 dark:text-white/20 text-[10px] font-bold uppercase tracking-widest">
        Node ID
      </p>
      <p className="text-sm font-mono font-bold text-zinc-600 dark:text-white dark:opacity-80">
        {`JGEC_ARCHIVE_${selectedYear?.code}_2024`}
      </p>
    </div>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {departments.map((dept) => {
      const IconComponent = dept.icon;
      const accentClasses = accentColorMap[dept.accent];

      return (
        <div
          key={dept.id}
          onClick={() => onSelectDept(dept)}
          className="relative p-1 group cursor-pointer h-80"
        >
          {/* Enhanced Glow Effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${dept.color} blur-3xl opacity-0 group-hover:opacity-30 dark:group-hover:opacity-60 transition-opacity duration-700 rounded-[2.5rem]`}
          />

          <div
            className={`relative h-full p-8 rounded-[2.5rem] border bg-white/80 dark:bg-black/20 backdrop-blur-md border-zinc-200 dark:border-white/10 ${dept.border} transition-all duration-500 flex flex-col items-start overflow-hidden shadow-xl hover:shadow-2xl dark:shadow-none hover:-translate-y-1`}
          >
            {/* LARGE BACKGROUND TEXT (The Enhancement) */}
            <div className="absolute -bottom-4 -left-2 text-[7rem] font-black uppercase tracking-tighter italic leading-none select-none pointer-events-none opacity-[0.03] dark:opacity-[0.05] text-zinc-900 dark:text-white group-hover:scale-110 group-hover:-translate-y-4 transition-transform duration-1000">
              {dept.code}
            </div>

            <div className="w-full flex justify-between items-start z-10">
              <div className={`p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 ${accentClasses.split(" ")[0]} group-hover:scale-110 transition-transform duration-500`}>
                <IconComponent size={28} />
              </div>

              <div className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-white/20 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
              </div>
            </div>

            <div className="space-y-1 mt-8 mb-4 z-10">
              <h4 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white">
                {dept.code}
              </h4>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-white dark:opacity-50">
                {dept.label}
              </p>
            </div>

            {/* Sub-label for extra detail */}
            <div className="mt-2 text-[9px] font-bold text-zinc-400 dark:text-white/30 uppercase tracking-[0.3em] z-10">
               Accessing Secured Archive...
            </div>

            <div className="w-full mt-auto pt-6 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Library size={12} className="text-zinc-400 dark:opacity-30" />
                <span className="text-[10px] font-bold text-zinc-400 dark:opacity-40">
                  {dept.stats}
                </span>
              </div>

              <div className="flex gap-1.5">
                {[1, 2, 3].map((dot) => (
                  <div
                    key={dot}
                    className={`w-1.5 h-1.5 rounded-full ${accentClasses.split(" ")[1]} ${
                      dot > 2 ? "opacity-20" : "opacity-100 animate-pulse"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Vertical Side Decal */}
            <div className="absolute top-8 -right-4 text-[9px] font-black tracking-[0.5em] text-zinc-900 dark:text-white opacity-[0.05] dark:opacity-10 rotate-90 origin-left select-none group-hover:opacity-30 transition-opacity">
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