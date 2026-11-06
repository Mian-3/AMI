// About page team photos come from the website files (public/images/team), never from the admin.
// Order matches the cards: Managing Director, Director, Director Operations, Operations Manager.
export const TEAM_IMAGES = [
  "/images/team/muhammad-ali-hassan.jpg",
  "/images/team/nayyer-hameed.jpg",
  "/images/team/ahmad-mustafa.jpg",
  "/images/team/mahad-bin-hassan.jpg",
];

export function withTeamImages(about) {
  if (!about || !Array.isArray(about.team)) return about;
  return { ...about, team: about.team.map((p, i) => (TEAM_IMAGES[i] ? { ...p, image: TEAM_IMAGES[i] } : p)) };
}
