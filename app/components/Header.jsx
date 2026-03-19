"use client";

import { LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({
      callbackUrl: "/?logout=success",
    });
  };

  return (
    <header className="h-16 md:h-20 px-4 md:px-10 flex items-center justify-between border-b border-zinc-200 dark:border-white/25 bg-white/30 dark:bg-black/50 backdrop-blur-md transition-all duration-500 z-90 sticky top-0">
      {/* Left Section: Adjusted for Sidebar Trigger space */}
      <div className="flex items-center gap-3 ml-12 lg:ml-0 transition-all">
        <div className="flex flex-col relative group cursor-default">
          {/* Main Branding Line */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="relative text-[13px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.5em] flex items-center">
              {/* The "JGEC" part with a subtle gradient */}
              <span className="bg-clip-text text-transparent bg-linear-to-br from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300">
                <span className="md:hidden">JGEC Vault</span>
                <span className="hidden xs:inline md:hidden">
                  JGEC Terminal
                </span>
                <span className="hidden md:inline md:ml-8">
                  jalpaiguri government engineering college
                </span>
              </span>

              {/* Subtle Scanline Animation Effect */}
              <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            </span>

            {/* Tactical Dot Indicator */}
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
            </span>
          </div>

          {/* Subtitle / Metadata Line */}
          <div className="flex items-center gap-2 mt-0.5 md:ml-8">
            <div className="h-px w-3 bg-blue-600/30 dark:bg-blue-400/20" />
            <span className="font-mono text-[7px] md:text-[8px] font-bold opacity-50 dark:opacity-30 uppercase tracking-[0.25em] text-zinc-500 dark:text-white whitespace-nowrap">
              System.Stable //{" "}
              <span className="text-blue-600 dark:text-blue-400">Node_01</span>
            </span>
          </div>

          {/* Bottom Decorative Border (Cyberpunk style) */}
          <div className="absolute -bottom-2 left-0 w-0 h-px bg-blue-600/50 group-hover:w-full transition-all duration-700" />
        </div>

        <div className="hidden xs:block w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse shrink-0" />
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* --- TERMINATE BUTTON --- */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all group active:scale-95"
          title="Terminate Session"
        >
          <LogOut
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="hidden lg:block text-[9px] font-black uppercase tracking-widest">
            Terminate
          </span>
        </button>

        {/* User Profile Section */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-6 border-l border-zinc-200 dark:border-white/5">
          <div className="text-right hidden sm:block">
            <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-40 text-zinc-500 dark:text-white">
              Operator
            </p>
            <p className="text-[9px] md:text-[10px] font-bold text-zinc-900 dark:text-white">
              {session?.user?.name?.split(" ")[0] || "User"}
            </p>
          </div>

          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer shrink-0 overflow-hidden ring-offset-2 ring-offset-white dark:ring-offset-black hover:ring-2 ring-blue-500/30">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                height={40}
                width={40}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black uppercase">
                {session?.user?.name?.charAt(0) ?? "U"}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
