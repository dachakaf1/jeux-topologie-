import { useState } from "react";
import { Badge, Card, SectionTitle, Tilt, cx } from "../components/ui";
import { Builder, Continuity, Hausdorff, Neighbourhood, Operators } from "../games/SpaceGames";
import { Intervals, Memory, ProofPuzzle, Quiz, TrueFalse } from "../games/KnowledgeGames";

export const GAMES = [
  { id: "build", n: "Architecte de τ", d: "Construis des topologies selon des objectifs", ico: "⬡", diff: 1, cat: "Construction", C: Builder },
  { id: "ops", n: "Å · Ā · ∂A", d: "Intérieur, adhérence, frontière, accumulation", ico: "◎", diff: 2, cat: "Calcul", C: Operators },
  { id: "neigh", n: "Bon voisin", d: "Reconnaître les voisinages", ico: "◌", diff: 1, cat: "Calcul", C: Neighbourhood },
  { id: "cont", n: "Continuité", d: "f⁻¹(ouvert) est-il ouvert ?", ico: "ƒ", diff: 3, cat: "Applications", C: Continuity },
  { id: "haus", n: "Séparation", d: "T0, T1, Hausdorff", ico: "⊥", diff: 2, cat: "Propriétés", C: Hausdorff },
  { id: "iv", n: "Droite réelle", d: "Ouvert, fermé, ou ni l'un ni l'autre ?", ico: "ℝ", diff: 1, cat: "ℝ usuel", C: Intervals },
  { id: "quiz", n: "QCM Chrono", d: "Contre la montre, jusqu'à 28 questions", ico: "⧗", diff: 2, cat: "Connaissances", C: Quiz },
  { id: "tf", n: "Vrai ou Faux", d: "3 vies, enchaîne les séries", ico: "⊤", diff: 2, cat: "Connaissances", C: TrueFalse },
  { id: "proof", n: "Puzzle de preuves", d: "Remets les démonstrations dans l'ordre", ico: "∎", diff: 3, cat: "Démonstrations", C: ProofPuzzle },
  { id: "mem", n: "Memory", d: "Associe notions et définitions", ico: "❖", diff: 1, cat: "Mémoire", C: Memory },
];

export default function Games() {
  const [g, setG] = useState<number | null>(null);
  if (g !== null) {
    const G = GAMES[g].C;
    return (
      <div>
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button onClick={() => setG(null)} className="text-slate-400 hover:text-white transition">← Tous les jeux</button>
          <div className="flex-1" />
          <div className="flex gap-1 overflow-x-auto max-w-full">
            {GAMES.map((x, i) => (
              <button key={x.id} onClick={() => setG(i)} title={x.n} className={cx("w-10 h-10 rounded-xl text-lg shrink-0 transition-all", i === g ? "bg-gradient-to-br from-violet-400 to-cyan-300 text-slate-900" : "bg-white/5 hover:bg-white/10 text-cyan-200")}>{x.ico}</button>
            ))}
          </div>
        </div>
        <Card key={g} glow className="scale-in"><G /></Card>
      </div>
    );
  }
  return (
    <div>
      <SectionTitle kicker="Arcade" title={<>Dix jeux pour <span className="italic grad-text">penser en ouverts</span></>} sub="Chaque jeu repose sur un vrai moteur de calcul topologique : les exercices sont générés et corrigés automatiquement." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {GAMES.map((x, i) => (
          <Tilt key={x.id}>
            <button onClick={() => setG(i)} className="w-full text-left fade-up h-full" style={{ animationDelay: i * 50 + "ms" }}>
              <Card className="h-full spotlight group !p-5">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl grid place-items-center text-3xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/10 to-cyan-400/20 border border-white/10 text-cyan-100 group-hover:scale-110 group-hover:rotate-6 transition-transform">{x.ico}</div>
                  <span className="text-amber-300 text-xs tracking-widest">{"●".repeat(x.diff)}<span className="text-white/15">{"●".repeat(3 - x.diff)}</span></span>
                </div>
                <div className="font-serif text-2xl mt-4">{x.n}</div>
                <div className="text-sm text-slate-400 mt-1 min-h-[40px]">{x.d}</div>
                <div className="mt-4 flex justify-between items-center"><Badge color="slate">{x.cat}</Badge><span className="text-cyan-300 text-sm opacity-0 group-hover:opacity-100 transition">Jouer ▶</span></div>
              </Card>
            </button>
          </Tilt>
        ))}
      </div>
    </div>
  );
}
