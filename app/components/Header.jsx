"use client";

import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 px-10 flex items-center justify-between border-b border-zinc-200 dark:border-white/5 bg-white/96 dark:bg-transparent backdrop-blur-md transition-colors duration-500">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-600 dark:text-blue-500">
            jalpaiguri government engineering college
          </span>
          <span className="text-[8px] font-bold opacity-40 dark:opacity-30 uppercase tracking-[0.2em] text-zinc-500 dark:text-white">
            JGEC Decentralized Resource Network
          </span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group">
          <Search
            className="absolute left-0 top-1/2 -translate-y-1/2 opacity-30 dark:opacity-20 group-focus-within:opacity-100 transition-opacity text-zinc-900 dark:text-white"
            size={16}
          />
          <input
            type="text"
            placeholder="SYSTEM SEARCH"
            className="bg-transparent border-none pl-8 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none w-48 placeholder:text-zinc-400 dark:placeholder:text-white placeholder:opacity-40 dark:placeholder:opacity-20 text-zinc-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 pl-8 border-l border-zinc-200 dark:border-white/5">
          <div className="text-right">
            <p className="text-[8px] font-black uppercase tracking-widest opacity-50 dark:opacity-40 text-zinc-500 dark:text-white">
              Operator
            </p>
            <p className="text-[10px] font-bold text-zinc-900 dark:text-white">ARCHIVIST_01</p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}