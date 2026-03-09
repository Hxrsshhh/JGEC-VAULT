"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import {
  Search,
  XCircle,
  ChevronDown,
  FileText,
  Eye,
  Trash2,
  AlertTriangle,
  Download,
  Clock,
} from "lucide-react";
import PreviewModal from "@/app/components/PreviewModel";
import { toast } from "sonner";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
};

const PaperVaultPage = () => {
  // 1. DATA FETCHING - Added mutate to the destructuring
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/papers",
    fetcher,
  );
  const papers = data?.papers || [];

  // 2. STATE MANAGEMENT
  const [previewPaper, setPreviewPaper] = useState(null);
  const [vaultSearch, setVaultSearch] = useState("");
  const [filters, setFilters] = useState({
    department: "All",
    academicYear: "All",
    pageType: "All",
    examType: "All",
    examYear: "All",
  });
  const [isLoadingPaper, setIsLoadingPaper] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // 3. FILTER LOGIC
  const filteredVaultPapers = useMemo(() => {
    return (papers ?? []).filter((paper) => {
      const vaultSearchLower = vaultSearch.toLowerCase();
      const matchesSearch =
        vaultSearch === "" ||
        paper?.title?.toLowerCase().includes(vaultSearchLower) ||
        paper?.subjectCode?.toLowerCase().includes(vaultSearchLower);

      const matchesDept =
        filters.department === "All" ||
        paper?.department === filters.department;
      const matchesYear =
        filters.academicYear === "All" ||
        Number(paper?.academicYear) === Number(filters.academicYear);
      const matchesType =
        filters.pageType === "All" || paper?.pageType === filters.pageType;
      const matchesExam =
        filters.examType === "All" || paper?.examType === filters.examType;
      const matchesRelease =
        filters.examYear === "All" ||
        Number(paper?.examYear) === Number(filters.examYear);

      return (
        matchesSearch &&
        matchesDept &&
        matchesYear &&
        matchesType &&
        matchesExam &&
        matchesRelease
      );
    });
  }, [papers, vaultSearch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 4. ACTION HANDLERS
  const handleApprove = async (id) => {
    setActionLoading(id);
    const toastId = toast.loading("Authorizing paper...");
    try {
      const res = await fetch(`/api/admin/papers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      if (!res.ok) throw new Error();

      await mutate(); // Refresh the list
      setPreviewPaper((prev) => (prev ? { ...prev, isApproved: true } : prev));
      toast.success("Paper approved successfully", { id: toastId });
    } catch (err) {
      toast.error("Approval failed", { id: toastId });
    } finally {
      setActionLoading(null);
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
      toast.success("Paper updated successfully", { id: toastId });
    } catch (err) {
      toast.error("Update failed", { id: toastId });
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    const toastId = toast.loading("Deleting paper...");
    try {
      const res = await fetch(`/api/admin/papers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      await mutate(); // Refresh list immediately
      setPreviewPaper(null);
      toast.success("Paper moved to trash", { id: toastId });
    } catch (err) {
      toast.error("Delete failed", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (paper) => {
    const fileName = `${
      paper.subjectCode || paper.title || "paper"
    }_${paper.examYear || "file"}.pdf`;

    const toastId = toast.loading("Preparing download...", {
      description: "Fetching file from secure vault.",
    });

    try {
      const res = await fetch(
        `/api/download?url=${encodeURIComponent(
          paper.fileUrl,
        )}&name=${encodeURIComponent(fileName)}`,
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Download successful 📥", {
        id: toastId,
        description: `${fileName} saved successfully.`,
      });
    } catch (error) {
      toast.error("Download failed ❌", {
        id: toastId,
        description: error.message,
      });
    }
  };

  const openPreview = (paper) => {
    setIsLoadingPaper(true);
    setPreviewPaper(paper);
    // Simulate/handle loading state for the modal
    setTimeout(() => setIsLoadingPaper(false), 300);
  };

  if (isLoading)
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
          Accessing Archives...
        </span>
      </div>
    );

  return (
    <div className="p-8 max-w-400 mx-auto space-y-12">
      {/* --- HEADER --- */}
      <header className="flex flex-col xl:flex-row justify-between xl:items-end gap-8 bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden group">
        <div className="space-y-2 relative z-10">
          <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white">
            Paper <span className="text-blue-500">Vault</span>
          </h2>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
            {filteredVaultPapers.length} Results Found
          </p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-4 items-center w-full xl:max-w-2xl z-10">
          <div className="relative w-full">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500"
              size={18}
            />
            <input
              type="text"
              placeholder="SEARCH BY TITLE OR SUBJECT CODE..."
              value={vaultSearch}
              onChange={(e) => setVaultSearch(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-[11px] font-bold tracking-widest outline-none focus:border-blue-500/50 transition-all text-white uppercase"
            />
          </div>
          <button
            onClick={() =>
              setFilters({
                department: "All",
                academicYear: "All",
                pageType: "All",
                examType: "All",
                examYear: "All",
              })
            }
            className="p-5 bg-red-500/5 rounded-2xl border border-red-500/10 hover:bg-red-500/10 text-red-500 transition-all"
          >
            <XCircle size={22} />
          </button>
        </div>
      </header>

      {/* --- FILTERS --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[
          {
            key: "department",
            label: "Dept",
            options: ["All", "CSE", "ECE", "ME", "EE", "CE", "IT"],
          },
          {
            key: "academicYear",
            label: "Year",
            options: ["All", "1", "2", "3", "4"],
          },
          {
            key: "pageType",
            label: "Category",
            options: ["All", "yearwise", "subjectwise", "notes"],
          },
          { key: "examType", label: "Exam", options: ["All", "mid", "end"] },
          {
            key: "examYear",
            label: "Release",
            options: ["All", "2026", "2025", "2024", "2023"],
          },
        ].map((filter) => (
          <div key={filter.key} className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">
              {filter.label}
            </label>
            <div className="relative group">
              <select
                value={filters[filter.key]}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-4 px-5 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer text-slate-300"
              >
                {filter.options.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-950">
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVaultPapers.map((paper) => (
          <div
            key={paper._id}
            className="group relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full shadow-xl"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20">
                <FileText size={24} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${paper.isApproved ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : "bg-amber-500/5 text-amber-500 border-amber-500/20"}`}
                >
                  {paper.isApproved ? "Verified" : "Pending"}
                </span>
                <span className="text-[9px] font-bold text-slate-600 flex items-center gap-1 uppercase">
                  <Clock size={10} />{" "}
                  {new Date(paper.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <h4 className="text-xl font-black uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors leading-tight">
                {paper.title || paper.subjectCode || "Untitled Document"}
              </h4>
              <div className="flex flex-wrap gap-2">
                <Tag label={paper.subjectCode || "N/A"} color="text-blue-400" />
                <Tag label={paper.department} />
                <Tag label={`${paper.academicYear} Year`} />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-blue-400">
                  {paper.uploadedBy?.name?.charAt(0) || "U"}
                </div>
                <p className="text-[11px] font-bold text-slate-300">
                  {paper.uploadedBy?.name || "Anonymous"}
                </p>
              </div>

              <div className="flex gap-2">
                <ActionButton
                  icon={<Eye size={18} />}
                  color="hover:text-blue-400"
                  onClick={() => openPreview(paper)}
                />

                <ActionButton
                  icon={<Download size={18} />}
                  color="hover:text-emerald-400"
                  onClick={() => handleDownload(paper)}
                />

                <ActionButton
                  icon={<Trash2 size={18} />}
                  color="hover:text-red-400"
                  onClick={() => handleReject(paper._id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVaultPapers.length === 0 && (
        <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
          <AlertTriangle size={48} className="mx-auto text-slate-800 mb-4" />
          <p className="font-black uppercase tracking-widest text-slate-500 text-sm">
            No Matching Records
          </p>
        </div>
      )}

      <PreviewModal
        previewPaper={previewPaper}
        setPreviewPaper={setPreviewPaper}
        isLoadingPaper={isLoadingPaper}
        setIsLoadingPaper={setIsLoadingPaper}
        actionLoading={actionLoading}
        handleApprove={handleApprove}
        handleReject={handleReject}
        onUpdatePaper={handleUpdatePaper}
      />
    </div>
  );
};

// --- SUB-COMPONENTS ---
const Tag = ({ label, color = "text-slate-400" }) => (
  <span
    className={`bg-white/5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 ${color}`}
  >
    {label}
  </span>
);

const ActionButton = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className={`p-3 bg-slate-950 border border-white/10 rounded-xl transition-all ${color} hover:bg-white/5`}
  >
    {icon}
  </button>
);

export default PaperVaultPage;
