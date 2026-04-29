"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      if (res.ok) {
        toast.success("Registration successful! You can now log in.");
        router.push("/login");
      } else {
        const text = await res.text();
        setError(text || "Failed to register");
      }
    } catch (err) {
      console.error("Registration request failed:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-32 pb-24 items-center">
      <div className="w-full max-w-md px-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-4">
            Join the Collective
          </h1>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Create your account to track orders and save your code.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-widest p-4 mb-8 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-neutral-200 text-black px-5 py-4 text-xs font-bold focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-neutral-200 text-black px-5 py-4 text-xs font-bold focus:outline-none focus:border-black transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-neutral-200 text-black px-5 py-4 text-xs font-bold focus:outline-none focus:border-black transition-colors"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 hover:bg-neutral-800 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
