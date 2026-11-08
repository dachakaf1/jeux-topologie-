import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Progress, cx } from "./ui";

export default function ProofPlayer({
  steps, step, setStep, title = "Démonstration",
}: {
  steps: string[];
  step: number;
  setStep: (n: number) => void;
  title?: string;
}) {
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto || step >= steps.length) return;
    const timer = window.setTimeout(() => setStep(step + 1), 2600);
    return () => window.clearTimeout(timer);
  }, [auto, step, steps.length, setStep]);

  useEffect(() => {
    if (step >= steps.length) setAuto(false);
  }, [step, steps.length]);

  return (
    <div className="proof-player">
      <div className="proof-player-heading">
        <div>
          <span className="proof-eyebrow">RAISONNEMENT PAS À PAS</span>
          <h4>{title}</h4>
        </div>
        <span className="proof-counter">{String(step).padStart(2, "0")} <span>/</span> {String(steps.length).padStart(2, "0")}</span>
      </div>
      <Progress value={(step / steps.length) * 100} className="proof-progress" />
      <ol className="proof-steps" aria-label={`Étapes : ${title}`}>
        {steps.slice(0, step).map((text, index) => (
          <li key={index} className={cx("proof-step fade-up", index === step - 1 && "proof-step-active")}>
            <span className="proof-number">{String(index + 1).padStart(2, "0")}</span>
            <p>{text}</p>
          </li>
        ))}
      </ol>
      <div className="proof-actions">
        <button type="button" onClick={() => { setAuto(false); setStep(Math.max(1, step - 1)); }} disabled={step === 1} aria-label="Étape précédente"><ArrowLeft size={15} /></button>
        {step < steps.length ? (
          <button type="button" className="proof-next" onClick={() => { setAuto(false); setStep(step + 1); }}>Étape suivante <ArrowRight size={15} /></button>
        ) : <span className="proof-complete"><Check size={15} /> C.Q.F.D.</span>}
        {step < steps.length && <button type="button" onClick={() => setAuto(!auto)}>{auto ? "Pause" : "Lecture auto"}</button>}
        <button type="button" onClick={() => { setAuto(false); setStep(steps.length); }}>Tout afficher</button>
        <button type="button" onClick={() => { setAuto(false); setStep(1); }} aria-label="Recommencer">↺</button>
      </div>
      <p className="proof-disclaimer">Le modèle illustre un exemple ; le raisonnement écrit fait foi.</p>
    </div>
  );
}