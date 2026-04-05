"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Use the native NextAuth redirect. This is much more reliable on live servers
    // because it ensures the cookie is set before the redirect happens.
    const res = (await signIn("credentials", {
      username,
      password,
      callbackUrl: "/admin",
      redirect: true
    })) as { error: string | null } | undefined;

    if (res?.error) {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-['Montserrat',sans-serif]">
      <div className="bg-neutral-900 p-8 w-full max-w-md border border-neutral-800">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-black uppercase tracking-widest italic mb-2">
            CODIGO
          </h1>
          <p className="text-neutral-500 text-xs tracking-[0.3em] uppercase">Admin Portal</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black uppercase tracking-widest py-4 hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Access Protocol"}
          </button>
        </form>
      </div>
    </div>
  );
}
