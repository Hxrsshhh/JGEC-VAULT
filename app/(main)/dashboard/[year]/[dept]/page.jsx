"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Download,
  BookOpen,
  ExternalLink,
  Library,
  Info,
  ArrowUpRight,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { departmentMap } from "@/lib/departments";

export default function Page() {
  const params = useParams();
  const { year, dept } = params;
  console.log(year, dept);
  const yearMap = {
    1: { label: "First Year", code: "1ST" },
    2: { label: "Second Year", code: "2ND" },
    3: { label: "Third Year", code: "3RD" },
    4: { label: "Fourth Year", code: "4TH" },
  };

  const selectedYear = yearMap[Number(year)];
  const selectedDept = departmentMap[dept?.toLowerCase()];
  const router = useRouter();

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!year || !selectedDept?.code) return;

    const fetchPapers = async () => {
      try {
        const res = await fetch(
          `/api/papers?department=${selectedDept.code}&academicYear=${year}`,
        );
        const data = await res.json();

        if (data.success) {
          setPapers(data.papers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [year, selectedDept]);

  const groupedSubjects = papers.reduce((acc, paper) => {
    const key = paper.subjectCode;

    if (!acc[key]) {
      acc[key] = {
        id: key,
        title: paper.title,
        code: paper.subjectCode,
        semester: `${paper.semester} Sem`,
        files: [],
      };
    }

    acc[key].files.push({
      year: paper.year.toString(),
      type: paper.examType,
      size: paper.fileSize
        ? `${(paper.fileSize / (1024 * 1024)).toFixed(1)} MB`
        : "—",
      fileUrl: paper.fileUrl,
    });

    return acc;
  }, {});

  const subjects = Object.values(groupedSubjects);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-zinc-400">
        Loading papers...
      </div>
    );
  }

  return (
    <div className="h-max-screen bg-transparent animate-fade-in pb-12 transition-colors duration-500 font-sans">
      {subjects.length === 0 && !loading && (
        <div className="text-center col-span-full text-zinc-400">
          No papers available yet.
        </div>
      )}
      {/* --- 1. ADAPTIVE HEADER --- */}
      <header className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-12 mb-8 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white dark:bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 group active:scale-90 shadow-sm"
            >
              <ChevronLeft
                className="group-hover:-translate-x-1 transition-transform"
                size={24}
              />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 md:w-8 h-[2px] bg-blue-600 rounded-full"></span>
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 truncate">
                  Index // {selectedYear?.code || "Level 03"}
                </span>
              </div>
              <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white truncate">
                {selectedDept?.code || "CS"}{" "}
                <span className="text-blue-600">Archive.</span>
              </h2>
            </div>
          </div>

          {/* Desktop Only Node Metadata */}
          <div className="hidden lg:block text-right">
            <p className="text-zinc-400 dark:text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
              Access Point Node
            </p>
            <div className="px-4 py-2 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10">
              <code className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                JGEC_RES_{selectedDept?.code || "CSE"}_V4
              </code>
            </div>
          </div>
        </div>
      </header>

      {/* --- 2. SUBJECT GRID --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {subjects.map((subject) => (
            <div key={subject.id} className="group relative">
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative h-full bg-white dark:bg-[#080808] border border-zinc-200 dark:border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 hover:border-blue-500/40 transition-all duration-500 flex flex-col shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
                {/* Header within Card */}
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-[9px] font-black text-blue-600 uppercase tracking-widest">
                        {subject.code}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800"></span>
                      <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                        {subject.semester}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic leading-tight text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {subject.title}
                    </h3>
                  </div>
                  <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    <BookOpen size={20} className="md:w-6 md:h-6" />
                  </div>
                </div>

                {/* File List Area */}
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">
                      Available Packets
                    </p>
                    <div className="h-[1px] flex-grow ml-4 bg-zinc-100 dark:bg-white/5"></div>
                  </div>

                  {/* Scrollable List */}
                  <div className="space-y-2 md:space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {subject.files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-transparent hover:border-blue-500/20 hover:bg-white dark:hover:bg-blue-600/10 transition-all group/item cursor-pointer shadow-sm md:shadow-none"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-[10px] md:text-xs font-black text-blue-600 group-hover/item:scale-110 transition-transform">
                            {file.year.slice(2)}
                          </div>
                          <div>
                            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                              {file.year} Paper
                            </p>
                            <p className="text-[8px] md:text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">
                              {file.type} • {file.size}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(file.fileUrl, "_blank")}
                            className="p-2 md:p-3 rounded-lg md:rounded-xl bg-zinc-200/50 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all md:opacity-0 md:group-hover/item:opacity-100"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="mt-6 md:mt-8 pt-6 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Library size={14} className="text-blue-600 opacity-60" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      {subject.files.length} ENTRIES
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((dot) => (
                      <div
                        key={dot}
                        className={`w-1.5 h-1.5 rounded-full ${dot < 3 ? "bg-blue-600 animate-pulse" : "bg-zinc-200 dark:bg-zinc-800"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* --- 3. ENHANCED MOBILE-FIRST EMPTY/ADD STATE --- */}
          <div className="group relative">
            <div className="h-full min-h-[280px] rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-white/[0.01] hover:border-blue-500/40 hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-all cursor-pointer">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <ArrowUpRight
                  size={24}
                  className="text-zinc-400 group-hover:text-blue-600 transition-colors"
                />
              </div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600 mb-2">
                Contribution Mode
              </h4>
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-700 uppercase tracking-widest max-w-[180px] mb-6">
                Help expand the {selectedDept?.code || "CSE"} digital archive
              </p>
              <button className="px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-black/10 dark:shadow-none">
                Uplink Paper
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- 4. MOBILE SYSTEM CLOCK (FOOTER) --- */}
      <footer className="max-w-7xl mx-auto px-6 mt-12 md:hidden">
        <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-zinc-500 uppercase">
              System Stable
            </span>
          </div>
          <span className="text-[9px] font-mono text-zinc-400">
            v4.0.2 // JGEC
          </span>
        </div>
      </footer>

      {/* Global Style for scrollbar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #1d4ed8; }
      `,
        }}
      />
    </div>
  );
}
