"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/lib/actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const timer = setTimeout(() => {
        if (errorParam === "CredentialsSignin") {
          setError("Invalid username or password.");
        } else {
          setError(`Authentication Error: ${errorParam}`);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  async function handleForm(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await loginAction(formData);
    if (result) {
      setError(result);
      setLoading(false);
    }
  }

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

        <form action={handleForm} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              name="username"
              type="text"
              className="w-full bg-black border border-neutral-800 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
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
