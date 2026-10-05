"use client";

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 19h16" />
    </svg>
  );
}

export default function CatalogueDownloadLink({ label, className }) {
  const handleClick = (e) => {
    e.preventDefault();
    const url = "/documents/ami-catalogue.pdf";
    window.open(url, "_blank", "noopener,noreferrer");
    const link = document.createElement("a");
    link.href = url;
    link.download = "AM-International-Catalogue.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <a href="/documents/ami-catalogue.pdf" onClick={handleClick} className={className}>
      <DownloadIcon />
      {label}
    </a>
  );
}