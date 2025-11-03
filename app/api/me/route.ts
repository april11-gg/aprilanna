import { serverClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = serverClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json(null, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return NextResponse.json(profile ?? null);
}
