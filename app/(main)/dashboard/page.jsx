"use client";

import React, { useEffect, Suspense } from "react";
import YearGrid from "@/app/components/YearGrid";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const SearchParamsHandler = () => {
  const params = useSearchParams();
  const hasToasted = React.useRef(false); // 1. Track state across renders

  useEffect(() => {
    const isLogin = params.get("login") === "1";

    // 2. Only run if we have the param AND haven't shown the toast yet
    if (isLogin && !hasToasted.current) {
      hasToasted.current = true; // Mark as shown immediately

      toast.success("Logged in successfully 🚀", {
        description: "Welcome back to the JGEC Vault 3.",
      });

      // 3. Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [params]);

  return null;
};

const App = () => {
  return (
    <div className="font-sans min-h-screen overflow-hidden flex bg-white/10 dark:bg-black/20 transition-colors duration-500">
      {/* TACTICAL BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden z-10 relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          {/* Suspense is required for useSearchParams in Next.js App Router */}
          <Suspense fallback={null}>
            <SearchParamsHandler />
          </Suspense>
          
          <div className="py-8">
             <YearGrid />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;