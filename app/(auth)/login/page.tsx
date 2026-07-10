"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import bgImage from "@/assests/landpage/PTI06_18_2022_000030B.jpg";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const { setUserRole, setUserName } = useTelemetry();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation logic
    let role = "user";
    let name = "";
    let valid = false;

    if (email === "admin@floodeye.com" && password === "admin") {
      role = "admin";
      name = "Admin";
      valid = true;
    } else if (email === "user@floodeye.com" && password === "user") {
      role = "user";
      name = "User";
      valid = true;
    } else {
      // Check localStorage users — wrapped in try/catch for Safari private mode
      try {
        const usersJson = localStorage.getItem("floodeye_users");
        if (usersJson) {
          const users = JSON.parse(usersJson);
          const user = users.find((u: { email: string; password: string; role?: string; name?: string }) => u.email === email && u.password === password);
          if (user) {
            role = user.role || "user";
            name = user.name || "User";
            valid = true;
          }
        }
      } catch {
        // localStorage unavailable (private mode on iOS Safari)
        setError("Storage unavailable. Try disabling private browsing.");
        return;
      }
    }

    if (!valid) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // Set role and name in context
    setUserRole(role as "admin" | "user");
    setUserName(name);

    // Persist to localStorage so mobile reloads retain session
    try {
      localStorage.setItem("floodeye_session", role);
      localStorage.setItem("floodeye_user_name", name);
    } catch { /* ignore — already handled above */ }

    // Call server action to set cookie
    await login(role);

    // Redirect to dashboard
    router.push("/dashboard");
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="object-cover object-[center_20%] blur-[3.4px] scale-110"
          priority
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-slate-900/40" />
      </div>

      <Link 
        href="/" 
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-md border border-white/20 hover:border-white/30 rounded-full transition-all duration-200 shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl shadow-black/20 border border-white/40 rounded-3xl z-10 relative">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-blue-600/20 mb-4">
            <Image src="/FloodEye.jpeg" alt="FloodEye" width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Please enter your details to sign in.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:text-sm transition-all"
                  placeholder="admin@floodeye.com or user@floodeye.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:text-sm transition-all"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
            
          </form>

          <div className="mt-6">
            <div className="flex items-center text-sm">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-slate-500 font-medium">Don't have an account?</span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            <div className="mt-6">
              <Link
                href="/signup"
                className="flex w-full justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
