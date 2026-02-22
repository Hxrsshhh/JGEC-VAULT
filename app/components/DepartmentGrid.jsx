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
      <div className="flex items-end justify-between mb-16 px-2">
        <div className="flex items-center gap-8">
          
          <button
            onClick={onBack}
            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 group"
          >
            <ChevronRight
              className="rotate-180 group-hover:-translate-x-1 transition-transform"
              size={24}
            />
          </button>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                Directory Level 02
              </span>
            </div>

            <h2 className="text-5xl font-black uppercase tracking-tighter italic">
              {selectedYear?.label}
            </h2>
          </div>
        </div>

        <div className="hidden lg:block text-right">
          <p className={`${theme.textMuted} text-[10px] font-bold uppercase tracking-widest`}>
            Node ID
          </p>
          <p className="text-sm font-mono font-bold opacity-80">
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
              className="relative p-1 group cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${dept.color} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]`}
              />

              <div
                className={`relative h-full p-8 rounded-[2.5rem] border ${theme.card} ${dept.border} transition-all duration-300 flex flex-col items-start overflow-hidden`}
              >
                <div className="w-full flex justify-between items-start mb-12">
                  <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${accentClasses.split(" ")[0]}`}>
                    <IconComponent size={28} />
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 text-white/20 group-hover:text-white transition-colors">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <div className="space-y-1 mb-8">
                  <h4 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                    {dept.code}
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                    {dept.label}
                  </p>
                </div>

                <div className="w-full mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Library size={12} className="opacity-30" />
                    <span className="text-[10px] font-bold opacity-40">
                      {dept.stats}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3].map((dot) => (
                      <div
                        key={dot}
                        className={`w-1 h-1 rounded-full ${accentClasses.split(" ")[1]} ${
                          dot > 2 ? "opacity-20" : "opacity-100 animate-pulse"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute top-4 right-8 text-[8px] font-black tracking-widest opacity-0 group-hover:opacity-20 transition-opacity rotate-90 origin-right">
                  STREAM_{dept.code}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}