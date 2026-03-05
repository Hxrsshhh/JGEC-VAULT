"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  LayoutGrid, CheckCircle, FileText, Users, LogOut, 
  Menu, X, ChevronRight 
} from "lucide-react";

export default function UnifiedSidebar({ activeTab, setActiveTab, pendingPapers = [] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync collapse state with screen size on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false); // Reset to full width for mobile drawer
      } else if (window.innerWidth < 1280) {
        setIsCollapsed(true); // Auto-collapse on smaller laptops
      }
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { id: "overview", label: "Dashboard", icon: <LayoutGrid size={22} /> },
    {
      id: "approvals",
      label: "Approvals",
      icon: <CheckCircle size={22} />,
      badge: pendingPapers.length,
    },
    { id: "vault", label: "Paper Vault", icon: <FileText size={22} /> },
    { id: "users", label: "Users", icon: <Users size={22} /> },
  ];

  const sidebarWidth = isCollapsed ? "w-24" : "w-80";
  const mobileTranslate = isMobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* --- MOBILE HEADER (Visible only < 1024px) --- */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
             <Image src="/logo1.webp" fill alt="Logo" className="object-contain" />
          </div>
          <span className="font-black text-white italic tracking-tighter text-sm uppercase">JGEC Vault</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* --- BACKDROP (Mobile Only) --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- THE SIDEBAR --- */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col shrink-0
          bg-slate-950 border-r border-white/5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]
          ${sidebarWidth}
          ${mobileTranslate} lg:translate-x-0
        `}
      >
        {/* DESKTOP TOGGLE HANDLE */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-blue-600 rounded-full items-center justify-center text-white border-4 border-slate-950 z-50 hover:scale-110 transition-transform"
        >
          <ChevronRight size={14} className={`transition-transform duration-500 ${isCollapsed ? "" : "rotate-180"}`} />
        </button>

        {/* MOBILE CLOSE BUTTON */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute right-4 top-4 p-2 text-slate-500"
        >
          <X size={20} />
        </button>

        {/* IDENTITY SECTION */}
        <div className={`p-8 mb-4 flex items-center transition-all duration-500 ${isCollapsed ? "justify-center" : "gap-5"}`}>
          <div className="relative shrink-0">
            <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-lg opacity-50" />
            <Image src="/logo1.webp" height={isCollapsed ? 35 : 45} width={isCollapsed ? 35 : 45} alt="Logo" className="relative transition-all" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
              <h1 className="font-black uppercase tracking-tighter text-xl italic leading-none text-white">
                JGEC <span className="text-blue-500">Vault</span>
              </h1>
              <span className="text-[9px] text-slate-500 font-black tracking-[0.2em] uppercase mt-1">Terminal v4.2.0</span>
            </div>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar py-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  group w-full flex items-center rounded-xl transition-all duration-300 relative
                  ${isCollapsed ? "justify-center py-5" : "px-5 py-4 gap-5"}
                  ${isActive ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-slate-500 hover:bg-white/5 hover:text-slate-200 border border-transparent"}
                `}
              >
                {isActive && (
                  <div className="absolute -left-1 top-3 bottom-3 w-1 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                )}

                <div className={`relative transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {item.icon}
                  {item.badge > 0 && (
                    <span className={`absolute flex items-center justify-center bg-amber-500 text-black text-[10px] font-black rounded-lg ring-2 ring-slate-950 ${isCollapsed ? "-top-2 -right-2 h-4 w-4" : "-top-3 -right-3 px-1.5 py-0.5"}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* FOOTER CONTROLS */}
        <div className="p-4 border-t border-white/5">
          <button className={`w-full flex items-center rounded-xl transition-all duration-300 group text-slate-500 hover:text-white hover:bg-red-500/80 ${isCollapsed ? "justify-center py-4" : "px-5 py-4 gap-5"}`}>
            <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
            {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- CONTENT SPACER (Desktop Only) --- */}
      <div className={`hidden lg:block shrink-0 transition-all duration-500 ${sidebarWidth}`} />
    </>
  );
}