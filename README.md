# StageMatch
Modern marketplace connecting artists and venues for paid gigs.

## Tech
- Next.js (App Router), TypeScript, TailwindCSS
- Supabase (Auth + DB + RLS)
- Vercel deploy

## Setup (Local)
1) Create a Supabase project and copy `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` into `.env.local`.
2) In Supabase SQL editor, paste and run `supabase/schema.sql`.
3) `npm i` then `npm run dev`.

## Deploy (Vercel)
1) Push this folder to a new GitHub repo.
2) Import the repo in Vercel and add the two env vars above.
3) Build command: `next build`. Output: `Next.js`. Auto-redeploy on push.

## URLs
- `/` landing
- `/signup?type=artist` and `/signup?type=venue`
- `/login`
- `/artist/dashboard`
- `/venue/dashboard`


## One‑Click Deploy

> Push this repo to **GitHub** first (public or private). Then click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?project-name=stagematch&repository-name=stagematch&repository-url=REPLACE_WITH_YOUR_GITHUB_REPO_URL&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_SITE_URL)

- `NEXT_PUBLIC_SITE_URL` should be your site URL (e.g. `https://stagematch-yourid.vercel.app`); you can paste your preview URL after first deploy and redeploy.


## Enable Google & Instagram Login (Supabase)

1) **Auth → URL Configuration**  
   - Site URL: your deployed URL (e.g. `https://stagematch-yourid.vercel.app`)  
   - Redirect URLs: add `https://stagematch-yourid.vercel.app/auth/callback` and your local `http://localhost:3000/auth/callback`

2) **Auth Providers → Google**  
   - Toggle **ON**, set Client ID & Secret from Google Cloud Console (OAuth app).  
   - Authorized redirect URI (in Google): `https://<YOUR-VERCEL-DOMAIN>/auth/callback`

3) **Auth Providers → Instagram**  
   - Toggle **ON**, set Client ID & Secret from Meta for Developers.  
   - Valid OAuth Redirect URI: `https://<YOUR-VERCEL-DOMAIN>/auth/callback`

4) **Env vars (Vercel Project → Settings → Environment Variables)**  
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL



---
## One‑Click Deploy (pre-filled)
> After you upload this folder to GitHub, click this button in your repo README:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?project-name=stagematch&repository-url=REPLACE_WITH_YOUR_REPO_URL&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_SITE_URL&envDescription=Supabase%20keys%20and%20site%20URL&envLink=https%3A%2F%2Fsupabase.com%2Fdocs%2Fguides%2Fapi&NEXT_PUBLIC_SUPABASE_URL=https://yfdeakjytzjcpbthaqvr.supabase.co&NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZGVha2p5dHpqY3BidGhhcXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMzU1NTQsImV4cCI6MjA3NzcxMTU1NH0.FX20xkNIeTT2kWSRtg8j9PlzByVuXa10POmxKL1p87M&NEXT_PUBLIC_SITE_URL=)

*No typing required—the envs above are already prefilled; Vercel will only ask you to confirm.*
