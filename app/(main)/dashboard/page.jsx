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
    const isSignup = params.get("signup") === "1";

    if (!hasToasted.current && (isLogin || isSignup)) {
      hasToasted.current = true;

      if (isLogin) {
        toast.success("Logged in successfully 🚀", {
          description: "Welcome back to the JGEC Vault.",
        });
      }

      if (isSignup) {
        toast.success("Account created successfully 🎉", {
          description: "Your node is now active.",
        });
      }

      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      url.searchParams.delete("signup");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [params]);

  return null;
};

const App = () => {
  return (
    <div className="font-sans h-max-screen overflow-hidden flex bg-white/10 dark:bg-black/20 transition-colors duration-500">
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

          <div className="">
            <YearGrid />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
