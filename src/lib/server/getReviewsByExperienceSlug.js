// @/lib/server/getReviewsByExperienceSlug.js

import "server-only";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

export async function getReviewsByExperienceSlug(slug) {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, created_at, rating, comment, display_name, country, source")
    .eq("experience_slug", slug)
    .order("created_at", { ascending: false });
  
  if (error) throw new Error(`Failed to load reviews: ${error.message}`);

  return (data || []).map((row) => ({
    id: row.id,
    date: row.created_at?.slice(0, 10) || "",
    rating: row.rating,
    comment: row.comment,
    displayName: row.display_name || "Guest",
    country: row.country || "",
    source: row.source,
  }));
}