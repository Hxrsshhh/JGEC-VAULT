"use client";

import React, { useState, useEffect, useRef, Activity } from "react";
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
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import subjectDatabase from "@/lib/subjectDatabase";

export default function App({
  selectedDept: initialDept,
  selectedYear: initialYear,
  onBack,
}) {
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const suggestionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Schema-aligned Form State
  const [formData, setFormData] = useState({
    subjectCode: "",
    title: "",
    department: initialDept?.label || "IT",
    academicYear: initialYear?.id || "1",
    pageType: "yearwise",
    examType: "mid",
    paperType: "regular",
    examYear: new Date().getFullYear().toString(),
  });

  const filteredSubjects = subjectDatabase.filter(
    (s) =>
      s.toLowerCase().includes(formData.subjectCode.toLowerCase()) &&
      formData.subjectCode !== "",
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

  const handleFileSelection = (file) => {
    if (!file) return;

    const maxSize = 4 * 1024 * 1024; // 4MB

    // check file type
    if (!file.type.includes("pdf")) {
      toast.error("Only PDF files are allowed");
      return;
    }

    // check file size
    if (file.size > maxSize) {
      toast.error("File must be smaller than 4MB");
      return;
    }

    // set file
    setSelectedFile(file);

    // auto-fill title if empty
    setFormData((prev) => {
      if (prev.title) return prev;

      const cleanedName = file.name
        .replace(/\.pdf$/i, "")
        .replace(/[_-]/g, " ")
        .toUpperCase();

      return {
        ...prev,
        title: cleanedName,
      };
    });

    toast.success(`File selected: ${file.name}`);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    const data = new FormData();
    data.append("file", selectedFile);

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key] || "");
    });

    try {
      setUploadStatus("uploading");
      setUploadProgress(0);

      const xhr = new XMLHttpRequest();

      xhr.open("POST", "/api/papers/upload");

      // track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setUploadStatus("success");
          toast.success("Paper uploaded successfully 🎉");
        } else {
          setUploadStatus("idle");
          toast.error("Upload failed");
        }
      };

      xhr.onerror = () => {
        setUploadStatus("idle");
        toast.error("Network error during upload");
      };

      xhr.send(data);
    } catch (err) {
      console.error(err);
      setUploadStatus("idle");
      toast.error("Something went wrong");
    }
  };

  const resetUpload = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setSelectedFile(null);
  };

  // Logic Helpers
  const isYearwiseOrNotes =
    formData.pageType === "yearwise" || formData.pageType === "notes";
  const showTitleField = isYearwiseOrNotes;
  const showSubjectField = formData.pageType === "subjectwise";

  return (
    <div className="min-h-screen w-full flex flex-col bg-zinc-50/10 dark:bg-black/10 transition-colors duration-500 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
            >
              <ChevronRight
                className="rotate-180 text-zinc-900 dark:text-white"
                size={18}
              />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Uplink Protocol
                </span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white leading-none">
                Data <span className="text-blue-600">Vault.</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left: Metadata Form */}
          <div className="lg:col-span-5 flex flex-col gap-5 md:gap-6 order-2 lg:order-1">
            <div className="p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-white/30 dark:bg-black/20 shadow-xl">
              <h3 className="text-xs md:text-sm font-black uppercase italic mb-5 md:mb-6 text-zinc-400 flex items-center gap-2">
                <Search size={14} /> Schema Parameters
              </h3>

              <div className="space-y-4 md:space-y-5">
                {/* 1. Department & Page Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full p-3 md:p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {["CSE", "ECE", "ME", "EE", "CE", "IT"].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">
                      Page Category
                    </label>
                    <select
                      value={formData.pageType}
                      onChange={(e) =>
                        setFormData({ ...formData, pageType: e.target.value })
                      }
                      className="w-full p-3 md:p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="yearwise">Yearwise</option>
                      <option value="subjectwise">Subjectwise</option>
                      <option value="notes">Notes</option>
                    </select>
                  </div>
                </div>

                {/* 2. Conditional Title Field (Yearwise/Notes Only) */}
                {showTitleField && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">
                      Display Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="E.G. 2024 END SEM SUPPLEMENTARY"
                      className="w-full p-3 md:p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold dark:text-white outline-none focus:border-blue-500 transition-all focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                )}

                {/* 3. Subject Search (Subjectwise Only) */}
                {showSubjectField && (
                  <div
                    className="relative animate-in fade-in slide-in-from-top-2 duration-300"
                    ref={suggestionRef}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
                        Subject Code
                      </label>
                      {formData.subjectCode && (
                        <span className="text-[8px] font-bold text-blue-500 uppercase tracking-tighter animate-pulse">
                          Format: DEPT-CODE
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.subjectCode}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            subjectCode: e.target.value,
                          });
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full p-3 md:p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold dark:text-white focus:border-blue-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Search Code (e.g. CS301)"
                      />
                    </div>

                    {showSuggestions && formData.subjectCode !== "" && (
                      <div className="absolute z-50 mt-2 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto overflow-x-hidden">
                        {filteredSubjects.length > 0 ? (
                          filteredSubjects.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setFormData({ ...formData, subjectCode: s });
                                setShowSuggestions(false);
                              }}
                              className="w-full p-3 text-left text-[10px] md:text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors border-b border-zinc-100 dark:border-white/5 last:border-0"
                            >
                              {s}
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center">
                            <AlertCircle
                              className="mx-auto mb-2 text-zinc-400"
                              size={16}
                            />
                            <p className="text-[10px] font-bold text-zinc-500 uppercase italic">
                              No Matches Found
                            </p>
                            <p className="text-[8px] text-zinc-400 mt-1">
                              Try typing just the numbers or short code.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Exam Parameters */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">
                      Exam Type
                    </label>
                    <select
                      value={formData.examType}
                      onChange={(e) =>
                        setFormData({ ...formData, examType: e.target.value })
                      }
                      className="w-full p-3 md:p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="mid">Mid-Sem</option>
                      <option value="end">End-Sem</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">
                      Origin
                    </label>
                    <select
                      value={formData.paperType}
                      onChange={(e) =>
                        setFormData({ ...formData, paperType: e.target.value })
                      }
                      className="w-full p-3 md:p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="regular">Regular</option>
                      <option value="internal">Internal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">
                      Acdemic Year
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({ ...formData, semester: e.target.value })
                      }
                      className="w-full p-3 md:p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {[1, 2, 3, 4].map((s) => (
                        <option key={s} value={s}>
                          YEAR {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">
                      Exam Year
                    </label>
                    <input
                      type="number"
                      value={formData.examYear}
                      onChange={(e) =>
                        setFormData({ ...formData, examYear: e.target.value })
                      }
                      className="w-full p-3 md:p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-blue-600/5 border border-blue-500/20 flex gap-3 md:gap-4 items-start">
              <Info className="text-blue-500 shrink-0" size={18} />
              <p className="text-[8px] md:text-[10px] leading-relaxed font-bold text-blue-700/80 dark:text-blue-400/80 uppercase tracking-widest">
                Validation: {showSubjectField ? "subjectCode, " : ""}department,
                and semester are mandatory for indexing.
              </p>
            </div>
          </div>

          {/* Right: Interaction Zone */}

          <div className="lg:col-span-7 flex flex-col min-h-112.5 md:min-h-137.5 lg:min-h-150 order-1 lg:order-2 w-full">
            <div
              className={`relative flex-1 rounded-[2.5rem] md:rounded-[3.5rem] border transition-all duration-700 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 text-center backdrop-blur-xl overflow-hidden
      ${
        uploadStatus === "success"
          ? "border-green-500/50 bg-green-500/5"
          : "border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 shadow-2xl"
      }
    `}
            >
              {/* Decorative Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileSelection(e.target.files[0])
                }
              />

              {uploadStatus === "idle" && (
                <div className="flex flex-col items-center w-full max-w-md animate-in fade-in zoom-in duration-500">
                  {/* Enhanced Select Portal */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative w-full aspect-square max-w-40 sm:max-w-50 md:max-w-65 flex flex-col items-center justify-center cursor-pointer"
                  >
                    {/* Outer Pulsing Rings */}
                    <div className="absolute inset-0 rounded-[3rem] bg-blue-600/5 border border-blue-600/10 animate-pulse" />
                    <div className="absolute inset-2 sm:inset-4 rounded-[2.5rem] border border-dashed border-blue-600/20 group-hover:rotate-90 transition-transform duration-1000" />

                    <div className="relative flex flex-col items-center transition-transform duration-500 group-hover:scale-110">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-950 shadow-xl flex items-center justify-center mb-3 sm:mb-4 border border-zinc-100 dark:border-white/5">
                        <CloudUpload
                          size={28}
                          className={`${selectedFile ? "text-green-500" : "text-blue-600"} transition-colors sm:w-10 sm:h-10`}
                        />
                      </div>
                      <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                        {selectedFile ? "Replace Payload" : "Initialize Source"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-10 px-2">
                    <h4 className="text-xl sm:text-2xl md:text-4xl font-black uppercase italic tracking-tighter dark:text-white mb-1 leading-tight truncate max-w-70 sm:max-w-full">
                      {selectedFile
                        ? selectedFile.name.split(".").shift()
                        : "System Idle"}
                    </h4>
                    <p className="text-[7px] sm:text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 sm:mb-10">
                      {selectedFile
                        ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB CRC_OK`
                        : "Awaiting PDF Input (10MB Limit)"}
                    </p>
                  </div>

                  <button
                    disabled={
                      (!formData.subjectCode && showSubjectField) ||
                      !selectedFile
                    }
                    onClick={handleUpload}
                    className={`w-full sm:w-auto px-8 sm:px-14 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[9px] sm:text-xs flex items-center justify-center gap-3 transition-all
            ${
              (!formData.subjectCode && showSubjectField) || !selectedFile
                ? "bg-zinc-100 dark:bg-white/5 text-zinc-500 cursor-not-allowed border border-zinc-200 dark:border-white/5"
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] border-b-4 border-blue-800"
            }
          `}
                  >
                    Begin Transmission{" "}
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              )}

              {uploadStatus === "uploading" && (
                <div className="w-full max-w-xs px-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="relative mb-8 md:mb-12 flex justify-center">
                    <Loader2
                      size={120}
                      className="text-blue-600 animate-spin opacity-10 sm:w-45 sm:h-45"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-4xl font-black italic text-blue-600 drop-shadow-sm">
                        {uploadProgress}%
                      </span>
                      <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mt-2">
                        Syncing Portal
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden border border-zinc-200/20 shadow-inner">
                    <div
                      className="h-full bg-linear-to-r from-blue-600 to-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="flex flex-col items-center px-4 animate-in zoom-in-95 duration-700">
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6 overflow-hidden">
                    <div className="absolute inset-0 bg-green-500/20 animate-pulse" />
                    <CheckCircle2
                      size={40}
                      className="text-green-500 sm:w-12 sm:h-12 relative z-10"
                    />
                  </div>
                  <h4 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter dark:text-white mb-2 leading-none">
                    Asset Indexed
                  </h4>
                  <p className="text-[8px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-green-600 mb-8 sm:mb-12 text-center max-w-50 sm:max-w-full">
                    Encrypted payload secured in global repo
                  </p>
                  <button
                    onClick={resetUpload}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-zinc-200 dark:border-white/10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest dark:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-all shadow-md active:translate-y-0.5"
                  >
                    New Protocol Initialization
                  </button>
                </div>
              )}

              {/* Footer Status Dashboard - Hid on very small screens to save space */}
              <div className="hidden xs:flex absolute bottom-6 md:bottom-10 gap-6 md:gap-10 opacity-30 px-6 border-t border-zinc-500/10 pt-4 w-full justify-center">
                <div className="flex items-center gap-2 group transition-opacity hover:opacity-100">
                  <ShieldCheck size={12} className="text-blue-500" />
                  <span className="text-[7px] md:text-[9px] font-black tracking-widest uppercase">
                    RSA-4096_ENCR
                  </span>
                </div>
                <div className="flex items-center gap-2 group transition-opacity hover:opacity-100">
                  <Activity size={12} className="text-indigo-500" />
                  <span className="text-[7px] md:text-[9px] font-black tracking-widest uppercase">
                    LATENCY: 14ms
                  </span>
                </div>
                <div className="flex items-center gap-2 group transition-opacity hover:opacity-100">
                  <FileText size={12} className="text-blue-400" />
                  <span className="text-[7px] md:text-[9px] font-black tracking-widest uppercase">
                    MIME: PDF_V1.7
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
