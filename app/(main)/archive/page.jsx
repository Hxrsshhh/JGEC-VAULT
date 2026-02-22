"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  FileText,
  ShieldCheck,
  CloudUpload,
  Zap,
  Clock,
  ExternalLink,
  Lock,
  Search,
  MoreVertical,
  Activity,
  Layers,
  Fingerprint,
} from "lucide-react";

export default function MyArchiveView({ onBack, theme }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock User Stats
  const userStats = {
    name: "Neural_Drift",
    rank: 1,
    uploads: 142,
    points: 2840,
    level: "Elite",
    joinedDate: "2024.01.12",
    reputation: 99.2,
    syncStatus: "Stable",
  };

  // Mock User Uploads
  const myUploads = [
    {
      id: "UP-902",
      title: "Data Structures - End Sem 2023",
      dept: "CSE",
      status: "Indexed",
      date: "2024.03.15",
      size: "2.4 MB",
      type: "PDF",
    },
    {
      id: "UP-884",
      title: "Algorithm Analysis Notes",
      dept: "CSE",
      status: "Indexed",
      date: "2024.03.10",
      size: "1.1 MB",
      type: "DOCX",
    },
    {
      id: "UP-852",
      title: "Discrete Math Quiz Pack",
      dept: "CSE",
      status: "Indexed",
      date: "2024.03.02",
      size: "4.8 MB",
      type: "ZIP",
    },
    {
      id: "UP-741",
      title: "Operating Systems - PYQ",
      dept: "CSE",
      status: "Scanning",
      date: "2024.02.28",
      size: "1.9 MB",
      type: "PDF",
    },
    {
      id: "UP-630",
      title: "DBMS Lab Manual",
      dept: "IT",
      status: "Indexed",
      date: "2024.02.15",
      size: "3.2 MB",
      type: "PDF",
    },
    {
      id: "UP-521",
      title: "TOC Practice Sheets",
      dept: "CSE",
      status: "Indexed",
      date: "2024.01.20",
      size: "0.9 MB",
      type: "JPG",
    },
  ];

  const filteredUploads = myUploads.filter((file) =>
    file.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white dark:bg-[#030303] transition-colors duration-500 font-sans">
      {/* Dynamic Background Element */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col h-full py-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 group active:scale-95 text-zinc-900 dark:text-white shadow-lg shadow-black/5"
            >
              <ChevronRight
                className="rotate-180 group-hover:-translate-x-1 transition-transform"
                size={20}
              />
            </button>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-8 h-[2px] bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-500">
                  Access Level // 04
                </span>
              </div>
              <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white">
                My <span className="text-blue-600">Archive</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Tactical Stat Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
          {[
            {
              label: "Network Rank",
              val: `#${userStats.rank}`,
              icon: Zap,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              label: "Data Streams",
              val: userStats.uploads,
              icon: CloudUpload,
              color: "text-purple-500",
              bg: "bg-purple-500/10",
            },
            {
              label: "Credit Load",
              val: userStats.points,
              icon: ShieldCheck,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Integrity",
              val: `${userStats.reputation}%`,
              icon: Activity,
              color: "text-orange-500",
              bg: "bg-orange-500/10",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="relative group bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 p-5 rounded-[2rem] overflow-hidden transition-all hover:border-blue-500/50 shadow-sm hover:shadow-blue-500/5 backdrop-blur-md"
            >
              <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-2 group-hover:text-blue-500 transition-colors">
                  {stat.label}
                </p>
                <div className="flex items-end justify-between">
                  <h4 className="text-3xl font-black italic tracking-tighter text-zinc-900 dark:text-white">
                    {stat.val}
                  </h4>
                  <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                </div>
              </div>
              {stat.label === "Integrity" && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-1000"
                  style={{ width: `${userStats.reputation}%` }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Main Records Area */}
        <div className="flex-grow flex flex-col min-h-0 bg-white dark:bg-white/[0.02] backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
          <div className="absolute top-6 right-10 text-[8px] font-black tracking-[0.5em] text-zinc-900 dark:text-white opacity-10 rotate-90 origin-right pointer-events-none">
            ARCHIVE_SYNC_PROTOCOL_V4
          </div>

          {/* Table Control Bar */}
          <div className="px-10 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 rounded-2xl">
                <Layers className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic text-zinc-900 dark:text-white leading-tight">
                  Stored Packets
                </h3>
                <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  Managing {myUploads.length} encrypted objects
                </p>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH ARCHIVE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-12 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 w-full sm:w-80 shadow-inner"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white opacity-30"
                size={16}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-600"></div>
                <div className="w-1 h-1 rounded-full bg-blue-600/40"></div>
              </div>
            </div>
          </div>

          {/* Table Headers */}
          <div className="px-10 py-4 border-y border-zinc-200 dark:border-white/5 flex items-center text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 bg-zinc-50/50 dark:bg-white/[0.02]">
            <span className="w-28 flex items-center gap-2">
              <Clock size={10} /> Hash ID
            </span>
            <span className="flex-grow">Identifier // Resource Title</span>
            <span className="w-32 text-center">Status</span>
            <span className="w-24 text-center">Payload</span>
            <span className="w-32 text-right">Uplink Date</span>
          </div>

          {/* Scrollable Body */}
          <div className="flex-grow overflow-y-auto custom-scrollbar px-4 py-2">
            {filteredUploads.length > 0 ? (
              filteredUploads.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center px-6 py-5 rounded-[1.5rem] mb-1 hover:bg-zinc-50 dark:hover:bg-blue-600/5 transition-all group/row border border-transparent hover:border-blue-500/20"
                >
                  <div className="w-28">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-600 group-hover:text-blue-500 transition-all">
                      {file.id}
                    </span>
                  </div>

                  <div className="flex-grow flex items-center gap-4">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover/row:bg-blue-600 group-hover/row:text-white group-hover/row:scale-110 transition-all duration-500 shadow-sm">
                        <FileText size={20} />
                      </div>
                      <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-zinc-900 dark:bg-blue-600 text-white text-[7px] font-bold rounded-md border border-white/10">
                        {file.type}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-black uppercase italic text-zinc-900 dark:text-white flex items-center gap-2 tracking-tight group-hover/row:text-blue-600 transition-colors">
                        {file.title}
                      </h4>
                      <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="text-blue-500/60 font-black">
                          {file.dept}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-white/20"></span>
                        <span>NODE_SECURED</span>
                      </p>
                    </div>
                  </div>

                  <div className="w-32 flex justify-center">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                        file.status === "Indexed"
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-500"
                          : "bg-orange-500/5 border-orange-500/20 text-orange-600 dark:text-orange-500 animate-pulse"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${file.status === "Indexed" ? "bg-emerald-500" : "bg-orange-500"}`}
                      ></div>
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {file.status}
                      </span>
                    </div>
                  </div>

                  <div className="w-24 text-center">
                    <span className="text-[11px] font-mono font-bold text-zinc-400 dark:text-zinc-500 group-hover/row:text-blue-600 transition-colors">
                      {file.size}
                    </span>
                  </div>

                  <div className="w-32 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[11px] font-black italic text-zinc-900 dark:text-white">
                        {file.date}
                      </span>
                      <div className="flex gap-2 opacity-0 translate-x-4 group-hover/row:opacity-100 group-hover/row:translate-x-0 transition-all duration-300">
                        <button className="p-1.5 text-zinc-500 hover:bg-blue-600 hover:text-white rounded-lg transition-colors dark:text-zinc-400">
                          <ExternalLink size={14} />
                        </button>
                        <button className="p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-lg transition-colors dark:text-zinc-400">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-6 border border-dashed border-zinc-300 dark:border-white/10">
                  <Lock
                    size={32}
                    className="text-zinc-300 dark:text-white opacity-20"
                  />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-white/20">
                  No Objects Found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Footer */}
        <div className="flex justify-between items-center px-6 mt-6 shrink-0">
          <div className="flex gap-10">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-lg bg-blue-600 border-2 border-white dark:border-[#030303] flex items-center justify-center text-[8px] font-bold text-white"
                  >
                    0{i}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Node Sync:{" "}
                <span className="text-blue-500">{userStats.syncStatus}</span>
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Encryption:{" "}
                <span className="text-zinc-900 dark:text-white">
                  AES-256-P2P
                </span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-mono text-zinc-400 dark:text-white opacity-40 uppercase tracking-tighter italic">
              SYS_TIME // {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

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
