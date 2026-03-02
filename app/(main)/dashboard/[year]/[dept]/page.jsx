"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Download,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Calendar,
  Layers,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { departmentMap } from "@/lib/departments";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Page() {
  const params = useParams();
  const { year, dept } = params;
  const router = useRouter();

  const yearMap = {
    1: { label: "First Year", code: "1ST" },
    2: { label: "Second Year", code: "2ND" },
    3: { label: "Third Year", code: "3RD" },
    4: { label: "Fourth Year", code: "4TH" },
  };

  const selectedYear = yearMap[Number(year)];
  const selectedDept = departmentMap[dept?.toLowerCase()];

  const shouldFetch = year && selectedDept?.code;

  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `/api/papers?department=${selectedDept.code}&academicYear=${year}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const papers = data?.success ? data.papers : [];

  const groupedSubjects = papers.reduce((acc, paper) => {
    const key = paper.subjectCode;
    if (!acc[key]) {
      acc[key] = {
        id: key,
        title: paper.title,
        code: paper.subjectCode,
        semester: paper.semester,
        files: [],
      };
    }
    acc[key].files.push(paper);
    return acc;
  }, {});

  const subjects = Object.values(groupedSubjects);

  return (
    <div className="min-h-screen bg-white/10 dark:bg-black/10 text-zinc-900 dark:text-white selection:bg-blue-500/30 transition-colors">
      {/* --- HEADER SECTION --- */}
      <header className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all border border-black/10 dark:border-white/10 group active:scale-90"
            >
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-blue-600 dark:text-blue-500">
                  Terminal // {selectedYear?.label || "Archive"}
                </span>
              </div>
              <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-tight">
                {selectedDept?.label}{" "}
                <span className="text-blue-600">Vault.</span>
              </h1>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end border-t md:border-t-0 md:border-l border-black/10 dark:border-white/10 pt-4 md:pt-0 md:pl-8 justify-between md:justify-start">
            <span className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
              Database Sync
            </span>
            <span className="text-xs md:text-sm font-mono text-emerald-600 dark:text-emerald-500 uppercase">
              Status: Operational
            </span>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-zinc-500 uppercase font-black tracking-widest text-sm animate-pulse">
              Syncing Archive...
            </p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-black/10 dark:border-white/5 rounded-4xl md:rounded-[3rem]">
            <p className="text-zinc-500 uppercase font-black tracking-widest text-sm">
              No Data Packets Found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {subjects.map((subject) => (
              <div key={subject.id} className="group relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-[2.5rem] md:rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative bg-white dark:bg-white/2 border border-black/10 dark:border-white/10 rounded-4xl md:rounded-[2.5rem] p-6 md:p-8 hover:border-blue-500/50 transition-all duration-500 shadow-xl dark:shadow-2xl overflow-hidden">
                  {/* Subject Header */}
                  <div className="flex justify-between items-start mb-6 md:mb-8">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                        <span className="px-2 md:px-3 py-1 rounded-full bg-blue-600/10 text-[9px] md:text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase border border-blue-500/20">
                          {subject.code}
                        </span>
                        <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                          <Layers size={12} /> SEM {subject.semester}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black italic tracking-tight uppercase leading-none group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                        {subject.title}
                      </h3>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0">
                      <BookOpen
                        size={20}
                        className="text-white md:w-6 md:h-6"
                      />
                    </div>
                  </div>

                  {/* Packet List */}
                  <div className="space-y-3">
                    <p className="text-[9px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4">
                      Available Records
                    </p>
                    {subject.files.map((file) => (
                      <div
                        key={file._id}
                        className="group/item flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/3 dark:bg-white/3 border border-transparent hover:border-black/10 dark:hover:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="flex flex-col items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-sm">
                            <span className="text-[9px] md:text-[10px] font-black text-blue-600 dark:text-blue-500">
                              {file.examYear}
                            </span>
                            <span className="text-[7px] md:text-[8px] font-bold text-zinc-500 uppercase">
                              {file.examType}
                            </span>
                          </div>
                          <div>
                            <p className="text-[11px] md:text-xs font-black uppercase tracking-wide text-zinc-700 dark:text-zinc-200">
                              {file.title || "Examination Paper"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[8px] md:text-[9px] font-bold text-zinc-500 uppercase">
                                {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
                              </span>
                              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                              <span className="text-[8px] md:text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase flex items-center gap-1">
                                <ShieldCheck size={10} /> Verified
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={async () => {
                            const fileName = `${subject.code}_${file.examYear}_${file.examType}.pdf`;

                            const toastId = toast.loading(
                              "Preparing download...",
                              {
                                description: "Fetching file from secure vault.",
                              },
                            );

                            try {
                              const res = await fetch(
                                `/api/download?url=${encodeURIComponent(
                                  file.fileUrl,
                                )}&name=${encodeURIComponent(fileName)}`,
                              );

                              if (!res.ok) {
                                const errorData = await res
                                  .json()
                                  .catch(() => null);
                                throw new Error(
                                  errorData?.message || "Download failed",
                                );
                              }

                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);

                              const a = document.createElement("a");
                              a.href = url;
                              a.download = fileName;
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                              window.URL.revokeObjectURL(url);

                              toast.success("Download successful 📥", {
                                id: toastId,
                                description: `${fileName} saved successfully.`,
                              });
                            } catch (error) {
                              toast.error("Download failed ❌", {
                                id: toastId,
                                description: error.message,
                              });
                            }
                          }}
                          className="p-2.5 md:p-3 rounded-lg md:rounded-xl bg-black/5 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Download size={14} className="md:w-4 md:h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4 text-[8px] md:text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> Updated Feb 2026
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText size={12} /> PDF / OCR Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Contribution Card */}
            <div className="h-full min-h-62.5 md:min-h-75 border-2 border-dashed border-black/10 dark:border-white/10 rounded-4xl md:rounded-[2.5rem] flex flex-col items-center justify-center p-8 md:p-10 text-center hover:bg-blue-600/5 hover:border-blue-600/50 transition-all cursor-pointer group">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="text-zinc-400 group-hover:text-blue-600" />
              </div>
              <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-500 dark:text-zinc-400 mb-2">
                Initialize Uplink
              </h4>
              <p className="text-[9px] md:text-[10px] font-medium text-zinc-500 dark:text-zinc-600 uppercase tracking-widest max-w-xs mb-6">
                Contribute to the {selectedDept?.code} knowledge base.
              </p>
              <Link href="/uploadPaper">
                <button className="px-6 md:px-8 py-2.5 md:py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95">
                  Uplink Data
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
