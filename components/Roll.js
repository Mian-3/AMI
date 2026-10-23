// Text that rolls up on hover while a copy rolls in from below. Pair it with any <a> or <button>;
// the motion is pure CSS (see .hd-roll in globals.css). Pass `tint` when the hover colour is orange.
export default function Roll({ children, tint = false }) {
  return (
    <span className={"hd-roll" + (tint ? " hd-tint" : "")}>
      <span className="a">{children}</span>
      <span className="b" aria-hidden="true">{children}</span>
    </span>
  );
}
