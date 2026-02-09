// @/lib/server/getReviewsByExperienceSlug.js

import "server-only";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

// DBからレビューのテーブルのデータを取得する。
export async function getReviewsByExperienceSlug(slug) {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, created_at, rating, comment, display_name, country, source")
    .eq("experience_slug", slug)
    .order("created_at", { ascending: false });
  
  if (error) throw new Error(`Failed to load reviews: ${error.message}`);

  return (data || []).map((reviewRow) => ({
    id: reviewRow.id,
    // インデックス0番目から、10個の数字を取ってね。
    // supabaseから帰ってくる時間の文字列は、2026-02-06T13:18:30.123Z
    // 先頭から10個は、『2026-02-06』
    // この値が欲しい。
    // created_atが『?』あればその値をsliceに渡し、
    // なければ『undefined』を返す。『undefined』にsliceメソッドを充てても落ちない。
    // 『null』が帰ってしまうと、『Cannot read properties of null』となりアプリが落ちる。
    date: reviewRow.created_at?.slice(0, 10) || "",
    rating: reviewRow.rating,
    comment: reviewRow.comment,
    displayName: reviewRow.display_name || "Guest",
    country: reviewRow.country || "",
    source: reviewRow.source,
  }));
}