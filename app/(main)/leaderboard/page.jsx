"use client";

import React, { useState } from "react";
import {
  Trophy,
  ChevronRight,
  Medal,
  CloudUpload,
  Flame,
  Search,
  Zap,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function LeaderboardView({ onBack, theme }) {
  const [searchQuery, setSearchQuery] = useState("");

  const leaderboardData = [
    {
      rank: 1,
      name: "Neural_Drift",
      uploads: 142,
      points: 2840,
      level: "Elite",
      badge: "Gold",
    },
    {
      rank: 2,
      name: "Cypher_X",
      uploads: 128,
      points: 2560,
      level: "Elite",
      badge: "Silver",
    },
    {
      rank: 3,
      name: "Protocol_Zero",
      uploads: 95,
      points: 1900,
      level: "Veteran",
      badge: "Bronze",
    },
    {
      rank: 4,
      name: "Kernel_Panic",
      uploads: 76,
      points: 1520,
      level: "Veteran",
      badge: null,
    },
    {
      rank: 5,
      name: "Data_Ghost",
      uploads: 64,
      points: 1280,
      level: "Contributor",
      badge: null,
    },
    {
      rank: 6,
      name: "Void_Walker",
      uploads: 59,
      points: 1180,
      level: "Contributor",
      badge: null,
    },
    {
      rank: 7,
      name: "Binary_Soul",
      uploads: 42,
      points: 840,
      level: "Aspirant",
      badge: null,
    },
    {
      rank: 8,
      name: "Sync_Master",
      uploads: 38,
      points: 760,
      level: "Aspirant",
      badge: null,
    },
    {
      rank: 9,
      name: "Logic_Gate",
      uploads: 21,
      points: 420,
      level: "Junior",
      badge: null,
    },
    {
      rank: 10,
      name: "Root_Access",
      uploads: 15,
      points: 300,
      level: "Junior",
      badge: null,
    },
  ];

  const filteredData = leaderboardData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRankColor = (rank) => {
    if (rank === 1)
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    if (rank === 2) return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    if (rank === 3)
      return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    return "text-zinc-500 bg-zinc-500/10 border-zinc-500/10";
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white dark:bg-[#030303] transition-colors duration-500">
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col h-full py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 group active:scale-95 text-zinc-900 dark:text-white"
            >
              <ChevronRight
                className="rotate-180 group-hover:-translate-x-1 transition-transform"
                size={20}
              />
            </button>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-6 h-[2px] bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-500">
                  Directory Level 04
                </span>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white">
                Neural <span className="text-blue-600">Ranks.</span>
              </h2>
            </div>
          </div>

          <div className="relative group">
            <input
              type="text"
              placeholder="SEARCH CONTRIBUTOR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-10 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 w-64 shadow-sm"
            />
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white opacity-30"
              size={14}
            />
          </div>
        </div>

        {/* Top 3 Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
          {leaderboardData.slice(0, 3).map((user, i) => (
            <div
              key={i}
              className={`p-6 rounded-[2.5rem] border relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 ${
                user.rank === 1
                  ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20"
                  : "bg-white dark:bg-white/[0.03] border-zinc-200 dark:border-white/10 backdrop-blur-md shadow-lg shadow-black/5"
              }`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      user.rank === 1
                        ? "bg-white/20 border-white/30 text-white"
                        : "bg-blue-600/10 border-blue-600/20 text-blue-600"
                    }`}
                  >
                    {user.rank === 1 ? (
                      <Trophy size={20} />
                    ) : user.rank === 2 ? (
                      <Medal size={20} />
                    ) : (
                      <Zap size={20} />
                    )}
                  </div>
                  <span
                    className={`text-[40px] font-black italic opacity-20 tracking-tighter leading-none ${user.rank === 1 ? "text-white" : "text-zinc-900 dark:text-white"}`}
                  >
                    0{user.rank}
                  </span>
                </div>
                <h3
                  className={`text-xl font-black uppercase italic mb-1 ${user.rank === 1 ? "text-white" : "text-zinc-900 dark:text-white"}`}
                >
                  {user.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      user.rank === 1
                        ? "bg-white/20 text-white"
                        : "bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {user.level} Level
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-4 border-black/5 dark:border-white/10">
                  <div>
                    <p
                      className={`text-[8px] font-black uppercase tracking-widest opacity-60 ${user.rank === 1 ? "text-white" : "text-zinc-400 dark:text-zinc-500"}`}
                    >
                      Uplinks
                    </p>
                    <p
                      className={`text-lg font-black italic ${user.rank === 1 ? "text-white" : "text-blue-600"}`}
                    >
                      {user.uploads}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-[8px] font-black uppercase tracking-widest opacity-60 ${user.rank === 1 ? "text-white" : "text-zinc-400 dark:text-zinc-500"}`}
                    >
                      Points
                    </p>
                    <p
                      className={`text-lg font-black italic ${user.rank === 1 ? "text-white" : "text-zinc-900 dark:text-white"}`}
                    >
                      {user.points}
                    </p>
                  </div>
                </div>
              </div>
              {/* Abstract Watermark Shape */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-current opacity-[0.05] rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            </div>
          ))}
        </div>

        {/* Main List Table */}
        <div className="flex-grow bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col mb-6 shadow-2xl shadow-black/5 backdrop-blur-xl relative">
          <div className="absolute top-4 right-8 text-[7px] font-black tracking-widest opacity-10 rotate-90 origin-right text-zinc-900 dark:text-white">
            NODE_RANKING_V4
          </div>

          {/* Table Header */}
          <div className="px-8 py-4 border-b border-zinc-200 dark:border-white/5 flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            <span className="w-12">Rank</span>
            <span className="flex-grow">Contributor</span>
            <span className="w-32 text-center">Uplinks</span>
            <span className="w-32 text-center">Protocol</span>
            <span className="w-32 text-right">Credits</span>
          </div>

          {/* Scrollable List Body */}
          <div className="flex-grow overflow-y-auto custom-scrollbar px-4 py-2">
            {filteredData.length > 0 ? (
              filteredData.map((user, i) => (
                <div
                  key={i}
                  className="flex items-center px-4 py-3.5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-all group/row cursor-default border border-transparent hover:border-zinc-200 dark:hover:border-white/5"
                >
                  <div className="w-12">
                    <span
                      className={`text-xs font-black italic w-7 h-7 flex items-center justify-center rounded-lg border ${getRankColor(user.rank)}`}
                    >
                      {user.rank}
                    </span>
                  </div>

                  <div className="flex-grow flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center border border-zinc-200 dark:border-white/10 overflow-hidden text-zinc-900 dark:text-white">
                      <span className="text-[10px] font-black opacity-40">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase italic text-zinc-900 dark:text-white group-hover/row:text-blue-600 transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-600 tracking-widest uppercase">
                        {user.level}
                      </p>
                    </div>
                  </div>

                  <div className="w-32 flex flex-col items-center">
                    <div className="flex items-center gap-1.5">
                      <CloudUpload
                        size={12}
                        className="text-blue-600 opacity-50"
                      />
                      <span className="text-xs font-black italic text-zinc-900 dark:text-white">
                        {user.uploads}
                      </span>
                    </div>
                    <div className="w-16 h-1 bg-zinc-100 dark:bg-white/10 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${Math.min((user.uploads / 150) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="w-32 text-center">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-white/40 uppercase px-2 py-1 rounded bg-zinc-100 dark:bg-white/5">
                      V4_DATA_{user.rank * 101}
                    </span>
                  </div>

                  <div className="w-32 text-right">
                    <div className="flex items-center justify-end gap-1 text-blue-600 dark:text-blue-400">
                      <ShieldCheck size={12} />
                      <span className="text-sm font-black italic">
                        {user.points}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 text-zinc-900 dark:text-white">
                <Search size={48} className="mb-4" />
                <p className="text-sm font-black uppercase tracking-widest">
                  No Contributor Found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Global Stats Footer */}
        <div className="flex justify-between items-center px-4 shrink-0">
          <div className="flex gap-10">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Global Pool:{" "}
                <span className="text-zinc-900 dark:text-white">
                  14.2k Docs
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Flame size={14} className="text-orange-500" />
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Active Nodes:{" "}
                <span className="text-zinc-900 dark:text-white">1,024</span>
              </p>
            </div>
          </div>
          <p className="text-[8px] font-mono text-zinc-400 dark:text-white opacity-30">
            ENCRYPTED_SYNC_STABLE // {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 10px; }
  `,
        }}
      />
    </div>
  );
}
