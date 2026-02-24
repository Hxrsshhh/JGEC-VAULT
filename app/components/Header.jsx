"use client";

import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session, status } = useSession();
  
  return (
    <header className="h-16 md:h-20 px-4 md:px-10 flex items-center justify-between border-b border-zinc-200 dark:border-white/5 bg-white/96 dark:bg-transparent backdrop-blur-md transition-all duration-500 z-[10]">
      
      {/* Left Section: Branding & Status */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          {/* Hide long college name on mobile, show on tablet+ */}
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.6em] text-blue-600 dark:text-blue-500 line-clamp-1">
            <span className="md:hidden">JGEC Terminal</span>
            <span className="hidden md:inline">jalpaiguri government engineering college</span>
          </span>
          <span className="hidden sm:inline text-[7px] md:text-[8px] font-bold opacity-40 dark:opacity-30 uppercase tracking-[0.2em] text-zinc-500 dark:text-white">
            JGEC Decentralized Resource Network
          </span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse shrink-0" />
      </div>

      {/* Right Section: Search & Profile */}
      <div className="flex items-center gap-3 md:gap-8">
        
       

        {/* User Profile Section */}
        <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-8 border-l border-zinc-200 dark:border-white/5">
          <div className="text-right hidden xs:block">
            <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-50 dark:opacity-40 text-zinc-500 dark:text-white">
              Operator
            </p>
            <p className="text-[9px] md:text-[10px] font-bold text-zinc-900 dark:text-white">
             {session?.user?.name?.split(" ")[0] || "User"}
            </p>
          </div>

          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                height={40}
                width={40}
                alt="avatar"
                className="rounded-lg md:rounded-xl object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-lg md:rounded-xl bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                {session?.user?.name?.charAt(0) ?? "U"}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}