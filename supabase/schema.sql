create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_type text check (user_type in ('artist','venue')) not null,
  display_name text,
  genre text,
  bio text,
  location text,
  tech_requirements text,
  pricing_min int,
  pricing_max int,
  media_urls text[],
  venue_type text,
  capacity int,
  available_dates text[],
  budget_min int,
  budget_max int,
  tech_specs text,
  created_at timestamp with time zone default now()
);

create table if not exists public.gigs (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  genre text,
  date date,
  location text,
  budget_min int,
  budget_max int,
  capacity_required int,
  tech_specs text,
  created_at timestamp with time zone default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid references public.gigs(id) on delete cascade not null,
  artist_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'applied' check (status in ('applied','accepted','rejected')),
  created_at timestamp with time zone default now(),
  unique (gig_id, artist_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
alter table public.gigs enable row level security;
alter table public.applications enable row level security;
alter table public.messages enable row level security;

create policy "profiles read" on public.profiles for select using (true);
create policy "profiles upsert own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

create policy "gigs read" on public.gigs for select using (true);
create policy "gigs insert by venue" on public.gigs for insert with check (auth.uid() = venue_id);
create policy "gigs update by venue" on public.gigs for update using (auth.uid() = venue_id);
create policy "gigs delete by venue" on public.gigs for delete using (auth.uid() = venue_id);

create policy "applications insert by artist" on public.applications for insert with check (auth.uid() = artist_id);
create policy "applications read own artist" on public.applications for select using (auth.uid() = artist_id);
create policy "applications read by venue owner" on public.applications
  for select using (exists (select 1 from public.gigs g where g.id = applications.gig_id and g.venue_id = auth.uid()));
create policy "applications update by venue" on public.applications
  for update using (exists (select 1 from public.gigs g where g.id = applications.gig_id and g.venue_id = auth.uid()));
create policy "applications delete by artist" on public.applications for delete using (auth.uid() = artist_id);

create policy "messages read participants" on public.messages for select using (
  exists (
    select 1 from public.applications a
    where a.id = messages.application_id
      and a.status = 'accepted'
      and (a.artist_id = auth.uid()
        or exists (select 1 from public.gigs g where g.id = a.gig_id and g.venue_id = auth.uid()))
  )
);

create policy "messages insert participants" on public.messages for insert with check (
  exists (
    select 1 from public.applications a
    where a.id = application_id
      and a.status = 'accepted'
      and (a.artist_id = auth.uid()
        or exists (select 1 from public.gigs g where g.id = a.gig_id and g.venue_id = auth.uid()))
  )
);
