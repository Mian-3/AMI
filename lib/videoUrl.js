// Turns a video link saved in the admin into something the page can play.
// Supports direct files (mp4, webm) and YouTube links. Anything else is ignored.

export function parseVideo(url) {
  if (typeof url !== "string") return null;
  const v = url.trim();
  if (!v || !(v.startsWith("https://") || (v.startsWith("/") && !v.startsWith("//")))) return null;

  const yt = v.match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1` };

  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(v)) return { kind: "file", src: v };
  return null;
}
