"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  FileText,
  CloudUpload,
  Zap,
  ShieldCheck,
  Activity,
  Search,
  ArrowUpRight,
  Database,
  Trash2,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";

export default function MyArchiveView({ session, onBack }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Delete States
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const {
    data: myUploads,
    error: uploadsError,
    isLoading: uploadsLoading,
    mutate: mutateUploads,
  } = useSWR("/api/my-uploads", fetcher);

  const {
    data: userStats,
    error: statsError,
    isLoading: statsLoading,
  } = useSWR("/api/user/stats", fetcher);

  const loading = uploadsLoading || statsLoading;

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    const toastId = toast.loading("Deleting paper...", {
      description: "Purging file from vault and cloud storage.",
    });

    try {
      const res = await fetch(`/api/my-uploads/${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Deletion failed");
      }

      // Optimistic UI update
      mutateUploads(
        (prev) => prev?.filter((item) => item.id !== deleteId),
        false,
      );

      // Revalidate from server (optional but recommended)
      mutateUploads();

      setDeleteId(null);

      toast.success("Paper deleted successfully.", {
        id: toastId,
        description: "Archive updated and credits recalculated.",
      });
    } catch (err) {
      toast.error("Deletion failed.", {
        id: toastId,
        description: err.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUploads = (myUploads || []).filter(
    (file) =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!userStats && loading) {
    return (
      <div className="h-screen flex items-center justify-center text-[10px] font-black tracking-[0.3em] animate-pulse text-blue-600">
        INITIALIZING_SYSTEM_ARC...
      </div>
    );
  }

  return (
    <div className="h-max-screen w-full flex flex-col bg-white/10 dark:bg-black/10 font-sans selection:bg-blue-500/30 relative">
      {/* --- DELETE CONFIRMATION POPUP --- */}
      {deleteId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative w-full max-w-85 bg-white/20 dark:bg-black/30 border border-zinc-200 dark:border-red-500/30 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tighter italic dark:text-white mb-2">
                Confirm Purge <span className="text-red-600">Sequence?</span>
              </h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase leading-relaxed mb-6">
                This action will permanently delete the data object from the
                central archive.
              </p>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => setDeleteId(null)}
                  className="py-3 rounded-xl bg-zinc-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                >
                  Abort
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="py-3 rounded-xl bg-red-600 text-white text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
                >
                  {isDeleting ? "WIPING..." : "CONFIRM"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/40 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 active:scale-90 transition-transform"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter italic dark:text-white">
                My <span className="text-blue-600">Archive.</span>
              </h2>
              <p className="text-[7px] md:text-[9px] font-bold text-blue-600/60 uppercase tracking-widest flex items-center gap-1">
                NODE_{userStats?.role?.toUpperCase() || "CORE"}_v4
              </p>
            </div>
          </div>

          <div className="hidden md:block relative w-64">
            <input
              type="text"
              placeholder="SEARCH BY CODE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-9 py-2 text-[10px] font-bold uppercase outline-none focus:border-blue-500 transition-colors"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={14}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 flex flex-col gap-6">
        {/* STATS GRID (Omitted for brevity, keep your original) */}

        {/* 3. MOBILE SEARCH */}
        <div className="md:hidden relative">
          <input
            type="text"
            placeholder="FILTER ARCHIVE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-white/5 rounded-xl px-10 py-3 text-[10px] font-bold uppercase outline-none"
          />
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            size={16}
          />
        </div>

        {/* 4. CONTENT AREA */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden">
          {/* Header Row */}
          <div className="hidden md:flex px-8 py-4 bg-zinc-50/50 dark:bg-white/2 border-b border-zinc-100 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
            <span className="w-24">Subject</span>
            <span className="grow">Document Title</span>
            <span className="w-32 text-center">Status</span>
            <span className="w-24 text-center">Size</span>
            <span className="w-32 text-right">Actions</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-white/5">
            {loading ? (
              <div className="py-20 text-center text-xs font-bold text-zinc-400 animate-pulse">
                SYNCING_DATA_OBJECTS...
              </div>
            ) : filteredUploads.length > 0 ? (
              filteredUploads.map((file, i) => (
                <div
                  key={i}
                  className="group flex flex-col md:flex-row md:items-center px-4 py-5 md:px-8 md:py-4 hover:bg-zinc-50 dark:hover:bg-blue-600/5 transition-all"
                >
                  {/* Title & File Info */}
                  <div className="flex items-center gap-4 grow">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FileText size={18} />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs md:text-sm font-black uppercase italic dark:text-white truncate">
                        {file.title}
                      </h4>
                      <p className="text-[8px] md:text-[9px] font-bold text-zinc-400 uppercase tracking-tighter flex flex-wrap gap-1">
                        <span className="text-blue-600">
                          {file.subjectCode}
                        </span>
                        <span>•</span>
                        <span>SEM {file.semester}</span>
                        <span>•</span>
                        <span>{file.academicYear} YEAR</span>
                        <span>•</span>
                        <span>{file.department}</span>
                      </p>
                    </div>

                    {/* Mobile Action Group */}
                    <div className="flex md:hidden items-center gap-1">
                      <button
                        onClick={() => setDeleteId(file.id)}
                        className="p-2 text-zinc-400 active:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Columns */}
                  <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-zinc-100 dark:border-white/5 md:border-t-0">
                    <div className="hidden md:block w-24 text-[10px] font-mono text-zinc-400 font-bold uppercase truncate">
                      {file.subjectCode}
                    </div>

                    <div className="w-auto md:w-32 flex justify-start md:justify-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[7px] font-black uppercase border ${file.isApproved ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600" : "bg-orange-500/5 border-orange-500/20 text-orange-600 animate-pulse"}`}
                      >
                        {file.isApproved ? "Verified" : "Syncing"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 md:w-56 justify-end">
                      <span className="text-[9px] font-mono font-bold text-zinc-400">
                        {file.fileSize
                          ? `${(file.fileSize / 1024).toFixed(0)}KB`
                          : "1.2MB"}
                      </span>

                      {/* Desktop Action Cluster */}
                      <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setDeleteId(file.id)}
                          className="p-1.5 hover:bg-red-600 hover:text-white rounded-lg transition-all text-zinc-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                <Database
                  size={32}
                  className="text-zinc-200 dark:text-zinc-800 mb-4"
                />
                <p className="text-[9px] text-zinc-400 uppercase tracking-widest">
                  No data objects found.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
