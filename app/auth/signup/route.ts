import { serverClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import type { UserType } from "@/lib/types";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, user_type, display_name, location, genre, venue_type, capacity } = body as {
    email: string; password: string; user_type: UserType; display_name?: string; location?: string; genre?: string; venue_type?: string; capacity?: number | null;
  };
  const supabase = serverClient();
  const { data: auth, error } = await supabase.auth.signUp({ email, password });
  if (error || !auth.user) return NextResponse.json({ error: error?.message ?? "Auth failed" }, { status: 400 });

  const { error: pe } = await supabase.from("profiles").upsert({
    id: auth.user.id,
    user_type,
    display_name: display_name ?? null,
    location: location ?? null,
    genre: user_type === "artist" ? genre ?? null : null,
    venue_type: user_type === "venue" ? venue_type ?? null : null,
    capacity: user_type === "venue" ? capacity ?? null : null
  }, { onConflict: "id" });

  if (pe) return NextResponse.json({ error: pe.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
