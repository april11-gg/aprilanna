import Link from "next/link";

export default function Landing() {
  return (
    <section className="min-h-[75vh] grid place-items-center text-center">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          StageMatch
        </h1>
        <p className="text-xl text-white/80">
          Marketplace that matches musicians to venues for paid gigs, based on availability, budget and music style.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup?type=artist" className="btn btn-primary text-lg px-6 py-3">I’m an Artist</Link>
          <Link href="/signup?type=venue" className="btn bg-white/10 text-lg px-6 py-3">I’m a Venue</Link>
        </div>
        <div>
          <Link href="/login" className="text-white/70 underline">Already have an account? Log in</Link>
        </div>
      </div>
    </section>
  );
}
