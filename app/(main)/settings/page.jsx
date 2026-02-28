"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  Camera,
  Save,
  Trash2,
  Cpu,
  Edit3,
  X,
  Sun,
  Moon,
  AlertTriangle,
  Mail,
  User,
  Activity,
  ChevronLeft,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    rank: "00",
    level: "Bronze",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || "Unknown Entity",
        email: session.user.email || "",
        bio: session.user.bio || "No neural data available.",
        avatar: session.user.image || "",
        rank: session.user.rank || "04", //
        level: session.user.level || "Core",
      });
    }
  }, [session]);

  const isDeleteValid = confirmText === "DELETE";

  const handleSave = async () => {
    setIsUpdating(true);

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
        }),
      });

      const data = await res.json(); // 👈 IMPORTANT

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      toast.success("Profile updated successfully.", {
        description: "Neural changes synced to the main ledger.",
      });

      setIsEditing(false);
    } catch (error) {
      toast.error("Update failed.", {
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", {
        description: "Please upload an image.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading avatar...", {
      description: "Syncing image to cloud storage.",
    });

    try {
      setIsUploading(true);

      const res = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setProfile((prev) => ({
        ...prev,
        avatar: data.imageUrl,
      }));

      toast.success("Avatar updated successfully.", {
        id: toastId,
        description: "Image synced to Cloudinary.",
      });
    } catch (error) {
      toast.error("Upload failed.", {
        id: toastId,
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Deletion failed");
      }

      toast.success("Account deleted.", {
        description: "Your node has been permanently deactivated.",
      });

      // 🔥 Now sign out AFTER backend confirms
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error("Deletion failed.", {
        description: error.message,
      });
    }
  };

  return (
    <div>
      {/* Root Container: Non-scrollable shell */}
      <div className="h-max-screen w-full flex flex-col font-sans selection:bg-blue-500/30 bg-white/10 dark:bg-black/10 text-zinc-900 dark:text-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="fixed top-0 right-0 w-[40vw] h-[40vw] blur-[120px] rounded-full pointer-events-none bg-blue-400/10 dark:bg-blue-600/10 opacity-30 dark:opacity-50"></div>
        <div className="fixed bottom-0 left-0 w-[40vw] h-[40vw] blur-[120px] rounded-full pointer-events-none bg-purple-400/10 dark:bg-purple-600/10 opacity-30 dark:opacity-50"></div>

        <main className="flex-1 flex flex-col w-full max-w-400 mx-auto relative z-10 overflow-hidden lg:p-8 p-4">
          {/* Header */}
          <header className="flex items-center justify-between gap-4 mb-6 lg:mb-8 shrink-0">
            <div className="flex items-center gap-3 md:gap-6">
              <button
                onClick={() => router.back()}
                className="group relative flex items-center justify-center shrink-0"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border transition-all duration-300 bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white shadow-md dark:shadow-none group-hover:border-blue-500/50 group-hover:text-blue-500 active:scale-90">
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 md:gap-3 mb-1">
                  <span className="w-4 md:w-8 h-0.5 bg-blue-600 rounded-full animate-pulse"></span>
                  <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 truncate">
                    Node Config // 04
                  </span>
                </div>
                <h1 className="text-xl md:text-5xl font-black uppercase tracking-tighter italic leading-none truncate">
                  Core <span className="text-blue-600">Control.</span>
                </h1>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border flex items-center justify-center transition-all active:scale-90 shadow-lg bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 shrink-0"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 min-h-0 flex flex-col rounded-3xl md:rounded-[2.5rem] border transition-all duration-500 bg-white/80 dark:bg-[#080808]/80 backdrop-blur-xl border-zinc-200 dark:border-white/10 shadow-xl overflow-hidden">
            {/* Scrollable on Mobile, Grid on Desktop to avoid scrolling */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-5 md:p-8 lg:p-0">
              {/* LEFT SECTION: Identity & Details */}
              <div className="flex-1 lg:border-r border-dashed border-zinc-500/20 lg:p-10 flex flex-col">
                <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center gap-6 mb-8 shrink-0">
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border-2 border-dashed flex items-center justify-center transition-colors bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10">
                      <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl border-2 border-dashed bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 overflow-hidden">
                        {profile.avatar ? (
                          <Image
                            src={profile.avatar}
                            alt="profile"
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <Fingerprint
                              size={32}
                              className="text-blue-600/40"
                            />
                          </div>
                        )}

                        {/* Upload Spinner Overlay */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      id="avatarUpload"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />

                    {isEditing && (
                      <label
                        htmlFor="avatarUpload"
                        className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg cursor-pointer"
                      >
                        <Camera size={14} />
                      </label>
                    )}
                  </div>
                  <div className="text-center md:text-left min-w-0">
                    <h3 className="text-lg md:text-xl font-black italic uppercase tracking-tight">
                      Neural Signature
                    </h3>
                    <p className="text-[8px] md:text-[9px] font-bold text-zinc-400  tracking-[0.2em] mt-1 truncate">
                      ID:{" "}
                      <span className="text-blue-600">
                        {profile.email ? profile.email.split("@")[0] : "USER"}
                      </span>
                    </p>
                    <div className="flex gap-1.5 mt-3 justify-center md:justify-start">
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[7px] font-black uppercase tracking-widest rounded border border-blue-500/20">
                        Rank {profile.rank}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 text-[7px] font-black uppercase tracking-widest rounded border border-purple-500/20">
                        {profile.level} Tier
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 px-1 flex items-center gap-2">
                      <User size={10} /> Alias
                    </label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all ${isEditing ? "border-blue-500/50 bg-blue-500/5 ring-2 ring-blue-500/10" : "bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/10 cursor-not-allowed"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 px-1 flex items-center gap-2">
                      <Mail size={10} /> Mail
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full border rounded-xl px-4 py-3 text-xs font-bold opacity-40 bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/10 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 px-1 flex items-center gap-2">
                      <Activity size={10} /> Bio-Data
                    </label>
                    <textarea
                      rows="3"
                      disabled={!isEditing}
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none resize-none transition-all ${isEditing ? "border-blue-500/50 bg-blue-500/5 ring-2 ring-blue-500/10" : "bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/10 cursor-not-allowed"}`}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* RIGHT SECTION: Control & Danger Zone */}
              <div className="flex-1 lg:p-10 flex flex-col justify-between gap-8 mt-10 lg:mt-0">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black italic uppercase tracking-widest text-blue-600">
                      Access Control
                    </h4>
                    <button
                      onClick={() =>
                        isEditing ? setIsEditing(false) : setIsEditing(true)
                      }
                      className={`px-5 py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 ${isEditing ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-blue-600 text-white border-transparent"}`}
                    >
                      {isEditing ? (
                        <>
                          <X size={12} /> Cancel
                        </>
                      ) : (
                        <>
                          <Edit3 size={12} /> Unlock Node
                        </>
                      )}
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="p-6 bg-blue-600/5 rounded-2xl border border-blue-500/20 animate-in fade-in slide-in-from-right-4">
                      <div className="flex items-start gap-4 mb-6">
                        <ShieldCheck
                          className="text-blue-500 shrink-0 mt-1"
                          size={20}
                        />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                            Encryption Mode Active
                          </p>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase leading-relaxed">
                            Changes will be broadcasted to the main ledger upon
                            sync.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 
    ${
      isUpdating
        ? "bg-zinc-800 dark:bg-zinc-700 cursor-not-allowed opacity-80"
        : "bg-blue-600 text-white hover:scale-[1.02] active:scale-95"
    }`}
                      >
                        {isUpdating ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Syncing Neural Data...
                          </>
                        ) : (
                          <>
                            <Save size={14} /> Sync Neural Changes
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 bg-zinc-500/5 border border-zinc-500/10 rounded-2xl">
                      <div className="flex items-center gap-3 opacity-40">
                        <Lock size={16} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                          Read-Only State
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[8px] font-black uppercase tracking-widest text-red-500 px-1">
                    Danger Zone
                  </h4>
                  <div className="p-5 md:p-6 bg-red-500/5 border border-red-500/20 rounded-2xl group">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-red-500">
                        Node Deactivation
                      </p>
                    </div>
                    <p className="text-[9px] mb-4 text-zinc-500 font-bold uppercase tracking-tight leading-relaxed">
                      Purging is irreversible. All ranking and credits will be
                      voided.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full py-2.5 bg-transparent border border-red-500/30 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      Initiate Purge Sequence
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="flex justify-between items-center px-4 py-4 shrink-0 opacity-40">
            <div className="flex items-center gap-2">
              <Cpu size={12} className="text-blue-600" />
              <p className="text-[7px] font-black uppercase tracking-widest">
                v4.2.0-stable
              </p>
            </div>
          </footer>
        </main>

        {/* Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="max-w-xs w-full p-8 rounded-3xl border bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10 text-center">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Trash2 size={24} />
              </div>
              <h2 className="text-xl font-black italic uppercase tracking-tight mb-2">
                Confirm?
              </h2>
              <input
                type="text"
                placeholder="Type DELETE to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-xs font-bold outline-none text-center mb-6 bg-zinc-50 dark:bg-white/5 border-zinc-200 uppercase focus:border-red-500 transition-colors"
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDelete}
                  disabled={!isDeleteValid}
                  className={`w-full py-3 rounded-xl transition-all ${
                    isDeleteValid
                      ? "bg-red-600"
                      : "bg-zinc-800 opacity-50 cursor-not-allowed"
                  }`}
                >
                  Confirm Purge
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-zinc-500"
                >
                  Abort
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
