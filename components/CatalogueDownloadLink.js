"use client";

const PDF_URL = "/documents/ami-catalogue.pdf";
const FILE_NAME = "AM-International-Catalogue.pdf";

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

export default function CatalogueDownloadLink({ label, className = "", icon = "download" }) {
  function handleClick(e) {
    e.preventDefault();
    window.open(PDF_URL, "_blank", "noopener,noreferrer");
    const a = document.createElement("a");
    a.href = PDF_URL;
    a.download = FILE_NAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <a href={PDF_URL} onClick={handleClick} className={className}>
      {icon === "download" && <DownloadIcon />}
      {icon === "doc" && <DocIcon />}
      <span>{label}</span>
    </a>
  );
}