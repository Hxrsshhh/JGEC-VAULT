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
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });

    router.push("/signin"); // or "/"
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    { id: "upload", label: "Upload Paper", icon: Upload, href: "/uploadPaper" },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: Radio,
      href: "/leaderboard",
    },
    {
      id: "my-uploads",
      label: "My Archive",
      icon: FolderOpen,
      href: "/archive",
    },
  ];

  return (
    <aside className="w-80 border-r border-zinc-200 dark:border-white/10 flex flex-col backdrop-blur-2xl bg-white/96 dark:bg-black/60 h-screen sticky top-0 overflow-hidden transition-all duration-500">
      {/* Cyber-Atmospheric Decorative Orbs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/10 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-40 h-40 bg-purple-600/10 dark:bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      {/* Logo Section */}
      <div className="p-8 pb-10 flex items-center gap-4 relative group cursor-default">
        <div className="relative">
          <div className="absolute -inset-2 bg-blue-600/20 dark:bg-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="relative w-12 h-12 bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-xl shadow-black/[0.02] group-hover:border-blue-500/50 transition-colors">
            <Scan
              className="text-blue-600 dark:text-blue-500 group-hover:scale-110 transition-transform duration-500"
              size={24}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="font-black tracking-tighter uppercase italic text-2xl leading-none text-zinc-900 dark:text-white">
            Vault<span className="text-blue-600 dark:text-blue-400">.</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black tracking-[0.4em] text-zinc-400 dark:text-zinc-500 uppercase">
              Student // Node 0.1
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600 mb-6 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800"></span>
            Core Terminal
          </p>
          <nav className="space-y-2">
            {navItems.map(({ id, label, icon: Icon, href }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={id}
                  href={href}
                  className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-500 relative overflow-hidden border ${
                    isActive
                      ? "bg-blue-600/5 border-blue-600/20 text-blue-600 dark:text-white shadow-sm"
                      : "hover:bg-zinc-50 dark:hover:bg-white/[0.02] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4 z-10">
                    <div
                      className={`p-2 rounded-xl transition-all duration-500 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                          : "bg-zinc-100 dark:bg-white/5 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-white dark:group-hover:bg-white/10"
                      }`}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                        isActive
                          ? "opacity-100 translate-x-1"
                          : "opacity-60 group-hover:opacity-100"
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  {isActive && (
                    <div className="absolute right-0 top-0 h-full w-1 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Status Card
    <div className="px-2">
      <div className="p-5 rounded-[2rem] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 relative overflow-hidden group/status hover:border-blue-500/30 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500">Mainframe</p>
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
        </div>
        <p className="text-[11px] font-bold text-zinc-800 dark:text-white/80 leading-tight italic">SYNC_IN_PROGRESS</p>
        
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[8px] font-black text-zinc-400 uppercase tracking-tighter">
            <span>Uplink Data</span>
            <span className="text-blue-600">68%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out group-hover/status:bg-blue-400" 
              style={{ width: '68%' }} 
            />
          </div>
        </div>
      </div>
    </div> */}
      </div>

      {/* Bottom Action Section */}
      <div className="p-6 mt-auto border-t border-zinc-200 dark:border-white/5 space-y-2 bg-zinc-50/50 dark:bg-black/20">
        <Link
          href="/settings"
          className="flex items-center gap-4 p-3.5 rounded-xl text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 transition-all group border border-transparent hover:border-zinc-200 dark:hover:border-white/10"
        >
          <Settings
            size={18}
            className="group-hover:rotate-90 transition-transform duration-700"
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Settings
          </span>
        </Link>

        <button 
        onClick={handleLogout}
        className="w-full flex items-center gap-4 p-3.5 rounded-xl text-red-500/60 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all group border border-transparent hover:border-red-500/20">
          <div className="relative w-5 h-5 flex items-center justify-center">
            <Radio
              size={18}
              className="group-hover:animate-ping absolute inset-0 opacity-20"
            />
            <LogOut
              size={16}
              className="relative z-10 group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Log out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
