"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { UserType } from "@/lib/types";

export default function SignupPage() {
  const params = useSearchParams();
  const type = (params.get("type") as UserType) || "artist";
  const router = useRouter();

  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [display_name,setDN]=useState(""); const [location,setLoc]=useState("");
  const [genre,setGenre]=useState(""); const [venueType,setVT]=useState("");
  const [capacity,setCap]=useState<number | "">(""); const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    const body: any = { email, password, user_type: type, display_name, location, genre, venue_type: venueType, capacity: capacity || null };
    const res = await fetch("/auth/signup", { method: "POST", body: JSON.stringify(body) });
    const j = await res.json();
    if (!res.ok) { setError(j.error ?? "Sign up failed"); setLoading(false); return; }
    const me = await fetch("/api/me"); const p = await me.json();
    router.replace(p?.user_type === "venue" ? "/venue/dashboard" : "/artist/dashboard");
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h2 className="text-2xl font-bold mb-4">Create {type} account</h2>
      {error && <p className="text-red-400 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div><label className="label">Email</label><input className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><label className="label">Password</label><input className="input" type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div><label className="label">Display name</label><input className="input" value={display_name} onChange={e=>setDN(e.target.value)} /></div>
        <div><label className="label">Location</label><input className="input" value={location} onChange={e=>setLoc(e.target.value)} /></div>
        {type === "artist" ? (
          <div><label className="label">Primary genre</label><input className="input" value={genre} onChange={e=>setGenre(e.target.value)} /></div>
        ) : (
          <>
            <div><label className="label">Venue type</label><input className="input" value={venueType} onChange={e=>setVT(e.target.value)} /></div>
            <div><label className="label">Capacity</label><input className="input" type="number" value={capacity} onChange={e=>setCap(e.target.value===""?"":Number(e.target.value))} /></div>
          </>
        )}
        <button disabled={loading} className="btn btn-primary w-full">{loading?"…":"Sign up"}</button>
      </form>
    </div>
  );
}
