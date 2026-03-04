"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Database,
  LayoutGrid,
  TrendingUp,
  Menu,
  X,
  Settings,
  Plus,
  Trash2,
  FileText,
  Users,
  ShieldCheck,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  UserCheck,
  Cpu,
  ArrowUpRight,
  Filter,
  MoreVertical,
  Activity,
  AlertTriangle,
  Zap,
  ChevronDown,
  Download,
  ExternalLink,
  Info,
  Calendar,
  BookOpen,
  User,
  ShieldAlert,
  Hash,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
} from "lucide-react";
import BackgroundDesign from "../components/BackgroundDesign";
import Header from "../components/Header";
import Image from "next/image";
import { toast } from "sonner";

import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch");
  return data;
};

const App = () => {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [previewPaper, setPreviewPaper] = useState(null);

  const [actionLoading, setActionLoading] = useState(null);
  const [isLoadingPaper, setIsLoadingPaper] = useState(true);

  const {
    data: papers = [],
    error: papersError,
    isLoading: loadingPapers,
    mutate: mutatePapers,
  } = useSWR("/api/admin/papers", fetcher);

  const {
    data: users = [],
    error: usersError,
    isLoading: loadingUsers,
    mutate: mutateUsers,
  } = useSWR("/api/admin/users", fetcher);

  // Filter State (Vault)
  const [vaultSearch, setVaultSearch] = useState("");
  const [filters, setFilters] = useState({
    department: "All",
    academicYear: "All",
    semester: "All",
    examType: "All",
    examYear: "All",
  });

  // --- HANDLERS ---
  const handleApprove = async (id) => {
    try {
      setActionLoading(id);

      const res = await fetch(`/api/admin/papers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      mutatePapers((prev) => prev.map((p) => (p._id === id ? data : p)), false);
      toast.success("Paper approved successfully");
    } catch (err) {
      toast.error(err.message || "Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);

      const res = await fetch(`/api/admin/papers/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      mutatePapers((prev) => prev.filter((p) => p._id !== id), false);
      toast.success("Paper archived");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlockUser = async (id, currentStatus) => {
    try {
      setActionLoading(id);

      const newStatus = currentStatus === "active" ? "blocked" : "active";

      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      mutateUsers((prev) => prev.map((u) => (u._id === id ? data : u)), false);
      toast.success(`User ${newStatus}`);
    } catch (err) {
      toast.error("User update failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // --- SELECTORS ---
  const pendingPapers = useMemo(
    () => papers.filter((p) => !p.isApproved),
    [papers],
  );

  const filteredVaultPapers = useMemo(() => {
    return papers.filter((p) => {
      const matchesSearch =
        (p.title || "").toLowerCase().includes(vaultSearch.toLowerCase()) ||
        (p.subjectCode || "")
          .toLowerCase()
          .includes(vaultSearch.toLowerCase()) ||
        (p.uploadedBy?.name || "")
          .toLowerCase()
          .includes(vaultSearch.toLowerCase());

      const matchesDept =
        filters.department === "All" || p.department === filters.department;
      const matchesYear =
        filters.academicYear === "All" ||
        p.academicYear.toString() === filters.academicYear;
      const matchesSem =
        filters.semester === "All" ||
        p.semester.toString() === filters.semester;
      const matchesType =
        filters.examType === "All" || p.examType === filters.examType;
      const matchesExamYear =
        filters.examYear === "All" ||
        p.examYear.toString() === filters.examYear;

      return (
        matchesSearch &&
        matchesDept &&
        matchesYear &&
        matchesSem &&
        matchesType &&
        matchesExamYear
      );
    });
  }, [papers, vaultSearch, filters]);

  const dashboardStats = [
    {
      label: "Total Papers",
      value: papers.length,
      icon: <FileText size={18} />,
      color: "text-blue-500",
    },
    {
      label: "Pending Approval",
      value: pendingPapers.length,
      icon: <Clock size={18} />,
      color: "text-amber-500",
    },
    {
      label: "Total Users",
      value: users.length,
      icon: <Users size={18} />,
      color: "text-purple-500",
    },
    {
      label: "System Points",
      value: users.reduce((a, b) => a + (b.points || 0), 0),
      icon: <Zap size={18} />,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-black/10 text-slate-200 font-sans flex overflow-hidden">
      <BackgroundDesign />
      {/* Sidebar */}
      <aside
        className={`
    ${isSidebarOpen ? "w-82" : "w-24"} 
    transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
    border-r border-white/5 bg-slate-950/20  
    flex flex-col shrink-0 z-40 relative h-screen overflow-visible
  `}
      >
        {/* Header Section: Terminal Identity */}

        <div
          className={`p-8 mb-4 flex items-center transition-all duration-500 ${
            isSidebarOpen ? "gap-5" : "justify-center"
          }`}
        >
          <div className="relative group shrink-0">
            {/* Outer spinning ring for active feel */}
            <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
            <Image src={`/logo1.webp`} height={60} width={60} alt="Logo" />
            {/* Small online pulse dot */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>

          {isSidebarOpen && (
            <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
              <h1 className="font-black uppercase tracking-tighter text-xl italic leading-none text-white flex items-center gap-2">
                JGEC{" "}
                <span className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
                  Vault
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-slate-500 font-black tracking-[0.3em] uppercase">
                  Admin v4.2.0
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Section: Command Nodes */}
        <nav className="flex-1 px-4 space-y-3 py-6 overflow-y-auto no-scrollbar">
          {[
            {
              id: "overview",
              label: "Dashboard",
              icon: <LayoutGrid size={22} />,
            },
            {
              id: "approvals",
              label: "Approvals",
              icon: <CheckCircle size={22} />,
              badge: pendingPapers.length,
            },
            { id: "vault", label: "Paper Vault", icon: <FileText size={22} /> },
            { id: "users", label: "Users", icon: <Users size={22} /> },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
            group w-full flex items-center rounded-2xl transition-all duration-500 relative
            ${isSidebarOpen ? "px-5 py-4 gap-5" : "justify-center py-5"}
            ${
              isActive
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.05)]"
                : "text-slate-500 hover:bg-white/3 hover:text-slate-200 border border-transparent"
            }
          `}
              >
                {/* Active Indicator: Laser Line */}
                {isActive && (
                  <div className="absolute -left-1 top-4 bottom-4 w-1 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                )}

                <div
                  className={`relative transition-all duration-500 ${
                    isActive
                      ? "scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                      : "group-hover:scale-110 group-hover:text-slate-300"
                  }`}
                >
                  {item.icon}

                  {/* Notification Alert */}
                  {item.badge > 0 && (
                    <span
                      className={`
                  absolute flex items-center justify-center bg-amber-500 text-black text-[10px] font-black rounded-lg ring-[3px] ring-slate-950
                  ${
                    isSidebarOpen
                      ? "-top-3 -right-3 px-2 py-0.5"
                      : "-top-2.5 -right-2.5 h-5 w-5"
                  }
                  animate-bounce shadow-lg
                `}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {isSidebarOpen ? (
                  <span
                    className={`text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-500 ${isActive ? "text-blue-400" : "text-slate-400"}`}
                  >
                    {item.label}
                  </span>
                ) : (
                  /* Futuristic Tooltip */
                  <div className="absolute left-24 bg-slate-900 border border-white/10 text-white text-[10px] px-4 py-2.5 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-3.75 group-hover:translate-x-0 whitespace-nowrap z-100 font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {item.label}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Section: Session Controls */}
        <div className="p-6 mt-auto">
          <div className={`p-2 bg-white/2 border border-white/5 rounded-3xl`}>
            <button
              className={`
          w-full flex items-center rounded-2xl transition-all duration-300 group
          text-red-500/60 hover:text-white hover:bg-red-500 shadow-sm
          ${isSidebarOpen ? "px-5 py-4 gap-5" : "justify-center py-5"}
        `}
            >
              <LogOut
                size={20}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              {isSidebarOpen && (
                <span className="text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                  Terminate Session
                </span>
              )}
            </button>

            {isSidebarOpen && (
              <div className="mt-4 px-4 pb-2 text-center">
                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em]">
                  Secure Connection Verified
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col h-screen w-7xl overflow-hidden relative ">
        {/* Header */}
        {/* <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 z-10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:block text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
              JGEC Vault Control Center / {activeTab}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-tight">
                System_Admin
              </p>
              <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">
                Access: Level 0
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <ShieldCheck size={20} className="text-blue-500" />
            </div>
          </div>
        </header> */}
        <Header />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pt-6 space-y-8 custom-scrollbar ">
          {/* Dashboard View */}
          {activeTab === "overview" && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Top Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, i) => (
                  <div
                    key={i}
                    className="relative bg-slate-900/40 border border-white/5 p-7 rounded-4xl hover:border-blue-500/40 transition-all group overflow-hidden"
                  >
                    {/* Decorative Background Glow */}
                    <div
                      className={`absolute -top-10 -right-10 w-32 h-32 blur-[50px] opacity-10 transition-opacity group-hover:opacity-20 rounded-full ${stat.color.includes("blue") ? "bg-blue-500" : "bg-amber-500"}`}
                    />

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div
                        className={`p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 ${stat.color}`}
                      >
                        {React.cloneElement(stat.icon, { size: 22 })}
                      </div>
                      <div className="flex flex-col items-end">
                        <ArrowUpRight
                          size={14}
                          className="text-slate-500 group-hover:text-blue-400 transition-colors"
                        />
                        <span className="text-[8px] font-bold text-emerald-500 tracking-tighter mt-1">
                          +12.5%
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
                        {stat.label}
                      </p>
                      <p className="text-4xl font-black tracking-tighter tabular-nums text-white">
                        {stat.value}
                      </p>
                    </div>

                    {/* Large Background Icon Ghost */}
                    <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
                      {React.cloneElement(stat.icon, { size: 120 })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Latest Submissions Panel */}
                <div className="xl:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />

                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black uppercase italic tracking-widest flex items-center gap-3 text-blue-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                      Latest Terminal Activity
                    </h3>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                      View Archive [F4]
                    </button>
                  </div>

                  <div className="space-y-3">
                    {papers.slice(0, 5).map((p) => (
                      <div
                        key={p._id}
                        className="flex items-center justify-between p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group cursor-pointer"
                        onClick={() => setPreviewPaper(p)}
                      >
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div
                              className={`w-3 h-3 rounded-full ${p.isApproved ? "bg-emerald-500" : "bg-amber-500"} shadow-[0_0_12px_rgba(0,0,0,0.5)]`}
                            />
                            <div
                              className={`absolute inset-0 rounded-full animate-pulse ${p.isApproved ? "bg-emerald-500/40" : "bg-amber-500/40"}`}
                            />
                          </div>

                          <div>
                            <p className="text-[12px] font-black uppercase tracking-tight text-slate-100 group-hover:text-blue-400 transition-colors">
                              {p.title}
                            </p>
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.15em] mt-0.5">
                              {p.subjectCode}{" "}
                              <span className="mx-2 opacity-20">|</span>{" "}
                              {p.department}{" "}
                              <span className="mx-2 opacity-20">|</span>
                              <span className="text-slate-400">
                                {" "}
                                {p.uploadedBy?.name ?? "Unknown"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-[9px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            0x{p._id.slice(-4)}
                          </span>
                          <div className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all text-blue-400">
                            <Eye size={16} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security/Systems Panel */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col backdrop-blur-md relative h-full group hover:border-blue-500/20 transition-all duration-500">
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                      <Activity size={16} className="text-blue-500" />
                      Global Analytics
                    </h3>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-blue-500/40 rounded-full" />
                    </div>
                  </div>

                  {/* Main Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/3 border border-white/5 rounded-3xl p-6 hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                          <UploadCloud size={18} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                          Inbound
                        </span>
                      </div>
                      <p className="text-3xl font-black italic tracking-tighter text-white tabular-nums">
                        {users
                          .reduce((acc, curr) => acc + curr.uploadsCount, 0)
                          .toLocaleString()}
                      </p>
                      <p className="text-[8px] font-bold text-blue-500 uppercase mt-1 tracking-tighter">
                        Total Assets
                      </p>
                    </div>

                    <div className="bg-white/3 border border-white/5 rounded-3xl p-6 hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                          <DownloadCloud size={18} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                          Outbound
                        </span>
                      </div>
                      <p className="text-3xl font-black italic tracking-tighter text-white tabular-nums">
                        {/* Sum of all downloads from all papers */}
                        {papers
                          .reduce((acc, curr) => acc + curr.downloadsCount, 0)
                          .toLocaleString()}
                      </p>
                      <p className="text-[8px] font-bold text-emerald-500 uppercase mt-1 tracking-tighter">
                        Total Requests
                      </p>
                    </div>
                  </div>

                  {/* Secondary Metadata Nodes */}
                  <div className="space-y-4 flex-1">
                    {[
                      {
                        label: "Active Nodes",
                        val: users.filter((u) => u.status === "active").length,
                        total: users.length,
                        color: "text-blue-400",
                      },
                      {
                        label: "Storage Load",
                        val: "42",
                        total: 100,
                        color: "text-slate-400",
                        suffix: "%",
                      },
                      {
                        label: "Pending Auth",
                        val: pendingPapers.length,
                        total: 50,
                        color: "text-amber-500",
                      },
                    ].map((node, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-6 py-4 bg-white/2 border border-white/5 rounded-2xl group/node hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${node.color} bg-current shadow-[0_0_8px_currentColor]`}
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/node:text-slate-300 transition-colors">
                            {node.label}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-xs font-black italic ${node.color}`}
                          >
                            {node.val}
                            {node.suffix || ""}
                          </span>
                          <span className="text-[9px] font-bold text-slate-700">
                            / {node.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* System Status Footer */}
                  <div className="mt-8 p-5 rounded-3xl bg-blue-600/5 border border-blue-500/20 group-hover:bg-blue-600/10 transition-all overflow-hidden relative">
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <RefreshCw size={14} className="animate-spin-slow" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                            Sync Status
                          </p>
                          <p className="text-[8px] text-blue-500/50 uppercase font-bold tracking-tighter">
                            Real-time Stream: Active
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-mono text-blue-400 font-bold tracking-tighter">
                          32ms
                        </p>
                        <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest leading-none">
                          Latency
                        </p>
                      </div>
                    </div>
                    {/* Moving scanline */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paper Vault View */}
          {activeTab === "vault" && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mb-4">
              {/* Header & Search Bar */}
              <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 bg-slate-900/20 p-8 rounded-[3rem] border border-white/5 backdrop-blur-md">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                    Paper <span className="text-blue-500">Vault</span>
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em]">
                        Storage Engine Active
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-700">/</span>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                      {filteredVaultPapers.length} Documents Encrypted
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-4 items-center w-full xl:max-w-2xl">
                  <div className="relative w-full group">
                    <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <Search
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:text-blue-400 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="ENCRYPTED SEARCH: TITLE, CODE, OR UPLOADER..."
                      value={vaultSearch}
                      onChange={(e) => setVaultSearch(e.target.value)}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-[12px] font-bold tracking-widest outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-700 uppercase"
                    />
                  </div>
                  <button
                    onClick={() =>
                      setFilters({
                        department: "All",
                        academicYear: "All",
                        semester: "All",
                        examType: "All",
                        examYear: "All",
                      })
                    }
                    className="group p-5 bg-red-500/5 rounded-2xl border border-red-500/10 hover:border-red-500/40 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-all active:scale-95"
                    title="Reset All Filters"
                  >
                    <XCircle size={22} />
                  </button>
                </div>
              </div>

              {/* Integrated Filters Panel */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-2">
                {[
                  {
                    key: "department",
                    label: "Department",
                    options: ["All", "CSE", "ECE", "ME", "EE", "CE", "IT"],
                  },
                  {
                    key: "academicYear",
                    label: "Year Level",
                    options: ["All", "1", "2", "3", "4"],
                  },
                  {
                    key: "semester",
                    label: "Term",
                    options: ["All", "1", "2", "3", "4", "5", "6", "7", "8"],
                  },
                  {
                    key: "examType",
                    label: "Exam Type",
                    options: ["All", "Mid", "End", "Supple"],
                  },
                  {
                    key: "examYear",
                    label: "Release",
                    options: [
                      "All",
                      "2026",
                      "2025",
                      "2024",
                      "2023",
                      "2022",
                      "2021",
                      "2020",
                    ],
                  },
                ].map((filter) => (
                  <div key={filter.key} className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2 ml-2">
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />{" "}
                      {filter.label}
                    </label>
                    <div className="relative group">
                      <select
                        value={filters[filter.key]}
                        onChange={(e) =>
                          handleFilterChange(filter.key, e.target.value)
                        }
                        className="w-full bg-white/3 border border-white/10 rounded-xl py-4 px-5 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-blue-500/40 focus:bg-white/[0.07] transition-all hover:border-white/20"
                      >
                        {filter.options.map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            className="bg-slate-950 text-white"
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Papers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {filteredVaultPapers.map((paper) => (
                  <div
                    key={paper._id}
                    className="group relative bg-slate-900/40 border border-white/5 p-7 rounded-[2.5rem] hover:border-blue-500/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                  >
                    {/* Card Accent Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="p-4 bg-white/5 rounded-2xl text-blue-500 border border-white/5 group-hover:border-blue-500/20 group-hover:bg-blue-500/10 transition-all">
                        <FileText size={28} />
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          paper.isApproved
                            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/5 text-amber-500 border-amber-500/20 animate-pulse"
                        }`}
                      >
                        {paper.isApproved ? "Stored" : "Verifying"}
                      </span>
                    </div>

                    <div className="relative z-10 space-y-4">
                      <h4
                        className="text-xl font-black uppercase leading-[1.1] tracking-tighter group-hover:text-blue-400 transition-colors cursor-pointer"
                        onClick={() => setPreviewPaper(paper)}
                      >
                        {paper.title}
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {[
                          paper.subjectCode,
                          paper.department,
                          `Sem ${paper.semester}`,
                        ].map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-white/5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 text-slate-400 group-hover:text-slate-200 group-hover:bg-white/10 transition-all"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center text-[12px] font-black uppercase text-blue-400 shadow-inner">
                            {paper.uploadedBy?.name?.charAt(0) ?? "?"}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-slate-900 flex items-center justify-center">
                            <ShieldCheck size={8} className="text-white" />
                          </div>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[8px] font-black uppercase text-slate-500 tracking-tighter">
                            Verified Node
                          </p>
                          <p className="text-[11px] font-bold text-slate-200 truncate w-24">
                            {paper.uploadedBy?.name ?? "Unknown"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewPaper(paper)}
                          className="p-3.5 bg-slate-950 border border-white/10 hover:border-blue-500/50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-2xl transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(paper._id)}
                          className="p-3.5 bg-slate-950 border border-white/10 hover:border-red-500/50 hover:bg-red-600 text-slate-400 hover:text-white rounded-2xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredVaultPapers.length === 0 && (
                <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem] bg-white/1">
                  <div className="relative inline-block mb-6">
                    <AlertTriangle size={64} className="text-slate-800" />
                    <Search
                      size={24}
                      className="absolute bottom-0 right-0 text-blue-500 animate-bounce"
                    />
                  </div>
                  <p className="font-black uppercase tracking-[0.4em] text-slate-600 text-sm">
                    No matches found in sector 7G
                  </p>
                  <button
                    onClick={() => setVaultSearch("")}
                    className="mt-6 text-[10px] font-black uppercase text-blue-500 border-b border-blue-500/30 pb-1 hover:text-blue-400 transition-colors"
                  >
                    De-encrypt search query
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Approval View */}
          {activeTab === "approvals" && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
              {/* Moderation Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900/20 p-8 rounded-[3rem] border border-white/5 backdrop-blur-md">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                    Moderation <span className="text-blue-500">Queue</span>
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em]">
                        Awaiting Verification:
                      </p>
                    </div>
                    <span className="text-xl font-black text-amber-500 tabular-nums">
                      {pendingPapers.length.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className="hidden md:block text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    System Integrity
                  </p>
                  <p className="text-[10px] font-bold text-emerald-500">
                    MANUAL OVERRIDE ENABLED
                  </p>
                </div>
              </div>

              {pendingPapers.length === 0 ? (
                <div className="relative py-32 text-center border-2 border-dashed border-white/5 rounded-[4rem] bg-white/1 overflow-hidden group">
                  {/* Decorative background glow */}
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                      <CheckCircle size={40} className="text-emerald-500" />
                    </div>
                    <p className="font-black uppercase tracking-[0.5em] text-slate-400 text-lg">
                      Sector Cleared
                    </p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase mt-2 tracking-widest">
                      No pending data packets in buffer
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pendingPapers.map((paper) => (
                    <div
                      key={paper._id}
                      className="group relative bg-slate-900/40 border border-white/5 p-2 pr-6 rounded-[2.5rem] flex flex-col lg:flex-row items-center gap-6 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-500 overflow-hidden"
                    >
                      {/* Paper Icon Module */}
                      <div className="w-24 h-24 rounded-4xl bg-slate-950 border border-white/5 flex items-center justify-center text-blue-500 shrink-0 relative overflow-hidden group-hover:border-blue-500/20 transition-colors">
                        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <FileText size={32} className="relative z-10" />
                      </div>

                      {/* Info Module */}
                      <div className="flex-1 text-center lg:text-left py-4">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-3">
                          <h4
                            className="font-black uppercase text-xl leading-tight tracking-tighter cursor-pointer text-slate-100 group-hover:text-blue-400 transition-colors"
                            onClick={() => setPreviewPaper(paper)}
                          >
                            {paper.title}
                          </h4>
                          <span className="text-[9px] font-mono text-slate-700 bg-white/5 px-2 py-0.5 rounded border border-white/5 self-center">
                            0x{paper._id.slice(-6).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                          {[
                            {
                              val: paper.subjectCode,
                              color: "bg-white/5 text-slate-400",
                            },
                            {
                              val: paper.department,
                              color:
                                "bg-blue-500/10 text-blue-400 border-blue-500/20",
                            },
                            {
                              val: `SEM ${paper.semester}`,
                              color: "bg-white/5 text-slate-400",
                            },
                            {
                              val: paper.examType,
                              color:
                                "bg-white/5 text-slate-400 text-amber-500/80",
                            },
                            {
                              val: paper.examYear,
                              color: "bg-white/5 text-slate-400",
                            },
                          ].map((tag, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border border-white/5 ${tag.color}`}
                            >
                              {tag.val}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-center lg:justify-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                            Source:{" "}
                            <span className="text-slate-300 font-mono italic">
                              {paper.uploadedBy?.name ?? "Unknown"}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Command Module */}
                      <div className="flex items-center gap-3 shrink-0 pb-6 lg:pb-0">
                        <button
                          onClick={() => setPreviewPaper(paper)}
                          className="group/btn flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          <Eye
                            size={16}
                            className="text-slate-500 group-hover/btn:text-blue-400"
                          />
                          <span className="text-slate-400 group-hover/btn:text-white">
                            Review
                          </span>
                        </button>

                        <button
                          disabled={
                            actionLoading?.id === paper._id &&
                            actionLoading.type === "approve"
                          }
                          onClick={() => handleApprove(paper._id)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95
    ${
      actionLoading?.id === paper._id && actionLoading.type === "approve"
        ? "bg-emerald-600/50 cursor-not-allowed opacity-70"
        : "bg-emerald-600/90 hover:bg-emerald-500 text-white hover:shadow-emerald-500/40"
    }`}
                        >
                          {actionLoading?.id === paper._id &&
                          actionLoading.type === "approve" ? (
                            <>
                              <RefreshCw size={16} className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} />
                              Authorize
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleReject(paper._id)}
                          className="p-3.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl border border-transparent hover:border-red-500/20 transition-all"
                          title="Discard Submission"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Subtle Progress Bar (Design only) */}
                      <div className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-transparent via-blue-500/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Management View */}
          {activeTab === "users" && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900/20 p-8 rounded-[3rem] border border-white/5 backdrop-blur-md">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                    User <span className="text-blue-500">Directory</span>
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-blue-500" />
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em]">
                        Active Identities:
                      </p>
                    </div>
                    <span className="text-xl font-black text-blue-400 tabular-nums">
                      {users.length.toString().padStart(3, "0")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">
                        Total Credits
                      </p>
                      <p className="text-xs font-black text-emerald-500 tabular-nums">
                        {users
                          .reduce((acc, curr) => acc + curr.points, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Zap size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/2">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                          Profile Entity
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                          Department Node
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">
                          Engagement Metrics
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">
                          Access Control
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/3">
                      {users.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-blue-500/2 transition-all group relative"
                        >
                          {/* Visual indicator for row hover */}
                          <td className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div
                                  className={`w-12 h-12 rounded-2xl bg-linear-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center font-black text-blue-500 text-lg shadow-inner group-hover:scale-105 transition-transform duration-500`}
                                >
                                  {user.name[0]}
                                </div>
                                {/* Connection status ring */}
                                <div
                                  className={`absolute -inset-1 rounded-[1.2rem] border-2 border-dashed opacity-20 ${user.status === "active" ? "border-emerald-500 animate-[spin_10s_linear_infinite]" : "border-red-500"}`}
                                />
                              </div>
                              <div>
                                <p className="text-[13px] font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                  {user.name}
                                </p>
                                <p className="text-[10px] font-mono text-slate-500 lowercase opacity-60">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-6">
                            <span className="px-3 py-1.5 rounded-lg bg-blue-600/5 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest group-hover:bg-blue-500/10 transition-all">
                              {user.department}
                            </span>
                          </td>

                          <td className="px-8 py-6">
                            <div className="flex justify-center gap-8">
                              <div className="text-center">
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter mb-1">
                                  Uploads
                                </p>
                                <p className="text-sm font-black text-slate-200 tabular-nums">
                                  {user.uploadsCount}
                                </p>
                              </div>
                              <div className="w-px h-8 bg-white/5 self-center" />
                              <div className="text-center">
                                <p className="text-[8px] font-black text-emerald-500/50 uppercase tracking-tighter mb-1">
                                  Credits
                                </p>
                                <p className="text-sm font-black text-emerald-500 tabular-nums">
                                  {user.points}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                              {/* Detailed View Icon */}
                              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:border-white/20 transition-all">
                                <ShieldAlert size={16} />
                              </button>

                              <button
                                disabled={actionLoading === user._id}
                                onClick={() =>
                                  handleBlockUser(user._id, user.status)
                                }
                                className={`min-w-32.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg ${
                                  user.status === "active"
                                    ? "bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white shadow-red-500/10"
                                    : "bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-emerald-500/10"
                                }`}
                              >
                                {actionLoading === user._id ? (
                                  <RefreshCw
                                    size={14}
                                    className="animate-spin mx-auto"
                                  />
                                ) : user.status === "active" ? (
                                  "Revoke Access"
                                ) : (
                                  "Grant Access"
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Activity */}
                <div className="p-6 bg-white/1 border-t border-white/5 flex justify-between items-center">
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                    Showing {users.length} authenticated nodes
                  </p>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- PAPER PREVIEW MODAL --- */}

        {previewPaper && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 lg:p-12 animate-in fade-in zoom-in-95 duration-300">
            {/* Cinematic Backdrop */}
            <div
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
              onClick={() => setPreviewPaper(null)}
            />

            {/* Modal Body */}
            <div className="relative w-full max-w-7xl h-full max-h-[95vh] bg-[#050505] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
              {/* Tactical Header */}
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-inner">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
                      {previewPaper.title}
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 animate-pulse">
                        LIVE_ASSET
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[9px] font-black text-blue-500 tracking-[0.3em] uppercase">
                        {previewPaper.subjectCode}
                      </p>
                      <span className="text-[9px] text-slate-700">
                        &#169;&#169;
                      </span>
                      <p className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">
                        {previewPaper.department}
                      </p>
                      <span className="text-[9px] text-slate-700">
                        &#169;&#169;
                      </span>
                      <p className="text-[9px] font-mono text-slate-600 tracking-widest">
                        ID: {previewPaper._id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => window.open(previewPaper.fileUrl, "_blank")}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-all"
                  >
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => setPreviewPaper(null)}
                    className="p-3 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left: THE REAL PAPER VIEWPORT */}
                <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center overflow-hidden relative group/viewport">
                  {/* HUD Grids */}
                  <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none border-20 border-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Real Document Container */}
                  <div className="relative w-full h-full p-4 lg:p-8 z-10">
                    <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                      {/* LOADING HUD - Only visible when isLoadingPaper is true */}
                      {isLoadingPaper && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0a]">
                          {/* Shimmering Skeleton Background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite] skew-x-12" />

                          {/* Spinner & Text */}
                          <div className="relative flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse">
                                Initializing Preview
                              </span>
                              <span className="text-[8px] font-mono text-slate-500 mt-1">
                                Establishing Secure Stream...
                              </span>
                            </div>
                          </div>

                          {/* Tactical Corner Accents */}
                          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-blue-500/30" />
                          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-blue-500/30" />
                        </div>
                      )}

                      {/* Google PDF Viewer Wrapper */}
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewPaper.fileUrl)}&embedded=true`}
                        className={`w-full h-full bg-white transition-opacity duration-700 ${
                          isLoadingPaper ? "opacity-0" : "opacity-100"
                        }`}
                        title="Document Preview"
                        frameBorder="0"
                        onLoad={() => setIsLoadingPaper(false)}
                      />

                      {/* Scanned Overlay Effect (Visual HUD) */}
                      <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20" />
                      {!isLoadingPaper && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20 animate-[scan_3s_linear_infinite]" />
                      )}
                    </div>
                  </div>

                  {/* Floating Viewport Meta */}
                  <div className="absolute bottom-12 left-12 z-20 hidden lg:block">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">
                            Resolution
                          </span>
                          <span className="text-xs font-mono text-white">
                            Vector Opt.
                          </span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">
                            Encoding
                          </span>
                          <span className="text-xs font-mono text-white">
                            PDF/A-1b
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Tactical Sidebar */}
                <div className="w-full lg:w-96 bg-white/1 border-l border-white/5 p-8 space-y-8 overflow-y-auto custom-scrollbar">
                  {/* Metadata Analysis Section */}
                  <section>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mb-6 flex items-center gap-2">
                      <Info size={14} /> Metadata Analysis
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {/* Uploader & Department (Full Width) */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-white/3 border border-white/5 rounded-xl">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                            Uploader
                          </span>
                          <span className="text-[10px] font-mono text-white font-bold">
                            {previewPaper.uploadedBy?.name || "Admin"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/3 border border-white/5 rounded-xl">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                            Department
                          </span>
                          <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                            {previewPaper.department}
                          </span>
                        </div>
                      </div>

                      {/* Tactical 2x2 Grid for Academic Data */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            label: "Semester",
                            value: `SEM ${previewPaper.semester || "N/A"}`,
                          },
                          {
                            label: "Exam Type",
                            value: previewPaper.examType || "N/A",
                          },
                          {
                            label: "Exam Year",
                            value: previewPaper.examYear || "N/A",
                          },
                          {
                            label: "Session",
                            value: previewPaper.academicYear || "2023-24",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex flex-col gap-1 p-3 bg-white/2 border border-white/5 rounded-xl group/meta"
                          >
                            <span className="text-[7px] font-black text-slate-600 uppercase tracking-tighter">
                              {item.label}
                            </span>
                            <span className="text-[10px] font-mono text-blue-400 font-black italic uppercase">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Security Protocol Section */}
                  <section className="pt-6 border-t border-white/5">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-2">
                      <ShieldCheck size={14} /> Security Protocol
                    </h4>

                    <div className="flex flex-col gap-3">
                      {/* Action Row: Approve & Reject */}

                      <div className="flex gap-2">
                        <button
                          disabled={
                            actionLoading === previewPaper._id ||
                            previewPaper.isApproved
                          }
                          onClick={() => handleApprove(previewPaper._id)}
                          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl font-black uppercase text-[10px] tracking-tight transition-all border
    ${
      actionLoading === previewPaper._id
        ? "bg-emerald-600/50 cursor-not-allowed"
        : previewPaper.isApproved
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500/50 cursor-not-allowed"
          : "bg-emerald-600 hover:bg-emerald-500 border-transparent text-white active:scale-95"
    }`}
                        >
                          {actionLoading === previewPaper._id ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                          {previewPaper.isApproved
                            ? "Approved"
                            : actionLoading === previewPaper._id
                              ? "Processing..."
                              : "Approve"}
                        </button>

                        <button
                          disabled={actionLoading === previewPaper._id}
                          onClick={() => handleReject(previewPaper._id)}
                          className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-slate-400 hover:text-red-500 rounded-xl font-black uppercase text-[10px] tracking-tight transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === previewPaper._id ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {actionLoading === previewPaper._id
                            ? "Processing..."
                            : "Reject"}
                        </button>
                      </div>

                      {/* Download Asset - Enabled only if approved */}
                      <button
                        disabled={
                          actionLoading === previewPaper._id ||
                          !previewPaper.isApproved
                        }
                        onClick={async () => {
                          // Generate filename based on asset metadata
                          const fileName = `${previewPaper.subjectCode}_${previewPaper.examYear}_${previewPaper.examType}.pdf`;

                          const toastId = toast.loading(
                            "Preparing download...",
                            {
                              description: "Fetching file from secure vault.",
                            },
                          );

                          try {
                            const res = await fetch(
                              `/api/download?url=${encodeURIComponent(
                                previewPaper.fileUrl,
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
                        className={`w-full flex items-center justify-between p-4 rounded-xl font-black uppercase tracking-tighter transition-all border
    ${
      previewPaper.isApproved
        ? "bg-blue-600 hover:bg-blue-500 text-white border-transparent shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]"
        : "bg-white/5 text-slate-600 border-white/5 cursor-not-allowed opacity-50"
    }`}
                      >
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-[11px]">
                            Download Verified Asset
                          </span>
                          {previewPaper.isApproved && (
                            <span className="text-[7px] font-mono text-blue-200/60 tracking-widest">
                              SECURE_LINK_READY
                            </span>
                          )}
                        </div>
                        <Download
                          size={18}
                          className={
                            previewPaper.isApproved ? "animate-bounce" : ""
                          }
                        />
                      </button>

                      {previewPaper.isApproved && (
                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                          <p className="text-[8px] text-emerald-500/70 uppercase font-black tracking-widest text-center">
                            Encryption Verified // System Sync Complete
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* System Visualizer */}
                  <div className="pt-4">
                    <div className="h-16 w-full bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center justify-center relative overflow-hidden">
                      <div className="flex gap-1.5">
                        {[30, 70, 45, 90, 65, 40].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full animate-pulse ${previewPaper.isApproved ? "bg-emerald-500/40" : "bg-blue-500/40"}`}
                            style={{
                              height: `${h}%`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[7px] text-slate-600 text-center uppercase tracking-[0.5em] mt-4">
                      {previewPaper.isApproved
                        ? "Database Record Locked"
                        : "Secure Channel Verified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
