// Turns a video link saved in the admin into something the page can play.
// Supports direct files (mp4, webm, mov) and YouTube links. Anything else is ignored.

export function parseVideo(url) {
  if (typeof url !== "string") return null;
  const v = url.trim();
  if (!v || !(v.startsWith("https://") || (v.startsWith("/") && !v.startsWith("//")))) return null;

  const yt = v.match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) {
    const id = yt[1];
    // muted autoplay loop, no controls, so it behaves like a background video. enablejsapi lets the sound button work.
    return {
      kind: "youtube",
      id,
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`,
    };
  }

  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(v)) return { kind: "file", src: v };
  return null;
}
