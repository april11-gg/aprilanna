import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: "", ...options });
        }
      }
    }
  );

  const { data } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;

  const publicRoutes = ["/", "/login", "/signup"];
  if (publicRoutes.some((p) => path.startsWith(p))) return res;

  if (!data.user) return NextResponse.redirect(new URL("/login", req.url));

  if (path.startsWith("/artist")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", data.user.id)
      .single();
    if (profile?.user_type !== "artist")
      return NextResponse.redirect(new URL("/venue/dashboard", req.url));
  }
  if (path.startsWith("/venue")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", data.user.id)
      .single();
    if (profile?.user_type !== "venue")
      return NextResponse.redirect(new URL("/artist/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/artist/:path*", "/venue/:path*"]
};
