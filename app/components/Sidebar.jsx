"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Scan,
  LayoutDashboard,
  Upload,
  Radio,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "upload", label: "Upload Paper", icon: Upload, href: "/uploadPaper" },
    { id: "leaderboard", label: "Leaderboard", icon: Radio, href: "/leaderboard" },
    { id: "my-uploads", label: "My Archive", icon: FolderOpen, href: "/archive" },
  ];

  return (
    <>
      {/* --- MOBILE/TAB TRIGGER BUTTON --- */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="xl:hidden fixed top-4 left-4 z-[100] p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl text-zinc-600 dark:text-white"
      >
        <Menu size={20} />
      </button>

      {/* --- OVERLAY BACKDROP --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] xl:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`
          fixed xl:sticky top-0 left-0 h-screen z-[120]
          flex flex-col border-r border-zinc-200 dark:border-white/10 
          backdrop-blur-2xl bg-white/96 dark:bg-black/90 
          transition-all duration-500 ease-in-out
          
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
          
          w-full sm:w-80 
          ${isCollapsed ? "xl:w-24" : "xl:w-80"}
        `}
      >
        {/* Desktop Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden xl:flex absolute -right-3 top-24 w-6 h-6 bg-blue-600 rounded-full items-center justify-center text-white shadow-lg z-50 hover:scale-110 transition-transform"
        >
          <ChevronLeft className={`transition-transform duration-500 ${isCollapsed ? "rotate-180" : ""}`} size={14} />
        </button>

        {/* Mobile/Tab Close Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileOpen(false);
          }}
          className="xl:hidden absolute top-8 right-8 z-[130] p-2 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Decorative Orbs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/10 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Logo Section */}
        <div className={`p-8 pb-10 flex items-center gap-4 relative group cursor-default ${isCollapsed ? "xl:justify-center" : "justify-start"}`}>
          <div className="relative flex-shrink-0">
            <div className="relative flex items-center justify-center shadow-xl">
              <Image src='/logo1.webp' height={50} width={50} alt="Logo" />
            </div>
          </div>
          {/* LOGO TEXT LOGIC */}
          <div className={`flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "xl:opacity-0 xl:w-0" : "opacity-100 w-auto"}`}>
            <h1 className="font-black tracking-tighter uppercase italic text-2xl text-zinc-900 dark:text-white">JGEC<span className="text-blue-600"> vault.</span></h1>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 space-y-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <nav className="space-y-2">
            {navItems.map(({ id, label, icon: Icon, href }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={id}
                  href={href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group flex items-center p-4 rounded-2xl transition-all duration-300 relative border ${
                    isActive
                      ? "bg-blue-600/5 border-blue-600/20 text-blue-600 dark:text-white"
                      : "hover:bg-zinc-50 dark:hover:bg-white/[0.02] text-zinc-500 border-transparent"
                  } ${isCollapsed ? "xl:justify-center" : "justify-start gap-4"}`}
                >
                  <div className={`p-2 rounded-xl transition-all duration-500 flex-shrink-0 ${
                    isActive ? "bg-blue-600 text-white scale-110" : "bg-zinc-100 dark:bg-white/5"
                  }`}>
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  {/* LABEL LOGIC: Visible on mobile, hidden only if collapsed on desktop */}
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? "xl:hidden xl:opacity-0" : "opacity-100 block"
                  }`}>
                    {label}
                  </span>

                  {isActive && !isCollapsed && (
                    <div className="absolute right-0 top-0 h-full w-1 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className={`p-6 mt-auto border-t border-zinc-200 dark:border-white/5 space-y-2 bg-zinc-50/50 dark:bg-black/20 ${isCollapsed ? "xl:flex xl:flex-col xl:items-center" : ""}`}>
          <Link
            href="/settings"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-4 p-3.5 rounded-xl text-zinc-500 hover:text-zinc-900 transition-all ${isCollapsed ? "xl:w-12 xl:h-12 xl:justify-center xl:p-0" : "w-full"}`}
          >
            <Settings size={18} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isCollapsed ? "xl:hidden" : "block"}`}>
              Settings
            </span>
          </Link>

          <button 
            onClick={handleLogout}
            className={`flex items-center gap-4 p-3.5 rounded-xl text-red-500/60 hover:text-red-600 transition-all ${isCollapsed ? "xl:w-12 xl:h-12 xl:justify-center xl:p-0" : "w-full"}`}
          >
            <LogOut size={18} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isCollapsed ? "xl:hidden" : "block"}`}>
              Log out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;