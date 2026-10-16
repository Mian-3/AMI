import ProcessScene from "@/components/ProcessScene";

export default function ProcessHero({ dict }) {
  const t = dict.processPage;
  return (
    <>
      <ProcessScene className="pr-hero" threshold={0.05}>
        <div className="pr-hero-in">
          <p className="pr-eyebrow pr-a" data-from="up" style={{ "--d": "0ms" }}>{t.heroEyebrow}</p>
          <h1 className="pr-h1 pr-a" data-from="up" style={{ "--d": "100ms" }}>{t.heroHeading}</h1>
          <p className="pr-p pr-a" data-from="up" style={{ "--d": "200ms" }}>{t.heroP1}</p>
          <p className="pr-p pr-a" data-from="up" style={{ "--d": "300ms" }}>{t.heroP2}</p>
        </div>
      </ProcessScene>
    </>
  );
}
