import React from "react";
import { 
  ChevronRight, 
  Download, 
  Clock, 
  ShieldCheck, 
  BookOpen,
  ExternalLink,
  Layers,
  Library
} from "lucide-react";

export default function ResourceView({
  selectedDept,
  selectedYear,
  theme,
  onBack,
}) {
  // Mock data expanded to demonstrate the scrollable paper list
  const subjects = [
    {
      id: 1,
      title: "Data Structures & Algorithms",
      code: "CS401",
      semester: "4th Sem",
      files: [
        { year: "2023", type: "Main", size: "1.2 MB" },
        { year: "2022", type: "Main", size: "1.1 MB" },
        { year: "2021", type: "Main", size: "0.9 MB" },
        { year: "2020", type: "Supplementary", size: "1.0 MB" },
        { year: "2019", type: "Main", size: "1.3 MB" },
        { year: "2018", type: "Main", size: "1.1 MB" },
      ]
    },
    {
      id: 2,
      title: "Discrete Mathematics",
      code: "M402",
      semester: "4th Sem",
      files: [
        { year: "2023", type: "Main", size: "2.4 MB" },
        { year: "2022", type: "Main", size: "2.1 MB" },
        { year: "2021", type: "Main", size: "1.9 MB" },
        { year: "2020", type: "Main", size: "2.0 MB" },
        { year: "2019", type: "Main", size: "1.8 MB" },
      ]
    },
    {
      id: 3,
      title: "Computer Organization",
      code: "CS403",
      semester: "4th Sem",
      files: [
        { year: "2023", type: "Main", size: "1.5 MB" },
        { year: "2022", type: "Main", size: "1.4 MB" },
        { year: "2021", type: "Main", size: "1.6 MB" },
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 animate-fade-in pb-20 transition-colors duration-500">
      
      {/* Header - Matched with DepartmentGrid */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16  px-2">
        <div className="flex items-center gap-8">
          <button
            onClick={onBack}
            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 group active:scale-95 text-zinc-900 dark:text-white"
          >
            <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={24} />
          </button>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                Directory Level 03
              </span>
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white">
              {selectedDept?.code} <span className="text-blue-600">Archive.</span>
            </h2>
          </div>
        </div>

        <div className="hidden lg:block text-right">
          <p className={`${theme?.textMuted || "text-zinc-500"} text-[10px] font-bold uppercase tracking-widest`}>
            Node ID
          </p>
          <p className="text-sm font-mono font-bold opacity-80 dark:text-white">
            {`JGEC_RES_${selectedDept?.code}_${selectedYear?.code}`}
          </p>
        </div>
      </div>

      {/* Neural Subject Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {subjects.map((subject) => (
          <div 
            key={subject.id}
            className="group relative p-1 rounded-[2.5rem] transition-all duration-500"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
            
            <div className={`relative h-full p-8 rounded-[2.5rem] border ${theme?.card || "bg-white dark:bg-[#080808]"} border-zinc-200 dark:border-white/10 group-hover:border-blue-500/50 transition-all duration-300 flex flex-col`}>
              
              {/* Subject Info */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">{subject.code}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800"></span>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{subject.semester}</span>
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {subject.title}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <BookOpen size={20} />
                </div>
              </div>

              {/* Action Links (Scrollable Year Wise) */}
              <div className="flex flex-col flex-grow">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600 mb-4">Uplink Directory</p>
                
                {/* Custom Scrollbar Container */}
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-3 custom-scrollbar scrollbar-thin">
                  {subject.files.map((file, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 hover:border-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all group/item cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                          <span className="text-[11px] font-black text-blue-600">{file.year.slice(2)}</span>
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">{file.year} Paper</p>
                          <p className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500">{file.type} • {file.size}</p>
                        </div>
                      </div>
                      
                      <button className="p-3 rounded-xl opacity-0 group-hover/item:opacity-100 hover:bg-blue-600 hover:text-white transition-all text-blue-600 transform translate-x-2 group-hover/item:translate-x-0">
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Footer - Matched with DepartmentGrid style */}
              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Library size={12} className="opacity-30 dark:text-white" />
                  <span className="text-[10px] font-bold opacity-40 dark:text-white/60">
                    {subject.files.length} Archives
                  </span>
                </div>
                
                <div className="flex gap-1">
                  {[1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className={`w-1 h-1 rounded-full bg-blue-600 ${
                        dot > 2 ? "opacity-20" : "opacity-100 animate-pulse"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute top-4 right-8 text-[8px] font-black tracking-widest opacity-0 group-hover:opacity-20 transition-opacity rotate-90 origin-right dark:text-white">
                NODE_{subject.code}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State / Add Suggestion */}
        <div className="relative p-1 group cursor-pointer">
           <div className={`relative h-full p-12 rounded-[2.5rem] border border-dashed border-zinc-300 dark:border-white/10 flex flex-col items-center justify-center text-center group-hover:border-blue-500/30 transition-all bg-zinc-50 dark:bg-white/[0.02]`}>
              <div className="w-16 h-16 rounded-2xl bg-zinc-200 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-zinc-300 dark:border-white/10">
                  <ExternalLink size={24} className="text-zinc-400 dark:opacity-20 group-hover:text-blue-500 group-hover:opacity-100 transition-all" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:opacity-30 group-hover:opacity-100 transition-opacity">
                Archive incomplete?
              </p>
              <button className="mt-4 text-[9px] font-black uppercase tracking-widest text-blue-600 underline underline-offset-8 decoration-2">
                Uplink New Data
              </button>
           </div>
        </div>
      </div>
      
      {/* Global CSS for Custom Scrollbar */}
      
    </div>
  );
}