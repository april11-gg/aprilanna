import Filters from "@/components/Filters";
import { serverClient } from "@/lib/supabase";
import Link from "next/link";

async function fetchGigs(searchParams: any) {
  const supabase = serverClient();
  let query = supabase.from("gigs").select("*, profiles!gigs_venue_id_fkey(display_name, location, capacity)");
  if (searchParams.genre) query = query.ilike("genre", `%${searchParams.genre}%`);
  if (searchParams.location) query = query.ilike("location", `%${searchParams.location}%`);
  if (searchParams.date) query = query.eq("date", searchParams.date);
  if (searchParams.minPrice) query = query.gte("budget_min", Number(searchParams.minPrice));
  if (searchParams.maxPrice) query = query.lte("budget_max", Number(searchParams.maxPrice));
  if (searchParams.minCapacity) query = query.gte("capacity_required", Number(searchParams.minCapacity));
  const { data } = await query.order("created_at", { ascending: false });
  return data ?? [];
}

async function fetchApplications() {
  const supabase = serverClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("applications")
    .select("*, gigs(title, date, location)")
    .eq("artist_id", user.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function ArtistDashboard({ searchParams }: { searchParams: any }) {
  const gigs = await fetchGigs(searchParams);
  const apps = await fetchApplications();

  async function apply(gigId: string) {
    "use server";
    const supabase = serverClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("applications").insert({ gig_id: gigId, artist_id: user.id, status: "applied" });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Artist Dashboard</h1>
      <Filters onChange={() => {}} />
      <div className="grid-cols-panel">
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-3">My Applications</h3>
            <div className="space-y-2">
              {apps.map((a:any)=>(
                <div key={a.id} className="flex justify-between items-center bg-white/5 rounded-xl p-3">
                  <div>
                    <div className="font-medium">{a.gigs?.title}</div>
                    <div className="text-xs text-white/60">{a.gigs?.date} · {a.gigs?.location}</div>
                  </div>
                  <div className="text-sm">{a.status}</div>
                  {a.status === "accepted" && <Link href={`/artist/dashboard?chat=${a.id}`} className="text-sm underline">Open chat</Link>}
                </div>
              ))}
              {apps.length===0 && <div className="text-sm text-white/60">No applications yet.</div>}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Available Gigs</h3>
          </div>
          <div className="grid gap-4">
            {gigs.map((g:any)=>(
              <form key={g.id} action={apply.bind(null, g.id)} className="card space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{g.title}</div>
                  <button className="btn btn-primary">Apply</button>
                </div>
                <div className="text-sm text-white/70">{g.location} · {g.date} · {g.genre}</div>
                <div className="text-sm text-white/70">Budget: ${g.budget_min}–${g.budget_max} · Capacity req: {g.capacity_required ?? "n/a"}</div>
                <div className="text-sm">{g.description}</div>
              </form>
            ))}
            {gigs.length===0 && <div className="text-sm text-white/60">No gigs match your filters yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
