import { serverClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const applicationId = url.searchParams.get("applicationId");
  const supabase = serverClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = serverClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { applicationId, content } = await req.json();
  const { error } = await supabase.from("messages").insert({ application_id: applicationId, sender_id: user.id, content });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
