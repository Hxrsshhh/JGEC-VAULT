"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  User,
  Lock,
  Mail,
  ChevronLeft,
  Cpu,
  Globe,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

export default function SignupView({ onLoginRedirect }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    alias: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      const msg = "Cipher mismatch: Passwords do not match";
      setError(msg);
      toast.error(msg, {
        description: "Ensure both security keys are identical.",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.alias,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Initialization failed");
        toast.error(data.error || "Uplink Failed", { id: loadingToast });
        setLoading(false);
        return;
      }

      // Auto login after successful signup
      const login = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (login?.error) {
        toast.warning("Node registered, but auto-login failed.", {
          id: loadingToast,
        });
        router.push("/signin");
        return;
      }

      router.push("/dashboard?signup=1");
    } catch (err) {
      setError("Server uplink error");
      toast.error("Critical System Error", {
        description: "Could not reach the authentication relay.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    toast.info("Redirecting to Google Relay...");
    await signIn("google", {
      callbackUrl: "/dashboard?login=1",
    });
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-black/10 overflow-hidden font-sans relative">
      {/* Top Navigation Bar - Matched with SigninView */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-20">
        <div className="flex items-center gap-6">
          <Link href="/">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 rounded-2xl bg-white/97 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 shadow-xl group"
            >
              <ChevronLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>
          </Link>

          <div className="hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-500 leading-none mb-1">
              Protocol // v4.2
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] font-black text-zinc-400 dark:text-white/40 uppercase tracking-[0.2em]">
                Uplink_Signal_Stable
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-3 justify-end mb-1">
            <h1 className="text-lg font-black italic text-zinc-900 dark:text-white uppercase tracking-tighter">
              JGEC <span className="text-blue-600">Vault.</span>
            </h1>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 overflow-hidden">
              <Image src="/logo1.webp" height={50} width={50} alt="Logo" />
            </div>
          </div>
          <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            Global Node Access
          </p>
        </div>
      </div>

      <div className="max-w-md w-full px-6 relative z-10 pt-20">
        {/* Central Branding Header */}
        <div className="text-center mb-6 animate-in fade-in zoom-in duration-700">
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-tight">
            Initialize <span className="text-blue-600">Uplink.</span>
          </h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-3 bg-zinc-100 dark:bg-white/5 inline-block px-4 py-1.5 rounded-full border border-zinc-200 dark:border-white/5">
            Register secure session credentials
          </p>
        </div>

        {/* Main Interface Card */}
        <div className="bg-white/97 dark:bg-black/10 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5 transition-colors">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="text-red-500 shrink-0" size={14} />
              <p className="text-[9px] font-black uppercase text-red-500">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Google Sign-in */}
            <button
              onClick={handleGoogleSignup}
              className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-blue-500/50 rounded-2xl py-3 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-white">
                Google Synchronize
              </span>
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px grow bg-zinc-200 dark:bg-white/5"></div>
              <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                or generate key
              </span>
              <div className="h-px grow bg-zinc-200 dark:bg-white/5"></div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 gap-3.5">
                {/* Node Alias */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 px-1">
                    Node Alias
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors"
                      size={16}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Neural_Ghost"
                      className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-5 py-3 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                      value={formData.alias}
                      onChange={(e) =>
                        setFormData({ ...formData, alias: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Neural Mail */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 px-1">
                    Neural Mail
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors"
                      size={16}
                    />
                    <input
                      type="email"
                      required
                      placeholder="node@neural.net"
                      className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-5 py-3 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Password Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 px-1">
                      Cipher
                    </label>
                    <div className="relative group">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors"
                        size={16}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••"
                        className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-10 py-3 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-600"
                      >
                        {showPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 px-1">
                      Verify
                    </label>
                    <div className="relative group">
                      <ShieldCheck
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors"
                        size={16}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••"
                        className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-10 py-3 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-600/30 transition-all active:scale-[0.98] group flex items-center justify-center gap-3 italic mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Establish Connection{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-white/5 text-center">
            <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">
              Existing Node?{" "}
              <Link href="/signin">
                <button
                  onClick={onLoginRedirect}
                  className="text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition-colors underline underline-offset-4 font-black"
                >
                  Access Portal
                </button>
              </Link>
            </p>
          </div>
        </div>

        {/* Tactical Info */}
        <div className="mt-6 flex justify-between items-center opacity-60 dark:opacity-40 px-2">
          <div className="flex items-center gap-2">
            <Cpu size={12} className="text-blue-600 dark:text-blue-500" />
            <span className="text-[8px] font-black text-zinc-600 dark:text-white uppercase tracking-widest">
              Auth_Mode: encrypted
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={12} className="text-zinc-400 dark:text-zinc-400" />
            <span className="text-[8px] font-black text-zinc-600 dark:text-white uppercase tracking-widest">
              Relay: Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
