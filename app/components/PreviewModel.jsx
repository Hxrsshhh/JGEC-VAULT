"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  X,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Download,
  Edit3,
  Save,
  RotateCcw,
  Cpu,
} from "lucide-react";
import { toast } from "sonner";

const PreviewModal = ({
  previewPaper,
  setPreviewPaper,
  isLoadingPaper,
  setIsLoadingPaper,
  actionLoading,
  handleApprove,
  handleReject,
  onUpdatePaper,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    if (previewPaper) setEditedData({ ...previewPaper });
  }, [previewPaper]);

  if (!previewPaper || !editedData) return null;

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    const toastId = toast.loading("Syncing with core database...");
    try {
      if (onUpdatePaper) await onUpdatePaper(editedData);
      setIsEditing(false);
      toast.success("Sector Updated Successfully", { id: toastId });
    } catch (err) {
      toast.error("Handshake Failed", { id: toastId });
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

  return (
    <div className="fixed  inset-0 z-300 flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-500">
      {/* Cinematic Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={() => !isEditing && setPreviewPaper(null)}
      />

      <div className="relative left-36 top-12 w-full max-w-360 h-full max-h-[86vh] bg-black/30 border border-white/10 rounded-4xl shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        {/* TOP STATUS BAR (Tactical Header) */}
        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-linear-to-r from-white/3 to-transparent">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]">
                <FileText size={28} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#050505]" />
            </div>

            <div className="flex flex-col">
              {isEditing ? (
                <div className="relative group">
                  <input
                    className="bg-blue-500/5 border-b-2 border-blue-500/50 text-xl font-black uppercase italic text-blue-400 outline-none focus:border-blue-500 transition-all px-2 w-[400px]"
                    value={editedData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    autoFocus
                  />
                  <span className="absolute -top-4 left-0 text-[8px] font-black text-blue-500 tracking-tighter">
                    EDITING_TITLE_STRATUM
                  </span>
                </div>
              ) : (
                <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
                  {editedData.title}
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono text-blue-400 animate-pulse">
                    v2.0_SECURE
                  </span>
                </h3>
              )}
              <div className="flex items-center gap-3 mt-1 opacity-60">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  {editedData.subjectCode}
                </span>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {editedData.department}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                isEditing
                  ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "bg-white/5 border-white/10 text-slate-300 hover:border-blue-500/50 hover:text-blue-400"
              }`}
            >
              {isEditing ? (
                <RotateCcw size={14} className="animate-spin-slow" />
              ) : (
                <Edit3 size={14} />
              )}
              {isEditing ? "Abort Changes" : "Modify Record"}
            </button>
            <button
              onClick={() => setPreviewPaper(null)}
              className="p-3 bg-red-500/5 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded-xl transition-all active:scale-90"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* MAIN VIEWPORT */}
          <div className="flex-1 bg-[#080808] p-6 relative group overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative w-full h-full bg-black/20 rounded-3xl border border-white/5 overflow-hidden shadow-inner">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewPaper.fileUrl)}&embedded=true`}
                className={`w-full h-full bg-white transition-all duration-1000 ${isLoadingPaper ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                onLoad={() => setIsLoadingPaper(false)}
              />

              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-black/20/[0.02] to-transparent h-[10%] w-full animate-scan-line" />
            </div>
          </div>

          {/* RIGHT SIDEBAR: TACTICAL CONTROL */}
          <div className="w-full lg:w-100 bg-white/2 border-l border-white/5 p-8 space-y-8 overflow-y-auto">
            {/* Metadata Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2">
                  <Cpu size={14} /> Core Metadata
                </h4>
                {isEditing && (
                  <span className="text-[8px] font-mono text-amber-500 animate-pulse">
                    UNSAVED_CHANGES
                  </span>
                )}
              </div>

              <div className="grid gap-3">
                {/* Field Card */}
                <div className="group relative p-4 bg-white/3 border border-white/5 rounded-2xl transition-all hover:bg-white/5">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    {editedData.pageType === "notes" ||
                    editedData.pageType === "yearwise"
                      ? "Title"
                      : "Subject Identifier"}
                  </span>

                  {isEditing ? (
                    <input
                      className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:ring-1 ring-blue-500"
                      value={
                        editedData.pageType === "notes" ||
                        editedData.pageType === "yearwise"
                          ? editedData.title
                          : editedData.subjectCode
                      }
                      onChange={(e) =>
                        handleInputChange(
                          editedData.pageType === "notes" ||
                            editedData.pageType === "yearwise"
                            ? "title"
                            : "subjectCode",
                          e.target.value,
                        )
                      }
                    />
                  ) : (
                    <span className="text-sm font-mono text-white font-bold">
                      {editedData.pageType === "notes" ||
                      editedData.pageType === "yearwise"
                        ? editedData.title
                        : editedData.subjectCode}
                    </span>
                  )}
                </div>

                <div className="group relative p-4 bg-white/3 border border-white/5 rounded-2xl transition-all hover:bg-white/5">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Operational Department
                  </span>
                  {isEditing ? (
                    <select
                      className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                      value={editedData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                    >
                      <option value="IT">IT (Information Technology)</option>
                      <option value="CSE">CSE (Computer Science)</option>
                      <option value="ECE">ECE (Electronics)</option>
                      <option value="EE">ECE (Electtical)</option>
                      <option value="MECH">MECH (Mechanical)</option>
                      <option value="CIVIL">CIVIL (Civil Eng)</option>
                    </select>
                  ) : (
                    <span className="text-xs font-black text-blue-400 uppercase italic">
                      {editedData.department}
                    </span>
                  )}
                </div>

                {/* Sub-grid for smaller fields */}
                <div className="grid grid-cols-2 gap-3">
                  {["examType", "examYear", "academicYear", "pageType"].map(
                    (key) => (
                      <div
                        key={key}
                        className="p-4 bg-white/2 border border-white/5 rounded-2xl"
                      >
                        <span className="text-[7px] font-black text-slate-600 uppercase mb-1 block">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        {isEditing ? (
                          <input
                            className="w-full bg-blue-500/5 border border-blue-500/20 rounded-md px-2 py-1 text-[10px] font-mono text-blue-400 outline-none"
                            value={editedData[key] || ""}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                          />
                        ) : (
                          <span className="text-[10px] font-mono text-slate-300 font-bold uppercase">
                            {editedData[key] || "N/A"}
                          </span>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveChanges}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] active:scale-95"
                >
                  <Save size={18} /> Overwrite Record
                </button>
              )}
            </section>

            {/* SECURITY PROTOCOL SECTION */}
            <section className="pt-8 border-t border-white/5 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
                <ShieldCheck size={14} /> Authorization
              </h4>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    disabled={
                      actionLoading === previewPaper._id ||
                      previewPaper.isApproved ||
                      isEditing
                    }
                    onClick={() => handleApprove(previewPaper._id)}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl font-black uppercase text-[10px] transition-all border ${
                      previewPaper.isApproved
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500/40"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    } disabled:opacity-50`}
                  >
                    <CheckCircle size={16} />{" "}
                    {previewPaper.isApproved ? "Verified" : "Approve"}
                  </button>

                  <button
                    disabled={actionLoading === previewPaper._id || isEditing}
                    onClick={() => handleReject(previewPaper._id)}
                    className="flex-1 flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-red-500/10 border border-white/10 text-slate-400 hover:text-red-500 rounded-2xl font-black uppercase text-[10px] transition-all"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>

                <button
                  disabled={!previewPaper.isApproved || isEditing}
                  onClick={() => handleDownload(previewPaper)}
                  className={`w-full group flex items-center justify-between p-5 rounded-2xl font-black uppercase tracking-tighter transition-all border ${
                    previewPaper.isApproved
                      ? "bg-white text-black hover:bg-blue-500 hover:text-white"
                      : "bg-white/5 text-slate-600 opacity-20 cursor-not-allowed border-transparent"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs">Download Asset</span>
                    <span className="text-[7px] font-mono opacity-50">
                      ENCRYPTED_PDF_CONTAINER
                    </span>
                  </div>

                  <Download
                    size={20}
                    className={
                      previewPaper.isApproved
                        ? "group-hover:translate-y-1 transition-transform"
                        : ""
                    }
                  />
                </button>
              </div>

              {/* Decorative System Viz */}
              {!isEditing && (
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-center gap-4">
                  <div className="flex gap-1 items-end h-4">
                    {[40, 70, 45, 90, 65].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-blue-500/40 rounded-full animate-pulse"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-blue-500/60 uppercase tracking-widest">
                    System Link Active
                  </span>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
