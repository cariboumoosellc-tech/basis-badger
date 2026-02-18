"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple email check for demo; replace with real auth
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    localStorage.setItem("user_email", email);
    // Reset auditResult state for clean login
    localStorage.removeItem("badger-latest-audit");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Sign In</h2>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-[#F29C1F] text-zinc-900 font-bold py-3 rounded hover:bg-[#FFD700] transition-all mt-2">Sign In</button>
      </form>
    </div>
  );
}
