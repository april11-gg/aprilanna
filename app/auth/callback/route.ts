import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const supabase = serverClient();

  if (code) {
    // Exchange the code for a session and set cookies
    await supabase.auth.exchangeCodeForSession(code);
    // Fetch profile to decide where to go
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single();
      const nextPath = profile?.user_type === "venue" ? "/venue/dashboard" : "/artist/dashboard";
      return NextResponse.redirect(new URL(nextPath, url.origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=oauth", url.origin));
}
