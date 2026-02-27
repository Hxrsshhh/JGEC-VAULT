"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Upload,
  ArrowRight,
  Download,
  Trophy,
  Activity,
  Sun,
  Moon,
  Database,
  LayoutGrid,
  Sparkles,
  TrendingUp,
  Scan,
  Layers,
  Zap,
  ChevronRight,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const stats = [
    { label: "Archived Papers", value: "1,240+", icon: <Database size={18} /> },
    { label: "Departments", value: "12+", icon: <LayoutGrid size={18} /> },
    { label: "Total Downloads", value: "8.5k+", icon: <Download size={18} /> },
    { label: "Active Nodes", value: "150+", icon: <Zap size={18} /> },
  ];

  const features = [
    {
      title: "Smart Search",
      description:
        "Instantly locate specific subjects, codes, or semesters using our global neural index.",
      icon: <Search className="text-blue-500" />,
      tag: "V3.0",
    },
    {
      title: "Department Filters",
      description:
        "Seamlessly navigate through CSE, ECE, ME, and more with one-tap modular filtering.",
      icon: <Layers className="text-blue-400" />,
      tag: "Native",
    },
    {
      title: "Download Tracking",
      description:
        "Keep track of high-demand papers and stay updated with the most recent archive uploads.",
      icon: <TrendingUp className="text-blue-500" />,
      tag: "Pulse",
    },
    {
      title: "Contributor Rank",
      description:
        "Get recognized for your contributions. Top archivists earn status and priority access.",
      icon: <Trophy className="text-blue-600" />,
      tag: "Social",
    },
  ];

  const topContributors = [
    { name: "Arjun Mehta", uploads: 42, color: "bg-blue-600", rank: "Gold" },
    {
      name: "Sarah Jenkins",
      uploads: 38,
      color: "bg-zinc-700",
      rank: "Silver",
    },
    { name: "Priya Das", uploads: 31, color: "bg-blue-800", rank: "Bronze" },
  ];

  return (
    <div
      className={`min-h-screen selection:bg-blue-500/30 font-sans overflow-x-hidden bg-white dark:bg-black`}
    >
      {/* Cinematic Background Environment */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse-slow" />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-800/20 blur-[120px] rounded-full animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-2/3 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-float"
          style={{ animationDuration: "12s", animationDelay: "1s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.25] transition-opacity duration-1000 hidden md:block"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.15), transparent 80%)`,
          }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? "py-4" : "py-6 md:py-10"}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div
            className={`flex justify-between items-center px-4 md:px-8 py-3 rounded-2xl border transition-all duration-500 relative group overflow-hidden ${isScrolled || isMenuOpen ? "bg-white/20 dark:bg-black/60 backdrop-blur-2xl border-white/10 shadow-2xl" : "bg-transparent border-transparent"}`}
          >
            <div className="flex items-center gap-12 relative z-10">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-15 h-15 flex items-center justify-center rounded-xl">
                  <Image src='/logo1.webp' height={50} width={50} alt="Logo" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-black tracking-tighter uppercase leading-none">
                    JGEC Vault
                  </span>
                  <span className="text-[7px] font-bold tracking-[0.4em] opacity-40 uppercase">
                    Archive Node
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden gap-4 items-center relative z-10">
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 opacity-60">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-6 relative z-10">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 opacity-40 hover:opacity-100 transition-all"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link href='/signup'>
                <button className="relative overflow-hidden bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] px-8 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all group/btn">
                  <span className="relative z-10">Initialize</span>
                </button>
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 p-6 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/10 flex flex-col gap-6 animate-in slide-in-from-top-4">
              <Link href='/signin' className="text-[10px] font-black uppercase tracking-[0.4em]">Browse Papers</Link>
              <Link href='/signup' className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Initialize Node</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-48 md:pt-64 pb-20 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md mb-8 md:mb-12 animate-fade-in shadow-[0_0_30px_rgba(37,99,235,0.1)]">
            <Sparkles size={12} className="text-blue-400 animate-pulse" />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-blue-400">
              System Online: Global Index Active
            </span>
          </div>

          <h1 className="text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[1] md:leading-[0.9] tracking-[-0.04em] uppercase mb-8 md:mb-10 perspective-1000">
            <span className="block opacity-20 transform md:hover:scale-105 transition-transform duration-700 cursor-default">
              Access Previous Year
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-100 to-blue-500 drop-shadow-2xl">
              Papers Instantly.
            </span>
          </h1>

          <p className="text-base md:text-xl font-medium opacity-50 max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed">
            Search, upload, and download academic intelligence. A fluid,
            high-fidelity archive for Jalpaiguri Government Engineering College.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 relative z-10">
            <Link href='/signin' className="w-full sm:w-auto">
              <button className="group w-full sm:w-auto bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-2xl shadow-blue-600/40 transform active:scale-95">
                Browse Papers
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-2 transition-transform duration-500"
                />
              </button>
            </Link>
            <button
              className={`group w-full sm:w-auto px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] border transition-all hover:bg-white/5 relative overflow-hidden`}
            >
              <span className="relative z-10">Upload Data</span>
            </button>
          </div>
        </div>

        {/* Scrolling Department Track */}
        <div className="mt-32 md:mt-50 relative w-full overflow-hidden py-6 md:py-10 bg-blue-600">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-blue-200 via-blue/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          <div className="flex w-max items-center gap-10 md:gap-20 animate-infinite-scroll group hover:[animation-play-state:paused] cursor-pointer">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-10 md:gap-20 items-center">
                {["CSE", "ECE", "ME", "EE", "CE", "IT", "PH", "CH", "MA"].map(
                  (dept) => (
                    <span
                      key={dept + i}
                      className="relative text-6xl md:text-8xl font-black tracking-tighter uppercase select-none transition-all duration-500
                       text-transparent [text-stroke:1px_#cbd5e1] [-webkit-text-stroke:1px_#cbd5e1]
                       hover:text-blue-600 hover:[-webkit-text-stroke:1px_#2563eb] hover:scale-110
                       hover:drop-shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    >
                      {dept}
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section
        id="features"
        className="py-20 md:py-25 px-6 relative bg-white dark:bg-blue-800/5 transition-colors duration-500 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                }}
                className="group relative p-8 rounded-[2.5rem] transition-all duration-500
                     bg-white/40 dark:bg-slate-900/40 backdrop-blur-md 
                     border border-white/20 dark:border-slate-800/50 
                     shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
                     hover:shadow-[0_20px_40px_0_rgba(37,99,235,0.15)]
                     hover:-translate-y-2 hover:bg-white/60 dark:hover:bg-slate-800/60
                     overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                        bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(59,130,246,0.15)_0%,transparent_80%)]" />

                <div className="relative z-10 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-xl w-fit mb-8 
                        group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 
                        transition-all duration-500 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-3 tracking-tight uppercase italic text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium mb-10 line-clamp-3">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400 
                        opacity-0 group-hover:opacity-100 transition-all duration-500 
                        translate-y-4 group-hover:translate-y-0">
                  Explore <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section id="stats" className="py-20 md:py-32 border-y bg-white/[0.01] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-blue-500/50 group-hover:scale-110 transition-transform duration-500">
                  {stat.value}
                </div>
                <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-30 flex items-center gap-2 group-hover:opacity-100 transition-opacity">
                  <span className="text-blue-500">{stat.icon}</span> {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section id="leaderboard" className="py-24 md:py-48 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 md:gap-20 items-center">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
                Vanguard of <br />
                <span className="text-blue-500">Archivists.</span>
              </h2>
              <p className="text-lg md:text-xl font-medium opacity-50 mb-12">
                Our repository is built on collective contribution. Meet the top
                nodes who have secured institutional memory.
              </p>
              <button className="mx-auto lg:mx-0 group px-10 py-4 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 transition-all flex items-center gap-4">
                View All Nodes <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="lg:w-1/2 w-full space-y-4">
              {topContributors.map((user, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-2xl border bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 cursor-default group md:hover:translate-x-2">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl ${user.color} flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20`}>
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="font-black text-sm uppercase italic">{user.name}</div>
                      <div className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">{user.rank} Archiver</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black tracking-tighter">{user.uploads}</div>
                    <div className="text-[8px] uppercase font-bold opacity-30 tracking-widest">Uplinks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 md:py-40 px-6 border-t dark:bg-[#010103] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-20 mb-20 md:mb-32">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-xl">
                  <Scan className="text-white" size={24} />
                </div>
                <span className="font-black text-2xl tracking-tighter uppercase italic">JGEC Vault</span>
              </div>
              <p className="opacity-30 text-lg leading-relaxed max-w-sm">
                A high-fidelity digital archive for the Jalpaiguri Government
                Engineering College community. Legacy preservation.
              </p>
            </div>
            {["System", "Resources"].map((title, idx) => (
              <div key={idx}>
                <h4 className="font-black text-[11px] uppercase tracking-[0.4em] mb-10 text-blue-500">{title}</h4>
                <ul className="space-y-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                  <li><a href="#" className="hover:text-blue-500 transition-all">Archive Node</a></li>
                  <li><a href="#" className="hover:text-blue-500 transition-all">Support Core</a></li>
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em] opacity-20 text-center">
            <span>© 2024 JALPAIGURI GOVT ENGINEERING COLLEGE</span>
            <div className="flex items-center gap-6 md:gap-10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Operational
              </div>
              <a href="#" className="hover:opacity-100">Privacy Standard</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;