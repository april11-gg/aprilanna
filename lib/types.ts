export type UserType = "artist" | "venue";
export type Profile = {
  id: string;
  user_type: UserType;
  display_name: string | null;
  genre: string | null;
  bio: string | null;
  location: string | null;
  tech_requirements: string | null;
  pricing_min: number | null;
  pricing_max: number | null;
  media_urls: string[] | null;
  venue_type: string | null;
  capacity: number | null;
  available_dates: string[] | null;
  budget_min: number | null;
  budget_max: number | null;
  tech_specs: string | null;
  created_at: string;
};

export type Gig = {
  id: string;
  venue_id: string;
  title: string;
  description: string | null;
  genre: string | null;
  date: string | null;
  location: string | null;
  budget_min: number | null;
  budget_max: number | null;
  capacity_required: number | null;
  tech_specs: string | null;
  created_at: string;
};

export type Application = {
  id: string;
  gig_id: string;
  artist_id: string;
  status: "applied" | "accepted" | "rejected";
  created_at: string;
};

export type Message = {
  id: string;
  application_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};
