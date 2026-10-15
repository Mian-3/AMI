import ProcessScene from "@/components/ProcessScene";
import ProcessMedia from "@/components/ProcessMedia";
import StepNumber from "@/components/StepNumber";

export default function ProcessSteps({ dict }) {
  const t = dict.processPage;

  return (
    <section className="pr-steps" aria-label={t.heroEyebrow}>
      {t.steps.map((step, i) => {
        const side = i % 2 === 0 ? "a" : "b";
        const from = side === "a" ? "start" : "end";
        const mediaFrom = side === "a" ? "end" : "start";
        const number = String(i + 1).padStart(2, "0");
        return (
          <ProcessScene key={i} className="pr-row" data-side={side} threshold={0.25}>
            <div className="pr-text">
              <div className="pr-num" aria-hidden="true">
                <span className="pr-step pr-a" data-from="up" style={{ "--d": "100ms" }}>{t.stepLabel}</span>
                <StepNumber value={number} />
              </div>
              <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                {t.stepLabel} {i + 1}
              </span>
              <h2 className="pr-title pr-a" data-from={from} style={{ "--d": "150ms" }}>{step.title}</h2>
              <p className="pr-sub pr-a" data-from="up" style={{ "--d": "250ms" }}>{step.subtitle}</p>
              <p className="pr-focus pr-a" data-from="up" style={{ "--d": "320ms" }}>{t.focusLabel}</p>
              <ul className="pr-list">
                {step.focus.map((item, n) => (
                  <li key={n} className="pr-a" data-from="up" style={{ "--d": `${400 + n * 100}ms` }}>{item}</li>
                ))}
              </ul>
              <div className="pr-outcome">
                <span className="pr-outcome-bar pr-bar" style={{ "--d": "820ms" }} />
                <p className="pr-a" data-from="up" style={{ "--d": "900ms" }}>
                  <b>{t.outcomeLabel}</b> {step.outcome}
                </p>
              </div>
            </div>

            <div className="pr-mediawrap pr-a" data-from={mediaFrom} style={{ "--d": "200ms" }}>
              <ProcessMedia image={step.image} video={step.video} playLabel={t.playLabel} title={step.title} />
            </div>
          </ProcessScene>
        );
      })}
    </section>
  );
}
