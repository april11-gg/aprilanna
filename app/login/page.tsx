"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { browserClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const [oauthing, setOAuthing] = useState(false);
  const router = useRouter(); const sp = useSearchParams();
  const supa = browserClient();

  useEffect(()=>{
    const e = sp.get("error"); if (e) setErr("OAuth error. Please try again.");
  }, [sp]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const res = await fetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    const j = await res.json();
    if (!res.ok) { setErr(j.error ?? "Login failed"); setLoading(false); return; }
    const me = await fetch("/api/me"); const profile = await me.json();
    router.replace(profile?.user_type === "venue" ? "/venue/dashboard" : "/artist/dashboard");
  }

  async function signInWith(provider: "google" | "instagram") {
    setOAuthing(true); setErr("");
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`;
    const { error } = await supa.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) { setErr(error.message); setOAuthing(false); }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold mb-4">Log in</h2>
      {err && <p className="text-red-400 mb-2">{err}</p>}
      <div className="space-y-3 mb-4">
        <button onClick={()=>signInWith("google")} disabled={oauthing} className="btn bg-white/10 w-full">
          {oauthing ? "…" : "Continue with Google"}
        </button>
        <button onClick={()=>signInWith("instagram")} disabled={oauthing} className="btn bg-white/10 w-full">
          {oauthing ? "…" : "Continue with Instagram"}
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button disabled={loading} className="btn btn-primary w-full">{loading?"…":"Log in"}</button>
      </form>
    </div>
  );
}
