import { serverClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = serverClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
