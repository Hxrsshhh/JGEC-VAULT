"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
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
    <>
      {/* --- FLIPPING LOGO TRIGGER (MOBILE ONLY) --- */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={`
          xl:hidden fixed top-3 left-4 z-130 
          w-10 h-10 perspective-[1000px] group
          ${isMobileOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <div className="relative w-full h-full transition-all duration-500 transform-3d group-hover:transform-[rotateY(180deg)]">
          {/* Front: Logo */}
          <div className="absolute inset-0 backface-hidden flex items-center justify-center bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/15 rounded-xl shadow-2xl">
            <Image src="/logo1.webp" height={50} width={50} alt="Logo" />
          </div>
          {/* Back: Menu Icon */}
          <div className="absolute inset-0 transform-[rotateY(180deg)] backface-hidden flex items-center justify-center bg-blue-600/20 border-1 border-blue-500 text-white rounded-xl shadow-2xl">
          <Menu size={18} className="text-blue-500" />
          </div>
        </div>
      </button>

      {/* --- OVERLAY BACKDROP --- */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-110 xl:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`
          fixed xl:sticky top-0 left-0 h-screen z-120
          flex flex-col border-r border-zinc-200 dark:border-white/10 
          backdrop-blur-2xl bg-white/30 dark:bg-black/20 
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
          <ChevronLeft
            className={`transition-transform duration-500 ${isCollapsed ? "rotate-180" : ""}`}
            size={14}
          />
        </button>

        {/* Mobile/Tab Close Button (RESTORED POSITION & UI) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileOpen(false);
          }}
          className="xl:hidden absolute top-10 right-6 z-130 p-2 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div
          className={`p-8 pb-10 flex items-center gap-4 relative group cursor-default ${isCollapsed ? "xl:justify-center" : "justify-start"}`}
        >
          <div className="relative shrink-0">
            <Image src="/logo1.webp" height={50} width={50} alt="Logo" />
          </div>
          <div
            className={`flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "xl:opacity-0 xl:w-0" : "opacity-100 w-auto"}`}
          >
            <h1 className="font-black tracking-tighter uppercase italic text-2xl text-zinc-900 dark:text-white">
              JGEC<span className="text-blue-600"> vault.</span>
            </h1>
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
                      : "hover:bg-zinc-50 dark:hover:bg-white/2 text-zinc-500 border-transparent"
                  } ${isCollapsed ? "xl:justify-center" : "justify-start gap-4"}`}
                >
                  <div
                    className={`p-2 rounded-xl transition-all duration-500 shrink-0 ${
                      isActive
                        ? "bg-blue-600 text-white scale-110"
                        : "bg-zinc-100 dark:bg-white/5"
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${
                      isCollapsed
                        ? "xl:hidden xl:opacity-0"
                        : "opacity-100 block"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section (RESTORED SETTINGS) */}
        <div
          className={`p-6 mt-auto border-t border-zinc-200 dark:border-white/5 space-y-2 bg-zinc-50/50 dark:bg-black/20 ${isCollapsed ? "xl:flex xl:flex-col xl:items-center" : ""}`}
        >
          <Link
            href="/settings"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-4 p-3.5 rounded-xl text-zinc-500 hover:text-zinc-900 transition-all ${isCollapsed ? "xl:w-12 xl:h-12 xl:justify-center xl:p-0" : "w-full"}`}
          >
            <Settings size={18} />
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${isCollapsed ? "xl:hidden" : "block"}`}
            >
              Settings
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 p-3.5 rounded-xl text-red-500/60 hover:text-red-600 transition-all ${isCollapsed ? "xl:w-12 xl:h-12 xl:justify-center xl:p-0" : "w-full"}`}
          >
            <LogOut size={18} />
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${isCollapsed ? "xl:hidden" : "block"}`}
            >
              Log out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
