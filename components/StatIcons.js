// Icons for the Home statistics cards. Works in server and client components.
const PATHS = {
  established: (
    <>
      <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" />
      <path d="M15 10h4a1 1 0 0 1 1 1v10" />
      <path d="M8 8h3M8 12h3M8 16h3M3 21h18" />
    </>
  ),
  products: (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </>
  ),
  clients: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  team: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16.5 8.5a3 3 0 1 0 0-6" />
      <path d="M19 14.5a5.5 5.5 0 0 1 3 5" />
    </>
  ),
  area: (
    <>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
      <path d="M9 9h6v6H9z" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-1.5 7 5-2.8 5 2.8-1.5-7" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6.2L4.6 18.4A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.7-3.1L14 9.2V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V9l6 4V9l6 4V5h3a1 1 0 0 1 1 1v15" />
      <path d="M3 21h18M8 17h2M14 17h2" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h11v10H2zM13 9h4.5l3.5 3.5V16h-8" />
      <circle cx="6.5" cy="17.5" r="2" />
      <circle cx="16.5" cy="17.5" r="2" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.4 3 7.9 7.5 9.5 4.5-1.6 7.5-5.1 7.5-9.5V6z" />
      <path d="m8.8 12 2.4 2.4 4.2-4.6" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15" />
      <path d="M5 19c2-5 5-8 9-10" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
};

export const ICON_LABELS = {
  established: "Building",
  products: "Box",
  clients: "People",
  globe: "Globe",
  team: "Team",
  area: "Area",
  award: "Award",
  flask: "Flask",
  factory: "Factory",
  truck: "Truck",
  star: "Star",
  shield: "Shield",
  leaf: "Leaf",
  clock: "Clock",
};

export default function StatIcon({ id, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[id] || PATHS.star}
    </svg>
  );
}
