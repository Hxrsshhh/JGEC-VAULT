"use client";

import React from "react";
import Link from "next/link"; // Assuming Next.js, otherwise use 'react-router-dom'
import { usePathname } from "next/navigation"; // To detect active state via URL
import {
  Scan,
  LayoutDashboard,
  Upload,
  Radio,
  FolderOpen,
  Settings,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const theme = {
    border: "border-white/10",
    textMuted: "text-white/50",
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "upload", label: "Upload Paper", icon: Upload, href: "/uploadPaper" },
    { id: "leaderboard", label: "Leaderboard", icon: Radio, href: "/leaderboard" },
    { id: "my-uploads", label: "My Archive", icon: FolderOpen, href: "/archive" },
  ];

  return (
    <aside className={`w-80 border-r ${theme.border} flex flex-col backdrop-blur-xl bg-black/40 h-screen sticky top-0 overflow-hidden`}>
      
      {/* Cyber-Atmospheric Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute -left-24 top-20 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Logo Section */}
      <div className="p-8 pb-10 flex items-center gap-4 relative">
        <div className="relative group">
          <div className="absolute -inset-1 bg-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative w-11 h-11 bg-[#030305] border border-blue-500/30 rounded-xl flex items-center justify-center shadow-2xl">
            <Scan className="text-blue-500 group-hover:scale-110 transition-transform" size={22} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-black tracking-tighter uppercase italic text-2xl leading-none text-white">
            Vault<span className="text-blue-500">.</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-black tracking-[0.3em] opacity-40 uppercase text-blue-400">
              Student Node 0.1
            </span>
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-4 space-y-8">
        <div>
          <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Core Terminal</p>
          <nav className="space-y-1.5">
            {navItems.map(({ id, label, icon: Icon, href }) => {
              // Logic to check if current path matches link href
              const isActive = pathname === href;
              
              return (
                <Link
                  key={id}
                  href={href}
                  className={`group flex items-center justify-between p-3.5 rounded-xl transition-all duration-500 relative overflow-hidden ${
                    isActive 
                      ? "bg-blue-600/10 border border-blue-500/20 text-white" 
                      : `hover:bg-white/[0.03] ${theme.textMuted} hover:text-white border border-transparent`
                  }`}
                >
                  <div className="flex items-center gap-4 z-10">
                    <Icon 
                      size={18} 
                      className={`${isActive ? "text-blue-400" : "opacity-40 group-hover:opacity-100 group-hover:text-blue-400"} transition-all`} 
                    />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-60"}`}>
                      {label}
                    </span>
                  </div>
                  
                  {isActive && (
                    <>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-l-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent" />
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Status Section */}
        <div className="pt-4 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-1">Status</p>
            <p className="text-[10px] font-bold text-white/60 leading-tight">Syncing with Mainframe...</p>
            <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
              <div className="w-2/3 h-full bg-blue-500 animate-[pulse_2s_infinite]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="p-4 mt-auto border-t border-white/5 space-y-1">
        <Link href="/settings" className="flex items-center gap-4 p-3.5 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.03] transition-all group">
          <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
        </Link>

        <button className="w-full flex items-center gap-4 p-3.5 rounded-xl text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all group">
          <div className="relative">
             <Radio size={18} className="group-hover:animate-ping absolute inset-0 opacity-20" />
             <ChevronRight className="rotate-180" size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Terminate Session
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;