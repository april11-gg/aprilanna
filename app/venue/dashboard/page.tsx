import { serverClient } from "@/lib/supabase";
import Chat from "@/components/Chat";

async function myGigs() {
  const supabase = serverClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase.from("gigs").select("*").eq("venue_id", user?.id).order("created_at", { ascending: false });
  return data ?? [];
}
async function applicants(gigId: string) {
  const supabase = serverClient();
  const { data } = await supabase
    .from("applications")
    .select("*, profiles!applications_artist_id_fkey(display_name, genre)")
    .eq("gig_id", gigId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function VenueDashboard() {
  const gigs = await myGigs();

  async function createGig(formData: FormData) {
    "use server";
    const supabase = serverClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("gigs").insert({
      venue_id: user!.id,
      title: String(formData.get("title")||""),
      description: String(formData.get("description")||""),
      genre: String(formData.get("genre")||""),
      date: String(formData.get("date")||""),
      location: String(formData.get("location")||""),
      budget_min: Number(formData.get("budget_min")||0),
      budget_max: Number(formData.get("budget_max")||0),
      capacity_required: Number(formData.get("capacity_required")||0),
      tech_specs: String(formData.get("tech_specs")||"")
    });
  }
  async function deleteGig(id: string) {
    "use server";
    const supabase = serverClient();
    await supabase.from("gigs").delete().eq("id", id);
  }
  async function setStatus(appId: string, status: "accepted" | "rejected") {
    "use server";
    const supabase = serverClient();
    await supabase.from("applications").update({ status }).eq("id", appId);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Venue Dashboard</h1>

      <div className="card">
        <h3 className="font-semibold mb-3">Post a new Gig</h3>
        <form action={createGig} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="title" className="input" placeholder="Title" required />
          <input name="genre" className="input" placeholder="Genre" />
          <input name="location" className="input" placeholder="Location" />
          <input name="date" className="input" type="date" />
          <input name="budget_min" className="input" type="number" placeholder="Budget min" />
          <input name="budget_max" className="input" type="number" placeholder="Budget max" />
          <input name="capacity_required" className="input" type="number" placeholder="Capacity required" />
          <input name="tech_specs" className="input" placeholder="Tech specs" />
          <textarea name="description" className="input md:col-span-2" placeholder="Description"></textarea>
          <div className="md:col-span-2">
            <button className="btn btn-primary">Create Gig</button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {gigs.map(async (g: any) => {
          "use server";
          const aps = await applicants(g.id);
          return (
            <div key={g.id} className="card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{g.title}</div>
                  <div className="text-sm text-white/70">{g.location} · {g.date} · {g.genre} · Budget ${g.budget_min}-{g.budget_max}</div>
                </div>
                <form action={deleteGig.bind(null, g.id)}>
                  <button className="btn bg-white/10">Delete</button>
                </form>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Applicants</h4>
                <div className="space-y-2">
                  {aps.map((a:any)=>(
                    <div key={a.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-white/5 rounded-xl p-3">
                      <div>
                        <div className="font-medium">{a.profiles?.display_name} <span className="text-white/60">({a.profiles?.genre})</span></div>
                        <div className="text-xs text-white/60">Status: {a.status}</div>
                      </div>
                      <div className="flex gap-2">
                        <form action={setStatus.bind(null, a.id, "accepted")}><button className="btn btn-primary">Accept</button></form>
                        <form action={setStatus.bind(null, a.id, "rejected")}><button className="btn bg-white/10">Reject</button></form>
                      </div>
                      {a.status==="accepted" && <div className="md:ml-auto text-sm underline"><a href={`#chat-${a.id}`}>Open chat</a></div>}
                    </div>
                  ))}
                  {aps.length===0 && <div className="text-sm text-white/60">No applicants yet.</div>}
                </div>
              </div>
              {aps.filter((x:any)=>x.status==="accepted").map((a:any)=>(
                <div id={`chat-${a.id}`} key={`chat-${a.id}`}><Chat applicationId={a.id} /></div>
              ))}
            </div>
          );
        })}
        {gigs.length===0 && <div className="text-sm text-white/60">No gigs posted yet.</div>}
      </div>
    </div>
  );
}
