"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const timer = setTimeout(() => {
      if (errorParam === "CredentialsSignin") {
        setError("Invalid email/username or password.");
      } else if (errorParam) {
        setError(`Auth error: ${errorParam}`);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username: identifier,
        password,
        redirect: false
      });

      if (res?.error) {
        setError("Invalid credentials.");
        setLoading(false);
      } else {
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (identifier === "admin") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-32 pb-24 items-center">
      <div className="w-full max-w-md px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-neutral-500 transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to Store
        </Link>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Decode In</h1>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Enter your credentials to access the collective.
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
              Email or Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 hover:bg-neutral-800 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className="mt-12 text-center border-t border-neutral-100 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-black hover:underline">
              Join the Collective
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}
