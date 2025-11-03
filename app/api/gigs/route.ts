import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function GET() {
  const supabase = serverClient();
  const { data } = await supabase.from("gigs").select("*").order("created_at", { ascending: false });
  return NextResponse.json(data ?? []);
}
