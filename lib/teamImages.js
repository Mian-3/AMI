// About page team photos come from the website files (public/images/team), never from the admin.
// Order matches the cards: Managing Director, Director, Director Operations, Operations Manager.
export const TEAM_IMAGES = [
  "/images/team/muhammad-ali-hassan.png",
  "/images/team/nayyer-hameed.png",
  "/images/team/ahmad-mustafa.png",
  "/images/team/mahad-bin-hassan.png",
];

export function withTeamImages(about) {
  if (!about || !Array.isArray(about.team)) return about;
  return { ...about, team: about.team.map((p, i) => (TEAM_IMAGES[i] ? { ...p, image: TEAM_IMAGES[i] } : p)) };
}
