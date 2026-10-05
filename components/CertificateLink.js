"use client";

export default function CertificateLink({ pdfSrc, downloadName, children, className }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.open(pdfSrc, "_blank", "noopener,noreferrer");
    const link = document.createElement("a");
    link.href = pdfSrc;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <a href={pdfSrc} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}