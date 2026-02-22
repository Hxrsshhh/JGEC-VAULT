"use client";

import React, { useState } from "react";
import { Cpu, Radio, Zap, HardHat, Network, Settings } from "lucide-react";
import Header from "@/app/components/Header";
import YearGrid from "@/app/components/YearGrid";
import DepartmentGrid from "@/app/components/DepartmentGrid";
import ResourceView from "@/app/components/ResourseView";

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  const academicYears = [
    {
      id: 1,
      label: "1st Year",
      code: "Y1",
      desc: "Foundational Sciences & Engineering Mathematics",
    },
    {
      id: 2,
      label: "2nd Year",
      code: "Y2",
      desc: "Core Departmental Fundamentals & Lab Work",
    },
    {
      id: 3,
      label: "3rd Year",
      code: "Y3",
      desc: "Advanced Technical Subjects & Specializations",
    },
    {
      id: 4,
      label: "4th Year",
      code: "Y4",
      desc: "Electives, Major Projects & Industrial Prep",
    },
  ];

  const departments = [
    {
      id: "cse",
      label: "Computer Science",
      code: "CSE",
      icon: Cpu,
      color: "from-emerald-500/20 to-emerald-600/5",
      border: "group-hover:border-emerald-500/50",
      accent: "emerald-500", // Simplified to color name for easier mapping
      stats: "1.2k Files",
    },
    {
      id: "it",
      label: "Information Tech",
      code: "IT",
      icon: Network,
      color: "from-cyan-500/20 to-cyan-600/5",
      border: "group-hover:border-cyan-500/50",
      accent: "cyan-500",
      stats: "980 Files",
    },
    {
      id: "ece",
      label: "Electronics & Comm",
      code: "ECE",
      icon: Radio,
      color: "from-blue-500/20 to-blue-600/5",
      border: "group-hover:border-blue-500/50",
      accent: "blue-500",
      stats: "850 Files",
    },
    {
      id: "ee",
      label: "Electrical Eng",
      code: "EE",
      icon: Zap,
      color: "from-amber-500/20 to-amber-600/5",
      border: "group-hover:border-amber-500/50",
      accent: "amber-500",
      stats: "920 Files",
    },
    {
      id: "me",
      label: "Mechanical Eng",
      code: "ME",
      icon: Settings,
      color: "from-rose-500/20 to-rose-600/5",
      border: "group-hover:border-rose-500/50",
      accent: "rose-500",
      stats: "1.1k Files",
    },
    {
      id: "ce",
      label: "Civil Engineering",
      code: "CE",
      icon: HardHat,
      color: "from-orange-500/20 to-orange-600/5",
      border: "group-hover:border-orange-500/50",
      accent: "orange-500",
      stats: "740 Files",
    },
  ];

  const theme = {
    bg: isDarkMode ? "bg-[#030305]" : "bg-[#f8faff]",
    card: isDarkMode
      ? "bg-white/[0.02] border-white/[0.06]"
      : "bg-white shadow-sm border-slate-200",
    text: isDarkMode ? "text-white" : "text-slate-900",
    textMuted: isDarkMode ? "text-white/40" : "text-slate-500",
    sidebar: isDarkMode
      ? "bg-black/20 border-white/[0.05]"
      : "bg-white border-slate-200",
  };

  return (
    <div
      className={`h-max-screen  font-sans overflow-hidden flex bg-white/97 dark:bg-black/10 `}
    >
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] dark:bg-blue-600/[0.07] blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] dark:bg-indigo-600/[0.07] blur-[140px] rounded-full" />
      </div>

      <main className="flex-1 flex flex-col h-screen  overflow-hidden z-10 relative">
        <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar">
          {activeTab === "dashboard" && (
            <YearGrid
              academicYears={academicYears}
              onSelectYear={(year) => {
                setSelectedYear(year);
                setActiveTab("departments");
              }}
            />
          )}

          {activeTab === "departments" && (
            <DepartmentGrid
              departments={departments}
              selectedYear={selectedYear}
              theme={theme}
              onBack={() => {
                setActiveTab("dashboard");
                setSelectedYear(null);
              }}
              onSelectDept={(dept) => {
                setSelectedDept(dept);
                setActiveTab("resources");
              }}
            />
          )}

          {activeTab === "resources" && (
            <ResourceView
              selectedDept={selectedDept}
              selectedYear={selectedYear}
              theme={theme}
              onBack={() => {
                setActiveTab("departments");
                setSelectedDept(null);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
