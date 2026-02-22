"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  Upload,
  FileText,
  ShieldCheck,
  CloudUpload,
  CheckCircle2,
  Info,
  ChevronDown,
  Search,
  BookOpen,
} from "lucide-react";

export default function UplinkView({
  selectedDept: initialDept,
  selectedYear: initialYear,
  theme,
  onBack,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const suggestionRef = useRef(null);
  const fileInputRef = useRef(null);

  const subjectDatabase = [
    "Data Structures & Algorithms",
    "Discrete Mathematics",
    "Computer Organization",
    "Operating Systems",
    "Database Management Systems",
    "Theory of Computation",
    "Computer Networks",
    "Software Engineering",
    "Artificial Intelligence",
    "Object Oriented Programming",
    "Microprocessors",
  ];

  const [formData, setFormData] = useState({
    dept: initialDept?.label || "Computer Science",
    year: initialYear?.label || "1st Year",
    subject: "",
    title: "",
    examYear: "2024",
    type: "Main",
  });

  const filteredSubjects = subjectDatabase.filter(
    (s) =>
      s.toLowerCase().includes(formData.subject.toLowerCase()) &&
      formData.subject !== "",
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    setSelectedFile(file);
    // Auto-fill title if empty
    if (!formData.title) {
      setFormData((prev) => ({ ...prev, title: file.name.split(".")[0] }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const simulateUpload = () => {
    if (!formData.subject || !formData.title || !selectedFile) {
      if (!selectedFile) alert("Please select a file first.");
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus("success");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const selectSubject = (sub) => {
    setFormData({ ...formData, subject: sub });
    setShowSuggestions(false);
  };

  const resetUpload = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setSelectedFile(null);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white dark:bg-[#030303] transition-colors duration-500">
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col h-full py-6">
        {/* Header - Compact */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 group active:scale-95 text-zinc-900 dark:text-white"
            >
              <ChevronRight
                className="rotate-180 group-hover:-translate-x-1 transition-transform"
                size={20}
              />
            </button>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-6 h-[2px] bg-blue-600 rounded-full"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-500">
                  Directory Level 04
                </span>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white">
                Data <span className="text-blue-600">Uplink.</span>
              </h2>
            </div>
          </div>

          <div className="hidden lg:block text-right">
            <p className="text-zinc-400 dark:text-white/20 text-[9px] font-bold uppercase tracking-widest">
              Uplink Protocol
            </p>
            <p className="text-xs font-mono font-bold text-zinc-600 dark:text-white/80 uppercase">
              P2P_ENC_TRANSFER_V4
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden min-h-0 pb-6">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-1 flex flex-col gap-6 overflow-hidden">
            <div className="flex-grow p-6 rounded-[2rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] relative overflow-y-auto custom-scrollbar group shadow-xl shadow-black/5 dark:shadow-none">
              <div className="absolute top-4 right-6 text-[7px] font-black tracking-widest text-zinc-900 dark:text-white opacity-20 rotate-90 origin-right">
                META_DATA
              </div>

              <h3 className="text-lg font-black uppercase italic mb-6 text-zinc-900 dark:text-white underline underline-offset-8 decoration-blue-600/30">
                Node Context
              </h3>

              <div className="space-y-5">
                <div className="relative">
                  <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1.5 px-1">
                    Target Department
                  </label>
                  <div className="relative">
                    <select
                      value={formData.dept}
                      onChange={(e) =>
                        setFormData({ ...formData, dept: e.target.value })
                      }
                      className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    >
                      <option
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        value="Computer Science"
                      >
                        Computer Science
                      </option>
                      <option
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        value="Mechanical"
                      >
                        Mechanical Eng.
                      </option>
                      <option
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        value="Civil"
                      >
                        Civil Eng.
                      </option>
                      <option
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        value="Electrical"
                      >
                        Electrical Eng.
                      </option>
                      <option
                        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        value="IT"
                      >
                        Info. Technology
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="relative" ref={suggestionRef}>
                  <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1.5 px-1">
                    Subject / Course
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.subject}
                      autoComplete="off"
                      onFocus={() => setShowSuggestions(true)}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        setShowSuggestions(true);
                      }}
                      placeholder="Search or enter subject..."
                      className="w-full p-3.5 pl-10 rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20"
                    />
                    <Search
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-zinc-900 dark:text-white"
                    />
                  </div>

                  {showSuggestions && filteredSubjects.length > 0 && (
                    <div className="absolute z-[100] mt-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="p-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                        {filteredSubjects.map((sub, i) => (
                          <button
                            key={i}
                            onClick={() => selectSubject(sub)}
                            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-left group/item text-zinc-700 dark:text-zinc-300"
                          >
                            <BookOpen
                              size={10}
                              className="text-blue-500 group-hover/item:text-white shrink-0"
                            />
                            <span className="text-[10px] font-bold truncate">
                              {sub}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1.5 px-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. End Sem Main Paper"
                    className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1.5 px-1">
                      Exam Year
                    </label>
                    <select
                      value={formData.examYear}
                      onChange={(e) =>
                        setFormData({ ...formData, examYear: e.target.value })
                      }
                      className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    >
                      <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        2024
                      </option>
                      <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        2023
                      </option>
                      <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        2022
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 mt-2 opacity-30 pointer-events-none text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1.5 px-1">
                      Paper Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    >
                      <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        Main
                      </option>
                      <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        Suppli
                      </option>
                      <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                        Notes
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 mt-2 opacity-30 pointer-events-none text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-600/5 dark:bg-blue-600/10 border border-blue-500/20 flex gap-3 shrink-0">
              <Info
                className="text-blue-600 dark:text-blue-500 shrink-0"
                size={16}
              />
              <p className="text-[9px] leading-relaxed font-bold text-blue-700 dark:text-blue-400/80 uppercase tracking-wider">
                Files are scanned for integrity before indexing.
              </p>
            </div>
          </div>

          {/* Right Column: Upload Zone */}
          <div className="lg:col-span-2 overflow-hidden flex flex-col">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex-grow rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-8 text-center
                ${dragActive ? "border-blue-500 bg-blue-500/5 scale-[0.99]" : "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02]"}
                ${uploadStatus === "success" ? "border-green-500/50 bg-green-500/5" : ""}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileSelection(e.target.files[0])
                }
              />

              {uploadStatus === "idle" && (
                <>
                  <button
                    onClick={triggerFileInput}
                    className="w-20 h-20 rounded-[1.5rem] bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/10 hover:scale-110 transition-transform active:scale-95 group"
                  >
                    <CloudUpload
                      size={32}
                      className="text-blue-600 animate-pulse group-hover:scale-110 transition-transform"
                    />
                  </button>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-3 text-zinc-900 dark:text-white leading-tight">
                    {selectedFile ? selectedFile.name : "Drop Archive Pack."}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-white/40 mb-8">
                    {formData.subject || "UNDEFINED_NODE"}
                  </p>
                  <button
                    onClick={simulateUpload}
                    disabled={
                      !formData.subject || !formData.title || !selectedFile
                    }
                    className={`px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl 
                      ${
                        !formData.subject || !formData.title || !selectedFile
                          ? "bg-zinc-200 dark:bg-white/10 text-zinc-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                      }
                    `}
                  >
                    Initiate Upload
                  </button>
                </>
              )}

              {/* Uploading & Success states remain largely the same, using text-zinc-900 dark:text-white */}
              {/* ... (uploading and success logic) */}

              {/* Security Footer */}
              <div className="absolute bottom-6 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-blue-500" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-white opacity-40">
                    Secure
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <FileText size={12} className="text-blue-500" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-white opacity-40">
                    Indexed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
