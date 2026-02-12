export function getSiteURL() {
  const url = process.env.NEXT_PUBLIC_SITE_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not set");
  }

  return url.replace(/\/$/, "");  // 末尾の『/』を削除
}