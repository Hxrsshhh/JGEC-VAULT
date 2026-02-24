"use client";

import React from "react";
import YearGrid from "@/app/components/YearGrid";

const App = () => {
  return (
    <div
      className={` font-sans overflow-hidden flex bg-white/97 dark:bg-black/10 `}
    >
      <main className="flex-1 flex flex-col overflow-hidden z-10 relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <YearGrid />
        </div>
      </main>
    </div>
  );
};

export default App;
