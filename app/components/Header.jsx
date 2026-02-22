"use client";

import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 px-10 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-500">
            Vanguard Archive
          </span>
          <span className="text-[8px] font-bold opacity-30 uppercase tracking-[0.2em]">
            JGEC Decentralized Resource Network
          </span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group">
          <Search
            className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity"
            size={16}
          />
          <input
            type="text"
            placeholder="SYSTEM SEARCH"
            className="bg-transparent border-none pl-8 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none w-48 placeholder:opacity-20"
          />
        </div>

        <div className="flex items-center gap-3 pl-8 border-l border-white/5">
          <div className="text-right">
            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">
              Operator
            </p>
            <p className="text-[10px] font-bold">ARCHIVIST_01</p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black hover:bg-white/10 transition-colors">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}