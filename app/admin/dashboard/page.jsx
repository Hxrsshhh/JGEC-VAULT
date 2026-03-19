"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  ShieldCheck,
  Search,
  Bell,
  ArrowUpRight,
  Eye,
  Activity,
  Menu,
  ChevronRight,
  Database,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = async (url) => {
  const res = await fetch(url);
  const text = await res.text();
  return JSON.parse(text);
};

export default function AdminDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading, error } = useSWR("/api/admin/dashboard", fetcher);

  if (isLoading) {
    return (
      <div className="h-screen bg-black/10 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">
          Initializing Terminal...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-400">
        Failed to load dashboard
      </div>
    );
  }

  const stats = data?.stats || {};
  const papers = data?.papers || [];

  const dashboardStats = [
    {
      label: "Total Papers",
      value: stats.totalPapers || 0,
      icon: <FileText />,
      color: "text-blue-400",
      glow: "bg-blue-500/20",
    },
    {
      label: "Approved",
      value: stats.approvedPapers || 0,
      icon: <ShieldCheck />,
      color: "text-emerald-400",
      glow: "bg-emerald-500/20",
    },
    {
      label: "Pending",
      value: stats.pendingPapers || 0,
      icon: <Activity />,
      color: "text-amber-400",
      glow: "bg-amber-500/20",
    },
    {
      label: "Active Users",
      value: stats.totalUsers || 0,
      icon: <Users />,
      color: "text-indigo-400",
      glow: "bg-indigo-500/20",
    },
  ];

  return (
    // Fixed height h-screen and hidden overflow to prevent body scroll
    <div className="h-max-screen lg:mt-20 bg-black/10 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden flex">
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Scrollable Body Container */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          {/* Centered w-7xl wrapper */}
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Title Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">
                  Control <span className="text-blue-500">Center</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-blue-500/50" />
                  Auth_Level: ROOT_ADMIN{" "}
                  <span className="text-blue-500/30">|</span>{" "}
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20">
                  Report
                </button>
                <button className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Logs
                </button>
              </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((stat, i) => (
                <div
                  key={i}
                  className="group relative bg-slate-900/40 border border-white/5 p-6 rounded-3xl hover:border-blue-500/40 transition-all overflow-hidden"
                >
                  <div
                    className={`absolute -top-10 -right-10 w-24 h-24 blur-2xl opacity-20 transition-opacity group-hover:opacity-40 rounded-full ${stat.glow}`}
                  />
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div
                      className={`p-3 rounded-xl bg-slate-950 border border-white/10 ${stat.color}`}
                    >
                      {React.cloneElement(stat.icon, { size: 20 })}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-black tracking-tighter tabular-nums text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-8">
              {/* Latest Submissions Panel */}
              <div className="xl:col-span-2 bg-slate-900/40 border border-white/5 rounded-4xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[11px] font-black uppercase italic tracking-widest flex items-center gap-3 text-white">
                    <div className="w-1 h-4 bg-blue-500 rounded-full" />
                    Live Repository Feed
                  </h3>
                  <button className="text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {papers.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center border ${p.isApproved ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-400"}`}
                        >
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-100 uppercase tracking-tight line-clamp-1">
                            {p.title}
                          </p>
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">
                            {p.subjectCode} • {p.department}
                          </p>
                        </div>
                      </div>
                      <Link href={`/admin/aprovels`}>
                        <button className="p-2 rounded-lg bg-slate-950 border border-white/5 text-slate-400 hover:text-blue-400">
                          <ChevronRight size={16} />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security/Systems Panel */}
              <div className="bg-slate-900/40 border border-white/5 rounded-4xl p-6 backdrop-blur-md">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-3">
                  <Activity size={16} className="text-blue-500" /> Core_Monitor
                </h3>

                <div className="space-y-6">
                  {[
                    { label: "Stability", val: 98, color: "bg-blue-500" },
                    { label: "Storage", val: 42, color: "bg-indigo-500" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {m.label}
                        </span>
                        <span className="text-[9px] font-mono text-white">
                          {m.val}%
                        </span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${m.color}`}
                          style={{ width: `${m.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-xl bg-blue-600/5 border border-blue-500/20">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">
                    Status Report
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    Encryption layers active. Node sync complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
