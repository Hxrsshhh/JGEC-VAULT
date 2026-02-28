'use client'

import React, { useState, useEffect, Suspense } from "react";
import { 
  ShieldAlert, 
  ArrowLeft, 
  MessageSquare,
  Lock,
  UserX,
  Clock,
  AlertCircle,
  ShieldOff
} from "lucide-react";

/**
 * Note: For production Next.js, replace the mock hook below with:
 * import { useSearchParams } from "next/navigation";
 */
const useMockSearchParams = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return params;
  }
  return { get: () => null };
};

const ErrorContent = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const searchParams = useMockSearchParams();
  const errorCode = searchParams.get("error") || "UNKNOWN_ERROR";

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeMouseMove("mousemove", handleMouseMove);
  }, []);

  const errorMap = {
    ACCOUNT_NOT_ACTIVE: {
      title: "Node Deactivated",
      subtitle: "Your credentials are valid, but your access node is offline.",
      description: "Awaiting manual verification by JGEC Vault administrators. Please wait for the authorization uplink.",
      action: "Contact Admin",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      icon: <Lock className="text-amber-500" size={32} />
    },
    BLOCKED: {
      title: "Access Terminated",
      subtitle: "This node has been blacklisted from the network.",
      description: "Due to security policy violations, your access has been permanently revoked by the security protocol.",
      action: "Appeal Access",
      color: "text-red-600",
      bg: "bg-red-600/10",
      icon: <ShieldOff className="text-red-600" size={32} />
    },
    NOT_FOUND: {
      title: "Identity Unknown",
      subtitle: "The requested profile does not exist in our archives.",
      description: "We couldn't find a matching record. Ensure you have initialized your node correctly before uplink.",
      action: "Create Account",
      color: "text-zinc-500",
      bg: "bg-zinc-500/10",
      icon: <UserX className="text-zinc-500" size={32} />
    },
    SESSION_EXPIRED: {
      title: "Sync Timed Out",
      subtitle: "Your secure session token has reached its half-life.",
      description: "For your security, sessions are periodically terminated. Please re-authenticate for a fresh tunnel.",
      action: "Re-authenticate",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      icon: <Clock className="text-blue-500" size={32} />
    },
    DEFAULT: {
      title: "System Anomaly",
      subtitle: "An unexpected error interrupted the relay.",
      description: "The vault's neural index returned an unhandled exception. Our technicians have been notified.",
      action: "Support Core",
      color: "text-blue-600",
      bg: "bg-blue-600/10",
      icon: <AlertCircle className="text-blue-600" size={32} />
    }
  };

  const config = errorMap[errorCode] || errorMap.DEFAULT;

  return (
    <div className="h-screen w-screen bg-white dark:bg-black text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-hidden relative transition-colors duration-500 flex flex-col">
      
      {/* Background FX - Non-interactable */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-[10%] -left-[10%] w-[60%] h-[60%] ${config.bg} blur-[120px] rounded-full opacity-30`} />
        
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
          }}
        />

        <div
          className="absolute inset-0 transition-opacity duration-1000 hidden md:block"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.03), transparent 50%)`,
          }}
        />
      </div>

      {/* Main Container - Centered and Fixed */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center max-w-4xl mx-auto w-full">
        
        {/* Status Tag */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${config.color.replace('text', 'border')}/20 ${config.bg} backdrop-blur-xl mb-6 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-700`}>
          <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text', 'bg')} animate-pulse shadow-[0_0_8px_currentColor]`} />
          <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${config.color}`}>
            Relay Error: {errorCode.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Visual Icon */}
        <div className="mb-6 md:mb-10 relative inline-block group shrink-0">
          <div className={`absolute inset-0 ${config.bg} blur-2xl rounded-full scale-125 group-hover:opacity-100 opacity-40 transition-opacity`} />
          <div className="relative w-20 h-20 md:w-28 md:h-28 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 rounded-3xl flex items-center justify-center shadow-xl backdrop-blur-md transform -rotate-1 group-hover:rotate-0 transition-all duration-500">
              {config.icon}
          </div>
        </div>

        {/* Text Content with Dynamic Sizing to prevent scroll */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4 md:mb-6 italic break-words w-full">
          {config.title}
        </h1>

        <p className="text-lg md:text-xl font-bold opacity-90 mb-3 md:mb-4 text-zinc-700 dark:text-zinc-200 px-4">
          {config.subtitle}
        </p>

        <p className="text-xs md:text-base font-medium opacity-50 max-w-lg mx-auto mb-8 md:mb-12 leading-relaxed px-6">
          {config.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full px-6 mb-8 md:mb-12">
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-lg">
            <MessageSquare size={16} />
            {config.action}
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-transparent border border-zinc-200 dark:border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-50 dark:hover:bg-white/5 transition-all active:scale-95"
          >
            <ArrowLeft size={16} />
            Return
          </button>
        </div>

        {/* Footer Metadata */}
        <div className="shrink-0">
          <div className="px-4 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-white/5">
              <span className="text-[8px] font-mono font-bold opacity-30 uppercase tracking-widest mr-3">Node Ref</span>
              <span className="text-[9px] font-mono font-black text-blue-600 dark:text-blue-400">
                 JGEC VAULT
              </span>
          </div>
        </div>
      </main>

      {/* Decorative Fixed Elements */}
      <div className="absolute bottom-8 right-8 hidden md:block opacity-20">
          <div className="flex flex-col items-end gap-1">
              <span className="text-[7px] font-black uppercase tracking-[0.4em]">Encrypted Session</span>
              <div className="w-20 h-[1px] bg-zinc-500" />
          </div>
      </div>
      
      <div className="absolute top-8 left-8 hidden md:block opacity-10 uppercase text-[9px] font-black tracking-widest italic">
          Secure Core V.4.0
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Suspense fallback={<div className="bg-white dark:bg-black h-screen w-screen" />}>
      <ErrorContent />
    </Suspense>
  );
}