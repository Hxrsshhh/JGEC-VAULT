"use client";

import React, { useState } from "react";
import useSWR from "swr";
import {
  CheckCircle,
  FileText,
  Eye,
  Trash2,
  RefreshCw,
  ShieldAlert,
  Activity,
  ShieldCheckIcon,
} from "lucide-react";
import BackgroundDesign from "@/app/components/BackgroundDesign";
import PreviewModal from "@/app/components/PreviewModel";
import { toast } from "sonner";
import Clock from "@/app/components/Clock";

const fetcher = async (url) => {
  const res = await fetch(url);
  const text = await res.text();
  return JSON.parse(text);
};

// 0. HELPERS
const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

const ApprovalPage = () => {
  // 1. STATE MANAGEMENT
  const [actionLoading, setActionLoading] = useState({ id: null, type: null });
  const [previewPaper, setPreviewPaper] = useState(null);
  const [isLoadingPaper, setIsLoadingPaper] = useState(false);

  // 2. DATA FETCHING
  const {
    data: papers,
    isLoading,
    mutate,
  } = useSWR("/api/admin/approvals", fetcher);

  const pendingPapers = papers?.filter((p) => !p.isApproved) || [];

  // 3. CORE ACTIONS

  const handleAction = async (id, actionType) => {
    setActionLoading({ id, type: actionType });

    const toastMethod =
      actionType === "approve" ? "Authorizing..." : "Deleting...";
    const toastId = toast.loading(toastMethod);

    try {
      const response = await fetch(`/api/admin/papers/${id}`, {
        method: actionType === "approve" ? "PATCH" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body:
          actionType === "approve"
            ? JSON.stringify({ isApproved: true })
            : null,
      });

      if (!response.ok) throw new Error("Action failed");

      await mutate();

      if (previewPaper?._id === id) {
        setPreviewPaper(
          actionType === "approve"
            ? { ...previewPaper, isApproved: true }
            : null,
        );
      }

      toast.success(
        actionType === "approve" ? "Paper approved" : "Paper removed",
        { id: toastId },
      );
    } catch (err) {
      toast.error("Operation failed", { id: toastId });
      console.error(err);
    } finally {
      setActionLoading({ id: null, type: null });
    }
  };

  const handleUpdatePaper = async (updatedPaper) => {
    const toastId = toast.loading("Updating metadata...");
    try {
      const res = await fetch(`/api/admin/papers/${updatedPaper._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPaper),
      });

      if (!res.ok) throw new Error();

      await mutate();
      setPreviewPaper(updatedPaper);
      toast.success("Updated successfully", { id: toastId });
    } catch (err) {
      toast.error("Update failed", { id: toastId });
    }
  };

  // 4. UI HELPERS
  if (isLoading)
    return (
      <div className="h-screen bg-white dark:bg-black/10 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="text-blue-600 animate-spin" size={48} />
        <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">
          Initializing Terminal...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-black/10 text-slate-900 dark:text-slate-200 p-4 md:p-8 lg:p-12 transition-colors duration-500">
      <BackgroundDesign />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* --- Hero Header --- */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-slate-50 dark:bg-slate-900/40 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/5 backdrop-blur-2xl shadow-xl relative overflow-hidden group">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Admin Live Console
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
              Review{" "}
              <span className="text-blue-600 dark:text-blue-500">Pipeline</span>
            </h1>
          </div>

          <div className="flex items-center gap-6 z-10 bg-white/80 dark:bg-slate-950/40 p-6 rounded-3xl border border-slate-200 dark:border-white/5">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                Pending
              </p>
              <p className="text-3xl font-black text-blue-600">
                {pendingPapers.length}
              </p>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
            <Activity className="text-blue-600 animate-pulse" size={24} />
          </div>
        </header>

        {/* --- Main Queue --- */}
        <section className="space-y-6">
          {pendingPapers.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
              <CheckCircle
                size={48}
                className="text-blue-500/20 mx-auto mb-4"
              />
              <p className="text-slate-500 font-black uppercase tracking-widest text-sm">
                Queue Synchronized
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingPapers.map((paper) => (
                <div
                  key={paper._id}
                  className="group relative bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center gap-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                >
                  <div className="shrink-0 relative">
                    <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-transparent border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                      <FileText size={32} strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-slate-900 animate-pulse" />
                  </div>

                  <div className="flex-1 w-full space-y-4">
                    <div className="space-y-1 text-center md:text-left">
                      <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {paper.pageType === "yearwise" ||
                        paper.pageType === "notes"
                          ? paper.title || "Untitled Document"
                          : paper.subjectCode}
                      </h4>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />{" "}
                          {new Date(paper.createdAt).toLocaleDateString()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="text-slate-600 dark:text-slate-300">
                          By {paper.uploadedBy?.name || "Anonymous"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <Tag label={paper.department} variant="blue" />
                      <Tag
                        label={`${paper.academicYear}${getOrdinal(paper.academicYear)} Year`}
                      />
                      {paper.examType && (
                        <Tag label={paper.examType} variant="amber" />
                      )}
                      {paper.paperType && (
                        <Tag label={paper.paperType} variant="purple" />
                      )}
                      <Tag label={paper.pageType} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5">
                    <ActionButton
                      icon={<Eye size={20} />}
                      color="hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600"
                      onClick={() => setPreviewPaper(paper)}
                    />

                    <button
                      disabled={actionLoading.id === paper._id}
                      onClick={() => handleAction(paper._id, "approve")}
                      className="flex-1 md:flex-none h-12 px-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading.id === paper._id &&
                      actionLoading.type === "approve" ? (
                        <RefreshCw className="animate-spin" size={16} />
                      ) : (
                        <ShieldCheckIcon size={16} />
                      )}
                      Authorize
                    </button>

                    <button
                      disabled={actionLoading.id === paper._id}
                      onClick={() => handleAction(paper._id, "delete")}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50"
                    >
                      {actionLoading.id === paper._id &&
                      actionLoading.type === "delete" ? (
                        <RefreshCw className="animate-spin" size={18} />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="pt-10 border-t border-slate-200 dark:border-white/5 flex justify-between text-[9px] font-black uppercase text-slate-500">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <ShieldAlert size={12} /> Secure Tunnel
            </span>
            <span className="flex items-center gap-1">
              <Activity size={12} /> 24ms
            </span>
          </div>
          <p>© 2026 AdminNode Central</p>
        </footer>
      </div>

      <PreviewModal
        previewPaper={previewPaper}
        setPreviewPaper={setPreviewPaper}
        isLoadingPaper={isLoadingPaper}
        setIsLoadingPaper={setIsLoadingPaper}
        actionLoading={actionLoading.id}
        handleApprove={(id) => handleAction(id, "approve")}
        handleReject={(id) => handleAction(id, "delete")}
        onUpdatePaper={handleUpdatePaper}
      />
    </div>
  );
};

// Fixed Tag to support the colors used in the pipeline
const Tag = ({ label, variant }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return "text-blue-600 dark:text-blue-400";
      case "amber":
        return "text-amber-600 dark:text-amber-400";
      case "purple":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <span
      className={`bg-white/5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 ${getVariantStyles()}`}
    >
      {label}
    </span>
  );
};

const ActionButton = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className={`p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl transition-all ${color} hover:bg-slate-50 dark:hover:bg-white/5`}
  >
    {icon}
  </button>
);

export default ApprovalPage;
