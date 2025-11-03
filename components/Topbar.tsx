"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Topbar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await fetch("/auth/signout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="sticky top-0 z-40 w-full backdrop-blur bg-black/30 border-b border-white/10">
      <div className="mx-auto max-w-6xl flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-xl">🟣 StageMatch</Link>
        <div className="flex items-center gap-3">
          {pathname?.startsWith("/artist") && (
            <Link href="/artist/dashboard" className="btn btn-primary">Artist Dashboard</Link>
          )}
          {pathname?.startsWith("/venue") && (
            <Link href="/venue/dashboard" className="btn btn-primary">Venue Dashboard</Link>
          )}
          <button onClick={signOut} disabled={loading} className="btn bg-white/10">Sign out</button>
        </div>
      </div>
    </div>
  );
}
