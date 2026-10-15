import { DIGITS } from "@/lib/stepDigits";

const TRACK = 63; // extra space between digits, in font units
const CLIP = 608; // how much of the first digit is cut off on the left (the design shows half of the 0)
const TOP = 1530;
const HEIGHT = 1550;

// The big orange step number (01, 02, ...). Drawn as SVG so it never depends on a font.
export default function StepNumber({ value }) {
  const chars = String(value).split("").filter((c) => DIGITS[c]);
  let x = 0;
  const parts = chars.map((c, i) => {
    const node = <path key={i} d={DIGITS[c].d} transform={`translate(${x} 0)`} />;
    x += DIGITS[c].w + TRACK;
    return node;
  });
  const width = x - TRACK - CLIP;

  return (
    <span className="pr-digits" dir="ltr" aria-hidden="true">
      <svg className="pr-digits-in" viewBox={`${CLIP} -${TOP} ${width} ${HEIGHT}`} fill="currentColor" focusable="false">
        <g transform="scale(1,-1)">{parts}</g>
      </svg>
    </span>
  );
}
