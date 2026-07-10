"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTelemetry } from "@/components/providers/TelemetryProvider";
import bgImage from "@/assests/landpage/PTI06_18_2022_000030B.jpg";
import { login } from "@/lib/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const { setUserRole, setUserName } = useTelemetry();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Get existing users
      const usersJson = localStorage.getItem("floodeye_users");
      const users: { name: string; email: string; password: string; role: string }[] = usersJson ? JSON.parse(usersJson) : [];

      // Check if email already exists
      if (users.some((u) => u.email === email)) {
        setError("An account with this email already exists.");
        return;
      }

      // Add new user
      const newUser = { name, email, password, role: "user" };
      users.push(newUser);
      localStorage.setItem("floodeye_users", JSON.stringify(users));

      // Persist session immediately so mobile reloads retain it
      localStorage.setItem("floodeye_session", "user");
      localStorage.setItem("floodeye_user_name", name);

      setSuccess(true);

      // Auto login and redirect after a short delay
      setTimeout(async () => {
        setUserRole("user");
        setUserName(name);
        await login("user");
        router.push("/dashboard");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError("Storage unavailable. Try disabling private browsing mode.");
    }
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
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Join FloodEye to start monitoring.
          </p>
        </div>
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Account Created!</h3>
              <p className="text-slate-600">Logging you in automatically...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-slate-50 transition-shadow"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-slate-50 transition-shadow"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-slate-50 transition-shadow"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Create Account
                </button>
              </div>
              
            </form>
          )}

          {!success && (
            <div className="mt-6">
              <div className="flex items-center text-sm">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-3 text-slate-500 font-medium">Already have an account?</span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              <div className="mt-6">
                <Link
                  href="/login"
                  className="flex w-full justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Sign in instead
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
