"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  FileText,
  ShieldCheck,
  CloudUpload,
  Zap,
  ExternalLink,
  Lock,
  Search,
  MoreVertical,
  Activity,
  Database,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyArchiveView({ session, onBack }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [userStats, setUserStats] = useState(null);

  const [myUploads, setMyUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUploads() {
      try {
        const res = await fetch("/api/my-uploads");
        const data = await res.json();
        setMyUploads(data);
      } catch (err) {
        console.error("Failed to load uploads");
      } finally {
        setLoading(false);
      }
    }

    fetchUploads();
  }, []);
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/user/stats");
        const data = await res.json();
        setUserStats(data);
      } catch (err) {
        console.error("Failed to load stats");
      }
    }

    fetchStats();
  }, []);

  const filteredUploads = myUploads.filter((file) =>
    file.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!userStats) {
    return (
      <div className="h-screen flex items-center justify-center text-sm font-bold">
        Loading Archive...
      </div>
    );
  }

  return (
    <div className="h-max-screen w-full flex flex-col bg-white/10 dark:bg-black/10  font-sans ">
      {/* 1. ADAPTIVE HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/30 dark:bg-black/60 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 group active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white">
                My <span className="text-blue-600">Archive.</span>
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-blue-600/80">
                  NODE_{userStats.role.toUpperCase()}_v4
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative w-72">
            <input
              type="text"
              placeholder="SEARCH OBJECTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-10 py-2.5 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900 dark:text-white"
            />
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              size={14}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 flex flex-col gap-6">
        {/* 2. STATS GRID */}
        <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar snap-x">
          {[
            {
              label: "Identity",
              val: userStats.name.split(" ")[0],
              icon: Zap,
              color: "text-blue-500",
            },
            {
              label: "Uplinks",
              val: userStats.uploadsCount,
              icon: CloudUpload,
              color: "text-purple-500",
            },
            {
              label: "Credits",
              val: userStats.points,
              icon: ShieldCheck,
              color: "text-emerald-500",
            },
            {
              label: "Downloads",
              val: userStats.downloadsCount,
              icon: Activity,
              color: "text-orange-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="min-w-35 flex-1 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 p-4 rounded-2xl snap-center"
            >
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                {stat.label}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black italic text-zinc-900 dark:text-white">
                  {stat.val}
                </span>
                <stat.icon size={14} className={stat.color} />
              </div>
            </div>
          ))}
        </div>

        {/* 3. MOBILE SEARCH BAR */}
        <div className="md:hidden relative">
          <input
            type="text"
            placeholder="FILTER ARCHIVE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-10 py-3 text-xs font-bold uppercase tracking-widest outline-none text-zinc-900 dark:text-white shadow-sm"
          />
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            size={16}
          />
        </div>

        {/* 4. RECORDS CONTAINER */}
        <div className="bg-white dark:bg-white/2 border border-zinc-200 dark:border-white/10 rounded-4xl overflow-hidden shadow-xl backdrop-blur-xl">
          <div className="hidden md:flex px-8 py-4 border-b border-zinc-100 dark:border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
            <span className="w-24">Hash ID</span>
            <span className="grow">Identifier</span>
            <span className="w-32 text-center">Status</span>
            <span className="w-24 text-center">Size</span>
            <span className="w-32 text-right">Timestamp</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-white/5">
            {loading ? (
              <div className="py-20 text-center text-sm font-bold opacity-50">
                Syncing Archive...
              </div>
            ) : filteredUploads.length > 0 ? (
              filteredUploads.map((file, i) => (
                <div
                  key={i}
                  className="group flex flex-col md:flex-row md:items-center px-5 py-5 md:px-8 md:py-4 hover:bg-zinc-50 dark:hover:bg-blue-600/5 transition-all cursor-pointer active:scale-[0.98] md:active:scale-100"
                >
                  <div className="flex items-center gap-4 grow">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <FileText size={22} />
                      </div>
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-zinc-900 dark:bg-blue-600 text-[7px] font-bold text-white rounded-md border border-white/10">
                        {file.type}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="md:hidden text-[8px] font-mono text-blue-600 dark:text-blue-500 font-bold tracking-tighter">
                          {file.id}
                        </span>
                        <h4 className="text-sm font-black uppercase italic text-zinc-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                          {file.title}
                        </h4>
                      </div>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        {file.dept}{" "}
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>{" "}
                        SECURED_NODE
                      </p>
                    </div>

                    <button className="md:hidden ml-auto p-2 text-zinc-400">
                      <ExternalLink size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-zinc-100 dark:border-white/5 md:border-t-0">
                    <div className="hidden md:block w-24 text-[10px] font-mono text-zinc-400">
                      {file.id}
                    </div>

                    <div className="w-auto md:w-32 flex justify-start md:justify-center">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                          file.status === "Indexed"
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600"
                            : "bg-orange-500/5 border-orange-500/20 text-orange-600 animate-pulse"
                        }`}
                      >
                        {file.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 md:w-56 justify-end">
                      <span className="text-[10px] font-mono font-bold text-zinc-400">
                        {file.size}
                      </span>
                      <span className="hidden md:block text-[10px] font-black italic text-zinc-900 dark:text-white w-24 text-right">
                        {file.createdAt}
                      </span>
                      <div className="hidden md:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-blue-600 hover:text-white rounded-lg transition-all">
                          <ArrowUpRight size={14} />
                        </button>
                        <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-lg transition-all">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none"></div>

                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-50 dark:bg-white/5 border border-dashed border-zinc-300 dark:border-white/10 flex items-center justify-center relative">
                    <Database
                      size={32}
                      className="text-zinc-200 dark:text-white/10"
                    />
                    <div className="absolute inset-0 border-2 border-blue-500/20 rounded-[2.5rem] animate-[ping_3s_linear_infinite]"></div>
                  </div>
                  <Lock
                    size={16}
                    className="absolute -bottom-1 -right-1 text-blue-600"
                  />
                </div>

                <h3 className="text-xl font-black uppercase italic text-zinc-900 dark:text-white mb-2 tracking-tighter">
                  Archive <span className="text-blue-600">Vacuum</span> Detected
                </h3>
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] max-w-60 leading-relaxed">
                  No objects linked to node {userStats.name.toUpperCase()}.
                  Start an uplink to populate.
                </p>

                <Link href="/uploadPaper">
                  <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/25">
                    <CloudUpload size={16} />
                    Initiate Uplink
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 6. TACTICAL FOOTER */}
      <footer className="mt-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
        <div className="flex items-center gap-6">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
            Node_Status:{" "}
            <span className="text-blue-600">
              {userStats.status.toUpperCase()}
            </span>
          </p>
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
            Registry:{" "}
            <span className="text-zinc-900 dark:text-white">
              USER_{userStats.role.toUpperCase()}
            </span>
          </p>
        </div>
        <p className="text-[8px] font-mono text-zinc-400 uppercase tracking-tighter">
          SYSTEM_ID: {userStats.name.substring(0, 3).toUpperCase()}_ARC_
          {userStats.uploadsCount}
        </p>
      </footer>
    </div>
  );
}
