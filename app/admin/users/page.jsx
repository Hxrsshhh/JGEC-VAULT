"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Zap,
  RefreshCw,
  Search,
  ShieldCheck,
  FileUp,
  FileDown,
  Calendar,
  ShieldAlert,
  GraduationCap,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

const UserDirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Nodes");
  const [actionLoading, setActionLoading] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        console.error("Failed to load users:", err);
        toast.error("Fetch Error", {
          description: "Could not sync with identity database.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user?.name || "";
      const email = user?.email || "";
      const role = user?.role || "student";
      const status = user?.status || "active";

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        activeTab === "All Nodes" ||
        (activeTab === "Admins" && role === "admin") ||
        (activeTab === "Students" && role === "student") ||
        (activeTab === "Flagged" && status === "blocked");

      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab, users]);

  const handleStatusToggle = async (id, currentStatus) => {
    setActionLoading(id);

    const newStatus = currentStatus === "active" ? "blocked" : "active";
    const actionText = newStatus === "active" ? "restored" : "revoked";

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Server responded with an error");
      const updatedUser = result.user || result;

      setUsers((prev) => prev.map((u) => (u._id === id ? updatedUser : u)));

      toast.success(`Access ${actionText} successfully`, {
        description: `Identity node ${id.slice(-4)} status is now ${newStatus}.`,
        className: "bg-slate-900 border-white/10 text-white font-sans",
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Protocol Breach", {
        description: error.message || "Failed to update user access control.",
        className: "bg-red-950 border-red-500/50 text-white",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <RefreshCw size={32} className="animate-spin text-blue-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Syncing Identity Database...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Dashboard Hero --- */}
      <div className="relative group overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900/30 p-10 backdrop-blur-md shadow-2xl">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
              Identity <span className="text-blue-500">Vault</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
              Mongoose Schema v1.0.4 • {users.length} Registered Nodes
            </p>
          </div>
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-end">
            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">
              Global Credits
            </span>
            <span className="text-xl font-black text-white tabular-nums">
              {users
                .reduce((acc, curr) => acc + (curr?.points || 0), 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* --- Filters --- */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex p-1 bg-slate-950 rounded-2xl border border-white/5 w-full lg:w-auto overflow-x-auto">
          {["All Nodes", "Students", "Admins", "Flagged"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
            size={16}
          />
          <input
            type="text"
            placeholder="FILTER BY NAME OR EMAIL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-blue-500/50 transition-all text-white"
          />
        </div>
      </div>

      {/* --- Matrix --- */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/1">
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  User Entity
                </th>
                <th className="px-6 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Network Node
                </th>
                <th className="px-6 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  System Metrics
                </th>
                <th className="px-6 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Last Access
                </th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">
                  Protocol
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr
                  key={user?._id}
                  className="hover:bg-blue-500/2 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black border transition-all ${
                          user?.status === "active"
                            ? "bg-slate-950 border-white/10 text-blue-500"
                            : "bg-red-500/10 border-red-500/20 text-red-500"
                        }`}
                      >
                        {user?.name?.[0] || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight text-white">
                          {user?.name || "Unknown User"}
                        </p>
                        <p className="text-[10px] font-mono text-slate-500">
                          {user?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <div
                          className={`w-1 h-1 rounded-full ${user?.role === "admin" ? "bg-purple-500 animate-pulse" : "bg-blue-500"}`}
                        />
                        {user?.department || "N/A"}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        {user?.role === "admin" ? (
                          <UserCog size={12} />
                        ) : (
                          <GraduationCap size={12} />
                        )}
                        {user?.role || "student"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex gap-6">
                      <div className="text-center">
                        <FileUp
                          size={10}
                          className="text-slate-600 mb-1 mx-auto"
                          title="Uploads"
                        />
                        <p className="text-xs font-black text-slate-200 tabular-nums">
                          {user?.uploadsCount || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <FileDown
                          size={10}
                          className="text-slate-600 mb-1 mx-auto"
                          title="Downloads"
                        />
                        <p className="text-xs font-black text-slate-200 tabular-nums">
                          {user?.downloadsCount || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <Zap
                          size={10}
                          className="text-emerald-500 mb-1 mx-auto"
                          title="Points"
                        />
                        <p className="text-xs font-black text-emerald-500 tabular-nums">
                          {user?.points || 0}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={12} />
                      <span className="text-[10px] font-mono uppercase tracking-tighter">
                        {user?.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "NEVER"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      disabled={actionLoading === user?._id}
                      onClick={() =>
                        handleStatusToggle(user?._id, user?.status)
                      }
                      className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ml-auto active:scale-95 disabled:opacity-50
                        ${
                          user?.status === "active"
                            ? "bg-transparent border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
                            : "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
                        }`}
                    >
                      {actionLoading === user?._id ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : user?.status === "active" ? (
                        <>
                          <ShieldAlert size={12} /> Block
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={12} /> Restore
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && !loading && (
            <div className="py-20 text-center text-slate-600 uppercase font-black text-[10px] tracking-[0.4em]">
              No Identity Nodes Found In Current Sub-Sector
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDirectoryPage;
