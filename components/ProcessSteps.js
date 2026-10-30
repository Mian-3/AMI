import ProcessScene from "@/components/ProcessScene";
import ProcessMedia from "@/components/ProcessMedia";
import StepNumber from "@/components/StepNumber";
import { getItemLayout } from "@/lib/itemLayoutServer";
import { arrange, partShown } from "@/lib/itemLayout";

export default async function ProcessSteps({ dict }) {
  const t = dict.processPage;
  const IL = await getItemLayout();
  // Visible steps only (hidden, deleted and empty spare steps are skipped). Numbers and left/right sides
  // follow the visible order, so removing a step re-flows the page.
  const visible = arrange(IL, "process.steps", t.steps).filter(({ item }) => String(item.title || "").trim());
  const part = (orig, k) => partShown(IL, "process.parts", orig * 4 + k);

  return (
    <section className="pr-steps" aria-label={t.heroEyebrow}>
      {visible.map(({ item: step, i: orig }, i) => {
        const side = i % 2 === 0 ? "a" : "b";
        const from = side === "a" ? "start" : "end";
        const mediaFrom = side === "a" ? "end" : "start";
        const number = String(i + 1).padStart(2, "0");
        return (
          <ProcessScene key={orig} className="pr-row" data-side={side} data-nomedia={part(orig, 3) ? undefined : "1"} threshold={0.25}>
            <div className="pr-text">
              <div className="pr-num" aria-hidden="true">
                <span className="pr-step pr-a" data-from="up" style={{ "--d": "100ms" }}>{t.stepLabel}</span>
                <StepNumber value={number} />
              </div>
              <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                {t.stepLabel} {i + 1}
              </span>
              <h2 className="pr-title pr-a" data-from={from} style={{ "--d": "150ms" }}>{step.title}</h2>
              {part(orig, 0) && step.subtitle ? <p className="pr-sub pr-a" data-from="up" style={{ "--d": "250ms" }}>{step.subtitle}</p> : null}
              {part(orig, 1) && step.focus?.length ? (
                <>
                  <p className="pr-focus pr-a" data-from="up" style={{ "--d": "320ms" }}>{t.focusLabel}</p>
                  <ul className="pr-list">
                    {step.focus.map((item, n) => (
                      <li key={n} className="pr-a" data-from="up" style={{ "--d": `${400 + n * 100}ms` }}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {part(orig, 2) && step.outcome ? (
                <div className="pr-outcome">
                  <span className="pr-outcome-bar pr-bar" style={{ "--d": "820ms" }} />
                  <p className="pr-a" data-from="up" style={{ "--d": "900ms" }}>
                    <b>{t.outcomeLabel}</b> {step.outcome}
                  </p>
                </div>
              ) : null}
            </div>

            {part(orig, 3) ? (
              <div className="pr-mediawrap pr-a" data-from={mediaFrom} style={{ "--d": "200ms" }}>
                <ProcessMedia image={step.image} video={step.video} playLabel={t.playLabel} title={step.title} />
              </div>
            ) : null}
          </ProcessScene>
        );
      })}
    </section>
  );
}
