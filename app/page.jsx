"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Search,
  ArrowRight,
  Download,
  Trophy,
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
  Menu,
  X,
  Linkedin,
  Github,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const SearchParamListener = () => {
  const params = useSearchParams();

  useEffect(() => {
    const logoutStatus = params.get("logout");

    if (logoutStatus === "success") {
      // Small delay ensures the toast container is fully mounted
      const timer = setTimeout(() => {
        toast.success("You have been logged out 👋", {
          description: "Session terminated successfully.",
        });
      }, 100);

      // Clean URL using standard Next.js approach or window
      const url = new URL(window.location.href);
      url.searchParams.delete("logout");
      window.history.replaceState({}, "", url.pathname);

      return () => clearTimeout(timer);
    }
  }, [params]);

  return null;
};

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <div className={`min-h-screen font-sans  bg-white dark:bg-black`}>
      <Suspense fallback={null}>
        <SearchParamListener />
      </Suspense>

      {/* Cinematic Background Environment */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50 dark:bg-black/10">
        {/* 1. Enhanced Ambient Orbs */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 dark:bg-blue-900/15 blur-[120px] rounded-full animate-pulse-slow" />
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/15 dark:bg-blue-800/10 blur-[120px] rounded-full animate-pulse-slow"
          style={{ animationDelay: "3s" }}
        />

        {/* 2. Tactical Grid Pattern (Adds Depth) */}
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse at center, black, transparent 80%)",
          }}
        />

        {/* 3. Improved Mouse Spotlight (Sharper Highlight) */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 hidden md:block"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.08), transparent 40%)`,
          }}
        />

        {/* 4. Moving Scanline Effect (Cyber-Vault Feel) */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent absolute top-0 animate-scanline" />
        </div>

        {/* 5. Grain & Noise for High-Fidelity Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-soft-light pointer-events-none" />
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
                  <Image src="/https://res.cloudinary.com/dljnbvomg/image/upload/v1772476724/logo1_h4ezki.webp" height={50} width={50} alt="Logo" />
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
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="p-2 opacity-60"
              >
                {resolvedTheme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-6 relative z-10">
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="p-2 opacity-40 hover:opacity-100 transition-all"
              >
                {resolvedTheme === "dark" ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
              </button>
              <Link href="/signup">
                <button className="relative overflow-hidden bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] px-8 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all group/btn">
                  <span className="relative z-10">Initialize</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 p-6 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/10 flex flex-col gap-6 animate-in slide-in-from-top-4">
              <Link
                href="/signin"
                className="text-[10px] font-black uppercase tracking-[0.4em]"
              >
                Browse Papers
              </Link>
              <Link
                href="/signup"
                className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500"
              >
                Initialize Node
              </Link>
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

          <h1 className="text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-none md:leading-[0.9] tracking-[-0.04em] uppercase mb-8 md:mb-10 perspective-1000">
            <span className="block opacity-50 transform md:hover:scale-105 transition-transform duration-700 cursor-default">
              Access Previous Year
            </span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-blue-100 to-blue-500 drop-shadow-2xl">
              Papers Instantly.
            </span>
          </h1>

          <p className="text-base md:text-xl font-medium opacity-50 max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed">
            Search, upload, and download academic intelligence. A fluid,
            high-fidelity archive for Jalpaiguri Government Engineering College.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 relative z-10">
            <Link href="/signin" className="w-full sm:w-auto">
              <button className="group w-full sm:w-auto bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-2xl shadow-blue-600/40 transform active:scale-95">
                Browse Papers
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-2 transition-transform duration-500"
                />
              </button>
            </Link>
            <Link href="/uploadPaper" className="w-full sm:w-auto">
              <button
                className={`group w-full sm:w-auto px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] border transition-all hover:bg-white/5 relative overflow-hidden`}
              >
                <span className="relative z-10">Upload Data</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Scrolling Department Track */}
        <div className="mt-32 md:mt-50 relative w-full overflow-hidden py-6 md:py-10 bg-blue-600">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-linear-to-r from-blue-200 via-blue/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-linear-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

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
        className="py-20 md:py-25 px-6 relative bg-white/40 dark:bg-black/30 transition-colors duration-500 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--mouse-x",
                    `${e.clientX - rect.left}px`,
                  );
                  e.currentTarget.style.setProperty(
                    "--mouse-y",
                    `${e.clientY - rect.top}px`,
                  );
                }}
                className="group relative p-8  rounded-[2.5rem] transition-all duration-500
                     bg-white/40 dark:bg-black/10 backdrop-blur-md 
                     border border-white/20 dark:border-slate-800/50 
                     shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
                     hover:shadow-[0_20px_40px_0_rgba(37,99,235,0.15)]
                     hover:-translate-y-2 hover:bg-white/60 dark:hover:bg-slate-800/60
                     overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                        bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(59,130,246,0.15)_0%,transparent_80%)]"
                />

                <div
                  className="relative z-10 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-xl w-fit mb-8 
                        group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 
                        transition-all duration-500 text-blue-600 dark:text-blue-400"
                >
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

                <div
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400 
                        opacity-0 group-hover:opacity-100 transition-all duration-500 
                        translate-y-4 group-hover:translate-y-0"
                >
                  Explore{" "}
                  <ChevronRight
                    size={14}
                    strokeWidth={3}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section
        id="stats"
        className="py-20 md:py-32 border-y bg-white/1 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-linear-to-b from-slate-400 to-blue-500/50 group-hover:scale-110 transition-transform duration-500">
                  {stat.value}
                </div>
                <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-30 flex items-center gap-2 group-hover:opacity-100 transition-opacity">
                  <span className="text-blue-500">{stat.icon}</span>{" "}
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section
        id="contributors"
        className="py-24 md:py-48 px-6 relative overflow-hidden"
      >
        {/* Background decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block px-3 py-1 mb-6 rounded-md bg-blue-500/10 border border-blue-500/20">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                Core Engineering Unit
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic text-zinc-900 dark:text-white">
              The <span className="text-blue-600">Architects</span> behind the
              Vault
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">
              System protocols established and maintained by the following nodes
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {/* 1. MAIN DEVELOPER (Hero Card) */}
            <div className="w-full relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>
              <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-12 rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-black/80 backdrop-blur-2xl overflow-hidden">
                {/* Subtle Grid Pattern inside the big card */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(#2563eb_1px,transparent_1px),linear-gradient(90deg,#2563eb_1px,transparent_1px)] bg-size-[20px_20px]" />

                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                  {/* Lead Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/40 relative z-10 overflow-hidden">
                      <Image
                        src="https://res.cloudinary.com/dljnbvomg/image/upload/v1772466335/profile_gduzv6.jpg"
                        alt="profile"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 128px, 160px"
                        priority
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-500/50 z-20">
                      Developed by
                    </div>
                  </div>

                  <div className="text-center md:text-left">
                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">
                      Harsh Singh
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-mono text-xs md:text-sm uppercase tracking-[0.3em] mb-6">
                      Full-Stack Development & System Design
                    </p>
                  </div>
                </div>

                <div className="mt-8 md:mt-0 flex gap-4 relative z-10">
                  <a
                    href="https://github.com/Hxrsshhh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                  >
                    <Github size={20} />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/harsh-singh-a37b40332/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-blue-500/50 transition-all"
                  >
                    <Linkedin size={20} className="text-blue-600" />
                  </a>
                </div>
              </div>
            </div>

            {/* 2. HELPERS / TEAMMATES (Smaller Grid) */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Aditya kr. shaw",
                  role: "Frontend Dev",
                  initial: "AKS",
                  color: "bg-indigo-600",
                },
                {
                  name: "Arnab Bera",
                  role: "Database Admin",
                  initial: "",
                  color: "bg-purple-600",
                },
                {
                  name: "Teammate Three",
                  role: "UI Designer",
                  initial: "T3",
                  color: "bg-emerald-600",
                },
              ].map((member, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-4xl border border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-white/2 backdrop-blur-xl hover:border-blue-500/30 transition-all duration-500"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl ${member.color} flex items-center justify-center text-white font-black text-xl shadow-lg shadow-black/5`}
                    >
                      {member.initial}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase italic text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 md:py-32 px-6 border-t border-zinc-200 dark:border-white/5 bg-white dark:bg-black/40 overflow-hidden">
        {/* Ambient Background Element - Linked to the overall site design */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20">
            {/* Brand & Description (Spans 5 cols on desktop) */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-4 mb-8">
                <Image src="https://res.cloudinary.com/dljnbvomg/image/upload/v1772476724/logo1_h4ezki.webp" height={50} width={50} alt="Logo" />
                <span className="font-black text-2xl tracking-tighter uppercase italic text-zinc-900 dark:text-white">
                  JGEC Vault
                </span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm font-medium">
                The high-fidelity digital intelligence relay for Jalpaiguri
                Government Engineering College. Securing legacy, one node at a
                time.
              </p>
            </div>

            {/* Navigation Links (Spans 4 cols total) */}
            <div className="md:col-span-4 grid grid-cols-2 gap-8 w-full">
              {["System", "Resources"].map((title, idx) => (
                <div key={idx} className="text-center md:text-left">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.4em] mb-8 text-blue-600 dark:text-blue-500">
                    {title}
                  </h4>
                  <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    <li>
                      <a
                        href="#"
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Archive Node
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Support Core
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Documentation
                      </a>
                    </li>
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact & Social (Spans 3 cols) */}
            <div className="md:col-span-3 flex flex-col items-center md:items-end text-center md:text-right w-full">
              <h4 className="font-black text-[10px] uppercase tracking-[0.4em] mb-8 text-blue-600 dark:text-blue-500">
                Uplink Channels
              </h4>
              <div className="space-y-4 w-full">
                {/* GitHub & LinkedIn Row */}
                <div className="flex justify-center md:justify-end gap-4 mb-6">
                  <a
                    href="https://github.com/Hxrsshhh"
                    className="p-3 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/harsh-singh-a37b40332/"
                    className="p-3 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
                {/* Contact Details */}
                <div className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-500 space-y-2">
                  <p className="hover:text-blue-600 transition-colors cursor-pointer uppercase">
                    hxrsshhh@gmail.com
                  </p>
                  <p className="hover:text-blue-600 transition-colors cursor-pointer tracking-widest">
                    +91 6202452612
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Highly Responsive */}
          <div className="pt-10 border-t border-zinc-200 dark:border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600 text-center lg:text-left order-2 lg:order-1">
              © 2024 JALPAIGURI GOVT ENGINEERING COLLEGE // EST. 1961
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 order-1 lg:order-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                <span className="text-blue-600 dark:text-blue-400">
                  System_Operational
                </span>
              </div>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-white transition-all py-1"
              >
                Privacy_Protocol
              </a>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-white transition-all py-1"
              >
                Security_Standard
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
