// Home page certification badge pictures come from the website files, never from the admin.
// To change one, replace the file in public/images/certifications/ (same name) or change the path here.
// Order matches the badges: FSSC 22000, ISO 14001, ISO 9001, Halal, PFA.
export const CERT_IMAGES = [
  "/images/certifications/Mask group.png",
  "/images/certifications/Mask group (1).png",
  "/images/certifications/Mask group (2).png",
  "/images/certifications/Mask group (3).png",
  "/images/certifications/Mask group (4).png",
];

export function withCertImages(list) {
  return list.map((c, i) => (CERT_IMAGES[i] ? { ...c, image: CERT_IMAGES[i] } : c));
}
