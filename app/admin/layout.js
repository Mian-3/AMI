import "../globals.css";

export const metadata = {
  title: "Admin | AM International",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return <div className="min-h-screen bg-[#f4f5f7] text-ink">{children}</div>;
}
