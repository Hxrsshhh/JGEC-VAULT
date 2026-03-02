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
} from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import subjectDatabase from "@/lib/subjectDatabase";

export default function UplinkView({
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

  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    dept: initialDept?.label || "IT",
    year: initialYear?.label || "1st Year",
    subject: "",
    title: "",
    examYear: "2026",
    type: "Regular",
    semester: "1",
    academicYear: initialYear?.id || "1",
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
    if (file.type !== "application/pdf") {
      toast.info("Only PDF files allowed");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.info("Max file size is 4MB");
      return;
    }
    setSelectedFile(file);
    if (!formData.title) {
      setFormData((prev) => ({
        ...prev,
        title: file.name.replace(".pdf", ""),
      }));
    }
  };

  const router = useRouter();

  const handleUpload = async () => {
    try {
      setUploadStatus("uploading");
      setUploadProgress(0);

      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subjectCode", formData.subject);
      formDataToSend.append("department", formData.dept);
      formDataToSend.append("semester", Number(formData.semester));
      formDataToSend.append("academicYear", Number(formData.academicYear));
      formDataToSend.append("examType", formData.type);
      formDataToSend.append("year", Number(formData.examYear));
      formDataToSend.append("uploadedBy", session?.user?.id || "anonymous");

      const res = await axios.post("/api/papers", formDataToSend, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);
        },
      });

      setUploadStatus("success");
      toast.success("Upload complete.", {
        description: "The file has been securely stored in the Vault.",
      });
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message || "Server rejected the upload request.";

      toast.error("Upload failed.", {
        description: backendMessage,
      });

      setUploadStatus("idle");
    }
  };

  const resetUpload = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setSelectedFile(null);
  };

  return (
    <div className=" lg:h-max-screen w-full flex flex-col bg-white/10 dark:bg-black/10 transition-colors duration-500 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 group active:scale-95 text-zinc-900 dark:text-white"
            >
              <ChevronRight
                className="rotate-180 group-hover:-translate-x-1 transition-transform"
                size={20}
              />
            </button>

            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <span className="w-4 sm:w-6 h-0.5 bg-blue-600 rounded-full"></span>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-500">
                  Secure Protocol V4
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white">
                Data <span className="text-blue-600">Uplink.</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 border-zinc-100 dark:border-white/5 pt-4 md:pt-0">
            <p className="text-zinc-400 dark:text-white/20 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest">
              Access Node
            </p>
            <p className="text-[10px] sm:text-xs font-mono font-bold text-zinc-600 dark:text-white/80 uppercase">
              {session?.user?.name || "GUEST_USER"}@INTERNAL
            </p>
          </div>
        </div>

        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: Form Details (4 cols on Desktop) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
            <div className="p-5 sm:p-8 rounded-4xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/3 shadow-xl shadow-black/5 relative overflow-hidden">
              <h3 className="text-base sm:text-lg font-black uppercase italic mb-6 text-zinc-900 dark:text-white flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Node Context
              </h3>

              <div className="space-y-5">
                {/* Department Select */}
                <div className="relative">
                  <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1.5 px-1">
                    Target Department
                  </label>
                  <div className="relative group">
                    <select
                      value={formData.dept}
                      onChange={(e) =>
                        setFormData({ ...formData, dept: e.target.value })
                      }
                      className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white focus:border-blue-500 outline-none appearance-none cursor-pointer transition-colors"
                    >
                      <option value="IT">Info. Technology</option>
                      <option value="CSE">Computer Science</option>
                      <option value="ECE">
                        Electronics and Communation Eng.
                      </option>
                      <option value="EE">Electrical Eng.</option>
                      <option value="ME">Mechanical Eng.</option>
                      <option value="CE">Civil Eng.</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none text-zinc-900 dark:text-white group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>

                {/* Subject Input with Suggestions */}
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
                      placeholder="Search course..."
                      className="w-full p-3.5 pl-10 rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                    />
                    <Search
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-zinc-900 dark:text-white"
                    />
                  </div>

                  {showSuggestions && filteredSubjects.length > 0 && (
                    <div className="absolute z-100 mt-2 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="p-1.5 max-h-48 overflow-y-auto">
                        {filteredSubjects.map((sub, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setFormData({ ...formData, subject: sub });
                              setShowSuggestions(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-left group/item"
                          >
                            <BookOpen
                              size={12}
                              className="text-blue-500 group-hover/item:text-white shrink-0"
                            />
                            <span className="text-xs font-bold truncate">
                              {sub}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Title */}
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
                    placeholder="e.g. End Sem Paper"
                    className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white focus:border-blue-500 outline-none"
                  />
                </div>

                {/* NEW: Semester & Academic Year Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1.5 px-1">
                      Academic Year
                    </label>
                    <div className="relative group">
                      <select
                        value={formData.academicYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            academicYear: e.target.value,
                          })
                        }
                        className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white appearance-none outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1.5 px-1">
                      Semester
                    </label>
                    <div className="relative group">
                      <select
                        value={formData.semester}
                        onChange={(e) =>
                          setFormData({ ...formData, semester: e.target.value })
                        }
                        className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white appearance-none outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Year & Type Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1.5 px-1">
                      Year
                    </label>
                    <select
                      value={formData.examYear}
                      onChange={(e) =>
                        setFormData({ ...formData, examYear: e.target.value })
                      }
                      className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white appearance-none outline-none"
                    >
                      <option>2026</option>
                      <option>2025</option>
                      <option>2024</option>
                      <option>2023</option>
                      <option>2022</option>
                      <option>2021</option>
                      <option>2020</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 bottom-4 opacity-30 pointer-events-none dark:text-white"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-1.5 px-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-bold text-zinc-900 dark:text-white appearance-none outline-none"
                    >
                      <option>Regular</option>
                      <option>Supple</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 bottom-4 opacity-30 pointer-events-none dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scanning Info Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-600/5 dark:bg-blue-600/10 border border-blue-500/20 flex gap-4">
              <Info
                className="text-blue-600 dark:text-blue-500 shrink-0"
                size={18}
              />
              <p className="text-[10px] leading-relaxed font-bold text-blue-700 dark:text-blue-400/80 uppercase tracking-wider">
                Encryption Layer: AES-256. Files are scanned for integrity
                before indexing.
              </p>
            </div>
          </div>

          {/* Right: Upload Zone (7-8 cols on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col order-1 lg:order-2 min-h-100">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative grow rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-6 sm:p-12 text-center
                ${dragActive ? "border-blue-500 bg-blue-500/5 scale-[0.98]" : "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/2"}
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
                <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-4xl sm:rounded-[3rem] bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/10 hover:scale-105 transition-transform group relative"
                  >
                    <CloudUpload
                      size={48}
                      className="text-blue-600 group-hover:scale-110 transition-transform relative z-10"
                    />
                    <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>

                  <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tighter italic mb-3 text-zinc-900 dark:text-white leading-tight">
                    {selectedFile ? selectedFile.name : "Select Archive."}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-white/40 mb-10">
                    {selectedFile
                      ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                      : "Drag and drop or click to browse"}
                  </p>

                  <button
                    onClick={handleUpload}
                    disabled={
                      !formData.subject || !formData.title || !selectedFile
                    }
                    className={`group relative px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all
                      ${
                        !formData.subject || !formData.title || !selectedFile
                          ? "bg-zinc-200 dark:bg-white/10 text-zinc-400 cursor-not-allowed opacity-50"
                          : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      Initiate Uplink
                      <ChevronRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </button>
                </div>
              )}

              {uploadStatus === "uploading" && (
                <div className="w-full max-w-md px-6 animate-in fade-in zoom-in duration-500">
                  <div className="relative mb-12 flex justify-center">
                    <Loader2
                      size={100}
                      className="text-blue-600 animate-spin opacity-20"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black italic text-blue-600 leading-none">
                        {uploadProgress}
                        <span className="text-sm ml-1">%</span>
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mt-1">
                        Synced
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white italic">
                        Transferring Data...
                      </span>
                    </div>

                    {/* ENHANCED PROGRESS BAR */}
                    <div className="w-full h-4 bg-zinc-200 dark:bg-white/5 rounded-full p-1 overflow-hidden border border-zinc-300 dark:border-white/10">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        {/* Animated Scanning Shine */}
                        <div className="absolute inset-0 w-20 bg-white/30 skew-x-12 animate-[scan_1.5s_infinite] shadow-[0_0_20px_#fff]"></div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-8 mt-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${uploadProgress > 30 ? "bg-blue-500 animate-pulse" : "bg-zinc-700"}`}
                        ></div>
                        <span className="text-[8px] font-black text-zinc-400">
                          ENCRYPTING
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${uploadProgress > 70 ? "bg-blue-500 animate-pulse" : "bg-zinc-700"}`}
                        ></div>
                        <span className="text-[8px] font-black text-zinc-400">
                          VERIFYING
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="animate-in zoom-in fade-in duration-700 flex flex-col items-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-green-500/10 border-4 border-green-500/20 flex items-center justify-center mb-8 relative">
                    <CheckCircle2
                      size={56}
                      className="text-green-500 relative z-10"
                    />
                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic text-zinc-900 dark:text-white mb-3">
                    Upload Success.
                  </h3>
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-green-600 dark:text-green-500 mb-10">
                    Object indexed in global directory
                  </p>
                  <button
                    onClick={resetUpload}
                    className="flex items-center gap-3 px-8 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all active:scale-95"
                  >
                    <Upload size={14} />
                    New Archive
                  </button>
                </div>
              )}

              {/* Security Footer - Hidden on very small screens or made compact */}
              <div className="absolute bottom-6 flex items-center gap-4 sm:gap-8 px-4 opacity-40 sm:opacity-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-blue-500" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-white">
                    SSL_SECURED
                  </span>
                </div>
                <div className="hidden sm:block w-px h-3 bg-zinc-300 dark:bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-blue-500" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-white">
                    PDF_ONLY
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
