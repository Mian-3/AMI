// Line icons for the social links in the header and footer. Server and client safe.
const PATHS = {
  facebook: <path d="M14.5 21v-8h2.7l.5-3.3h-3.2V7.6c0-1 .5-1.6 1.7-1.6h1.7V3.2C17.6 3.1 16.7 3 15.7 3 13.2 3 11.5 4.5 11.5 7.1v2.6H8.8V13h2.7v8z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <path d="M4.5 9.5v10" />
      <circle cx="4.5" cy="5" r="1" fill="currentColor" />
      <path d="M9.5 19.5v-10" />
      <path d="M9.5 13.5a4 4 0 0 1 4-4h.5a4 4 0 0 1 4 4v6" />
    </>
  ),
  x: (
    <>
      <path d="M4 4l11.7 16H20L8.3 4z" />
      <path d="M4 20l6.8-6.8M13.2 10.8L20 4" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="M10 9.2l5 2.8-5 2.8z" />
    </>
  ),
  tiktok: <path d="M14 3.5v11a3.6 3.6 0 1 1-3.6-3.6M14 3.5c.4 2.5 2 4.1 4.6 4.3" />,
};

export default function SocialGlyph({ platform, className, strokeWidth = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {PATHS[platform] || PATHS.facebook}
    </svg>
  );
}
