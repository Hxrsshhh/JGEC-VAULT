"use client";

import React, { useState , useEffect } from "react";
import {
  Trophy,
  ChevronLeft,
  Medal,
  CloudUpload,
  Flame,
  Search,
  Zap,
  ShieldCheck,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LeaderboardView({ onBack }) {
  const [searchQuery, setSearchQuery] = useState("");

  const [leaderboardData, setLeaderboardData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Failed to load leaderboard");
      }
    }

    fetchLeaderboard();
  }, []);

  const filteredData = leaderboardData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRankColor = (rank) => {
    if (rank === 1)
      return "text-yellow-500 bg-yellow-400/10 border-yellow-400/20";
    if (rank === 2) return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    if (rank === 3)
      return "text-orange-500 bg-orange-400/10 border-orange-400/20";
    return "text-zinc-500 bg-zinc-500/10 border-zinc-500/10";
  };

  return (
    <div className="h-max-screen w-full flex flex-col bg-[#F8FAFC] dark:bg-black/10 transition-colors duration-500 font-sans selection:bg-blue-500/30">
      {/* 1. STICKY MOBILE HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 px-4 py-3 md:px-8 md:py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={()=>router.back()}
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 group active:scale-90"
            >
              <ChevronLeft
                className="text-zinc-600 dark:text-white"
                size={20}
              />
            </button>
            <div>
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white">
                Neural <span className="text-blue-600">Ranks.</span>
              </h2>
              <div className="flex items-center gap-1.5 -mt-1 md:mt-0">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Live_Network_v4
                </span>
              </div>
            </div>
          </div>

          <div className="relative group w-full md:w-72">
            <input
              type="text"
              placeholder="Filter contributors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-10 py-2.5 text-xs font-bold outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 shadow-inner"
            />
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              size={14}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 flex flex-col gap-8">
        {/* 2. CHAMPIONS CAROUSEL (MOBILE) / GRID (TABLET) */}
        <section>
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Trophy className="text-yellow-500" size={18} />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
              Current Leaders
            </h3>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-4 snap-x no-scrollbar scroll-smooth">
            {leaderboardData.slice(0, 3).map((user, i) => (
              <div
                key={i}
                className={`min-w-[85%] sm:min-w-[45%] md:min-w-0 flex-1 p-6 rounded-[2rem] border relative overflow-hidden group snap-center transition-all duration-500 ${
                  user.rank === 1
                    ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30"
                    : "bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 shadow-lg shadow-black/5"
                }`}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        user.rank === 1
                          ? "bg-white/20 border-white/30 text-white"
                          : "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-600"
                      }`}
                    >
                      {user.rank === 1 ? (
                        <Trophy size={20} />
                      ) : (
                        <Activity size={20} />
                      )}
                    </div>
                    <span
                      className={`text-4xl font-black italic opacity-20 tracking-tighter ${user.rank === 1 ? "text-white" : "text-zinc-900 dark:text-white"}`}
                    >
                      #{user.rank}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-black uppercase italic truncate ${user.rank === 1 ? "text-white" : "text-zinc-900 dark:text-white"}`}
                  >
                    {user.name}
                  </h3>
                  <p
                    className={`text-[9px] font-bold uppercase tracking-widest mb-6 ${user.rank === 1 ? "text-blue-100" : "text-zinc-400"}`}
                  >
                    {user.level} Level
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t pt-4 border-black/5 dark:border-white/10">
                    <div>
                      <p
                        className={`text-[8px] font-black uppercase opacity-60 mb-0.5 ${user.rank === 1 ? "text-white" : "text-zinc-500"}`}
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
                        className={`text-[8px] font-black uppercase opacity-60 mb-0.5 ${user.rank === 1 ? "text-white" : "text-zinc-500"}`}
                      >
                        Credits
                      </p>
                      <p
                        className={`text-lg font-black italic ${user.rank === 1 ? "text-white" : "text-zinc-900 dark:text-white"}`}
                      >
                        {user.points}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Visual Flair */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. RESPONSIVE DATA TABLE */}
        <section className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="hidden md:flex px-8 py-5 border-b border-zinc-100 dark:border-white/5 items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span className="w-16">Rank</span>
            <span className="flex-grow">Contributor</span>
            <span className="w-32 text-center">Uplinks</span>
            <span className="w-40 text-center">Protocol ID</span>
            <span className="w-32 text-right">Credits</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-white/5">
            {filteredData.length > 0 ? (
              filteredData.map((user, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row items-start md:items-center px-5 md:px-8 py-5 md:py-4 hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-all group cursor-pointer active:scale-[0.98] md:active:scale-100"
                >
                  {/* Top line (Mobile) / Left Side (Desktop) */}
                  <div className="flex items-center w-full md:w-auto flex-grow gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`text-[10px] font-black italic w-7 h-7 flex items-center justify-center rounded-lg border ${getRankColor(user.rank)}`}
                      >
                        {user.rank}
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center border border-zinc-200 dark:border-white/10 font-black text-xs text-zinc-400 uppercase">
                        {user.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase italic text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {user.name}
                        </h4>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                          {user.level}
                        </p>
                      </div>
                    </div>

                    {/* Badge for mobile visible only */}
                    <div className="md:hidden ml-auto">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-black italic text-sm">
                        <ShieldCheck size={14} />
                        {user.points}
                      </div>
                    </div>
                  </div>

                  {/* Secondary info (Mobile row 2) */}
                  <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-zinc-100 dark:border-white/5 md:border-t-0">
                    <div className="md:w-32 flex flex-col md:items-center">
                      <span className="md:hidden text-[8px] font-bold text-zinc-400 uppercase mb-1">
                        Uplinks
                      </span>
                      <div className="flex items-center gap-2">
                        <CloudUpload
                          size={14}
                          className="text-blue-500 opacity-60"
                        />
                        <span className="text-sm font-black italic dark:text-white">
                          {user.uploads}
                        </span>
                      </div>
                    </div>

                    <div className="hidden lg:block w-40 text-center">
                      <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded-md">
                        {user.name.toUpperCase()}_v4
                      </span>
                    </div>

                    <div className="hidden md:block md:w-32 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-blue-600 dark:text-blue-400 font-black italic">
                        <ShieldCheck size={14} />
                        {user.points}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center opacity-30">
                <Search size={40} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Zero Nodes Found
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
