'use client'

import React, { useState, useEffect } from "react";
import { 
  ChevronRight, 
  ShieldCheck, 
  Zap,
  Fingerprint,
  User,
  Settings,
  Bell,
  Globe,
  Database,
  Lock,
  Camera,
  Save,
  Trash2,
  Cpu,
  Eye,
  EyeOff,
  Edit3,
  X,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsView({ onBack }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {theme,setTheme} = useTheme();



  // Mock Global User Stats
  const userStats = {
    level: "Elite",
    rank: 1,
    uploads: 142,
    points: 2840
  };

  // Mock User Data
  const [profile, setProfile] = useState({
    name: "Neural_Drift",
    email: "drift@neural.net",
    bio: "Core contributor to the CSE neural network. Node active since 2024.",
    nodeTier: "Elite",
    visibility: "Public"
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "data", label: "Data Mgmt", icon: Database }
  ];

  const handleSave = () => {
    setIsEditing(false);
  };

  return (

    <div className={`h-screen w-full flex flex-col overflow-hidden font-sans relative bg-white/97 dark:bg-black/10`}>
      {/* Background Ambience */}
      <div className={`absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none transition-opacity duration-700 bg-blue-600/10 opacity-60 dark:bg-blue-600/5 dark:opacity-100`}></div>
      <div className={`absolute bottom-0 left-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none transition-opacity duration-700 bg-purple-600/10 opacity-60 dark:bg-purple-600/5 dark:opacity-100`}></div>

      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col h-full py-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all border border-zinc-200 dark:border-white/10 group active:scale-95 text-zinc-900 dark:text-white shadow-lg"
            >
              <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
            </button>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-8 h-[2px] bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                  Node Config // 04
                </span>
              </div>
              <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white">
                Core <span className="text-blue-600">Control.</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={()=>setTheme(theme=='dark'? 'light' : 'dark')}
              className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white transition-all shadow-lg active:scale-90"
            >
              {/* Using CSS visibility to toggle icons based on theme */}
              {theme === 'dark' ?  <Moon size={20} /> :  <Sun size={20}/> }
             
             
            </button>

            <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-inner">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? "bg-white dark:bg-white/10 text-blue-600 shadow-lg dark:text-white" 
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  }`}
                >
                  <tab.icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col min-h-0 bg-white dark:bg-[#080808]/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative transition-colors duration-500">
          
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto px-10 py-12">
              
              {activeTab === "profile" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Profile Identification */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col sm:flex-row items-center gap-10">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-50 dark:bg-white/5 border-2 border-dashed border-zinc-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
                          <Fingerprint size={48} className="text-blue-600/40 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        {isEditing && (
                          <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all animate-in zoom-in duration-300">
                            <Camera size={18} />
                          </button>
                        )}
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-2xl font-black italic text-zinc-900 dark:text-white uppercase tracking-tight">Neural Signature</h3>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">Unique Node ID: <span className="text-blue-600">0x9912_ND_DRFT</span></p>
                        <div className="flex gap-2 mt-4 justify-center sm:justify-start">
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20">Rank #01</span>
                          <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-[8px] font-black uppercase tracking-widest rounded-lg border border-purple-500/20">{userStats.level} Tier</span>
                        </div>
                      </div>
                    </div>

                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-3 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-lg shadow-black/5 active:scale-95"
                      >
                        <Edit3 size={14} /> Edit Identity
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-3 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                      >
                        <X size={14} /> Cancel Edit
                      </button>
                    )}
                  </div>

                  {/* Form Grid */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-300 ${isEditing ? 'opacity-100' : 'opacity-80'}`}>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 px-1">Display Alias</label>
                      <div className="relative group">
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className={`w-full bg-zinc-50 dark:bg-white/5 border rounded-2xl px-5 py-4 text-xs font-bold text-zinc-900 dark:text-white outline-none transition-all shadow-inner ${
                            isEditing 
                            ? "border-blue-500/50 focus:border-blue-500 ring-2 ring-blue-500/10" 
                            : "border-zinc-200 dark:border-white/10 cursor-not-allowed"
                          }`}
                        />
                        {!isEditing && <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 text-zinc-900 dark:text-white" />}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 px-1">Neural Mail</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          value={profile.email}
                          className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-xs font-bold opacity-40 text-zinc-900 dark:text-white outline-none cursor-not-allowed"
                          disabled
                        />
                        <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 text-zinc-900 dark:text-white" />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 px-1">Node Bio-Data</label>
                      <textarea 
                        rows="3"
                        disabled={!isEditing}
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className={`w-full bg-zinc-50 dark:bg-white/5 border rounded-2xl px-5 py-4 text-xs font-bold text-zinc-900 dark:text-white outline-none transition-all shadow-inner resize-none ${
                          isEditing 
                          ? "border-blue-500/50 focus:border-blue-500 ring-2 ring-blue-500/10" 
                          : "border-zinc-200 dark:border-white/10 cursor-not-allowed"
                        }`}
                      ></textarea>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className={`pt-6 border-t border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between transition-all duration-500 ${isEditing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                     <div className="flex items-center gap-3">
                        <ShieldCheck className="text-emerald-500" size={18} />
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Changes will be broadcast to the neural network</p>
                     </div>
                     <button 
                       onClick={handleSave}
                       className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3"
                     >
                        <Save size={16} /> Sync Changes
                     </button>
                  </div>

                  {!isEditing && (
                    <div className="pt-6 border-t border-zinc-200 dark:border-white/5 flex items-center gap-3 opacity-50">
                      <Settings className="text-zinc-400" size={16} />
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Identity is currently locked. Toggle edit mode to update.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="p-8 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-[2rem]">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-500/10 rounded-2xl">
                               <Zap className="text-orange-500" size={20} />
                            </div>
                            <div>
                               <h4 className="text-lg font-black italic text-zinc-900 dark:text-white uppercase tracking-tight">Private Access Key</h4>
                               <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Used for end-to-end file decryption</p>
                            </div>
                         </div>
                         <button 
                            onClick={() => setShowKey(!showKey)}
                            className="p-3 bg-zinc-100 dark:bg-white/10 rounded-xl hover:bg-zinc-200 dark:hover:bg-white/20 transition-all text-zinc-600 dark:text-white"
                         >
                            {/* Handled logic within component state */}
                            {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                         </button>
                      </div>
                      <div className="relative">
                         <input 
                            type={showKey ? "text" : "password"} 
                            readOnly
                            value="K8x_92Lp_vN4_neural_vault_secure_001x"
                            className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-2xl px-6 py-5 font-mono text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wider shadow-inner outline-none"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[
                       { title: "Biometric Auth", desc: "Fingerprint verification for uploads", active: true },
                       { title: "Two-Factor Auth", desc: "Secondary signal verification", active: false },
                       { title: "Login Alerts", desc: "Notify on new node access", active: true },
                       { title: "Ghost Mode", desc: "Hide activity from global rank", active: false },
                     ].map((item, i) => (
                       <div key={i} className="p-6 bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-white/10 rounded-3xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                           <div>
                             <h5 className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{item.title}</h5>
                             <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">{item.desc}</p>
                           </div>
                           <button className={`w-12 h-6 rounded-full relative transition-all ${item.active ? "bg-blue-600" : "bg-zinc-200 dark:bg-white/10"}`}>
                             <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.active ? "right-1" : "left-1"}`}></div>
                           </button>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {activeTab === "data" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem]">
                      <h4 className="text-lg font-black italic text-red-500 uppercase tracking-tight mb-2 flex items-center gap-3">
                         <Trash2 size={20} /> Dangerous Territory
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">These actions are permanent and cannot be reversed by the neural network.</p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                         <button className="px-6 py-3 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all">
                           Purge All Uplinks
                         </button>
                         <button className="px-6 py-3 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
                           Deactivate Node Identity
                         </button>
                      </div>
                   </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Tactical Footer */}
        <div className="flex justify-between items-center px-6 mt-6 shrink-0">
          <div className="flex gap-10">
            <div className="flex items-center gap-3">
              <Cpu size={14} className="text-blue-600 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Kernel: <span className="text-zinc-900 dark:text-white">v4.2.0-stable</span></p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Settings size={14} className="text-zinc-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Config: <span className="text-zinc-900 dark:text-white">Local_Override</span></p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-mono opacity-40 text-zinc-900 dark:text-white uppercase tracking-tighter italic">ENCRYPTION_LAYER_ACTIVE // {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2563eb;
          border-radius: 10px;
        }
        /* Specific overrides for consistent styling */
        .dark .bg-zinc-50 { background-color: rgba(255, 255, 255, 0.05); }
      `}} />
    </div>
    
  );
}