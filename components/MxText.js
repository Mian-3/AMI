// Heading or paragraph whose words rise out of a mask. Works inside a <Mx> scope. No hooks, so it can be
// used from server components.
export default function MxText({ as: Tag = "h2", className = "", delay = 0, children }) {
  const words = String(children ?? "").split(/\s+/).filter(Boolean);
  return (
    <Tag className={className} style={{ "--d": `${delay}ms` }} aria-label={words.join(" ")}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          {i > 0 ? " " : null}
          <span className="mx-w">
            <span className="mx-wi" style={{ "--i": i }}>{w}</span>
          </span>
        </span>
      ))}
    </Tag>
  );
}
