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
  const [dragActive, setDragActive] = useState(false);
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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
  };

  const handleFileSelection = (file) => {
    if (file.type !== "application/pdf") return;
    if (file.size > 4 * 1024 * 1024) return;
    setSelectedFile(file);
    if (!formData.title) {
      setFormData((prev) => ({
        ...prev,
        title: file.name.replace(".pdf", "").toUpperCase(),
      }));
    }
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
    <div className="min-h-screen w-full flex flex-col bg-zinc-50 dark:bg-black/10 transition-colors duration-500 overflow-x-hidden">
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
            <div className="p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-black/20 shadow-xl">
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
          <div className="lg:col-span-7 flex flex-col min-h-[400px] md:min-h-[500px] order-1 lg:order-2">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex-1 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center p-6 md:p-8 text-center
                ${dragActive ? "border-blue-500 bg-blue-500/5 scale-[0.99]" : "border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/20"}
                ${uploadStatus === "success" ? "border-green-500 bg-green-500/5" : ""}
              `}
            >
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
                <div className="flex flex-col items-center w-full max-w-sm">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2.5rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 md:mb-8 cursor-pointer hover:scale-105 transition-transform group shadow-lg"
                  >
                    <CloudUpload
                      size={32}
                      className="text-blue-600 group-hover:scale-110 transition-transform md:w-10 md:h-10"
                    />
                  </div>
                  <h4 className="text-lg md:text-3xl font-black uppercase italic tracking-tighter dark:text-white mb-1 md:mb-2">
                    {selectedFile ? "File Ready." : "Drop Archive."}
                  </h4>
                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-zinc-400 mb-6 md:mb-10">
                    {selectedFile
                      ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB Detected`
                      : "PDF format only (Max 10MB)"}
                  </p>
                  <button
                    disabled={
                      (!formData.subjectCode && showSubjectField) ||
                      !selectedFile
                    }
                    onClick={handleUpload}
                    className={`w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3 transition-all
                      ${(!formData.subjectCode && showSubjectField) || !selectedFile ? "bg-zinc-100 dark:bg-white/5 text-zinc-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-xl shadow-blue-500/20"}
                    `}
                  >
                    Transmit Data <ChevronRight size={14} />
                  </button>
                </div>
              )}

              {uploadStatus === "uploading" && (
                <div className="w-full max-w-xs px-4">
                  <div className="relative mb-6 md:mb-10 flex justify-center">
                    <Loader2
                      size={100}
                      className="text-blue-600 animate-spin opacity-20 md:w-[150px] md:h-[150px]"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl md:text-3xl font-black italic text-blue-600">
                        {uploadProgress}%
                      </span>
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-400">
                        Syncing
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 md:h-2 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="flex flex-col items-center px-4">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4 md:mb-6">
                    <CheckCircle2
                      size={30}
                      className="text-green-500 md:w-10 md:h-10"
                    />
                  </div>
                  <h4 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter dark:text-white mb-1 md:mb-2">
                    Indexed.
                  </h4>
                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-green-600 mb-6 md:mb-8 text-center">
                    Asset pushed to global repository
                  </p>
                  <button
                    onClick={resetUpload}
                    className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest dark:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
                  >
                    New Transmission
                  </button>
                </div>
              )}

              <div className="absolute bottom-6 md:bottom-8 flex gap-4 md:gap-6 opacity-30 px-4">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <ShieldCheck size={10} />
                  <span className="text-[7px] md:text-[8px] font-black">
                    ENCRYPTED
                  </span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <FileText size={10} />
                  <span className="text-[7px] md:text-[8px] font-black">
                    PDF_MIME
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
