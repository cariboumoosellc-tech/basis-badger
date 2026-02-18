"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (isSignUp) {
      if (email !== "basisbadgerllc@gmail.com") {
        setError("Only basisbadgerllc@gmail.com can sign up as admin.");
        return;
      }
      localStorage.setItem("admin_email", email);
      localStorage.setItem("admin_password", password);
      localStorage.setItem("user_email", email);
      localStorage.removeItem("badger-latest-audit");
      router.push("/dashboard");
    } else {
      // Login
      const adminEmail = localStorage.getItem("admin_email");
      const adminPassword = localStorage.getItem("admin_password");
      if (email === adminEmail && password === adminPassword) {
        localStorage.setItem("user_email", email);
        localStorage.removeItem("badger-latest-audit");
        router.push("/dashboard");
      } else {
        setError("Invalid credentials.");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">{isSignUp ? "Sign Up" : "Sign In"}</h2>
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
        <button type="submit" className="bg-[#F29C1F] text-zinc-900 font-bold py-3 rounded hover:bg-[#FFD700] transition-all mt-2">{isSignUp ? "Sign Up" : "Sign In"}</button>
        <button
          type="button"
          className="text-xs text-[#F29C1F] underline mt-2"
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
        >
          {isSignUp ? "Already have an account? Sign In" : "No account? Sign Up"}
        </button>
      </form>
    </div>
  );
}
  const [isSignUp, setIsSignUp] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (isSignUp) {
      if (email !== "basisbadgerllc@gmail.com") {
        setError("Only basisbadgerllc@gmail.com can sign up as admin.");
        return;
      }
      localStorage.setItem("admin_email", email);
      localStorage.setItem("admin_password", password);
      localStorage.setItem("user_email", email);
      localStorage.removeItem("badger-latest-audit");
      router.push("/dashboard");
    } else {
      // Login
      const adminEmail = localStorage.getItem("admin_email");
      const adminPassword = localStorage.getItem("admin_password");
      if (email === adminEmail && password === adminPassword) {
        localStorage.setItem("user_email", email);
        localStorage.removeItem("badger-latest-audit");
        router.push("/dashboard");
      } else {
        setError("Invalid credentials.");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">{isSignUp ? "Sign Up" : "Sign In"}</h2>
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
        <button type="submit" className="bg-[#F29C1F] text-zinc-900 font-bold py-3 rounded hover:bg-[#FFD700] transition-all mt-2">{isSignUp ? "Sign Up" : "Sign In"}</button>
        <button
          type="button"
          className="text-xs text-[#F29C1F] underline mt-2"
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
        >
          {isSignUp ? "Already have an account? Sign In" : "No account? Sign Up"}
        </button>
      </form>
    </div>
  );
