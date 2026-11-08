import { useEffect, useMemo, useState } from "react";
import { ACHIEVEMENTS, useStore, xpFor } from "../lib/store";
import { Badge, Btn, Card, Progress, Ring, SectionTitle, Stat, cx } from "../components/ui";
import ProofPlayer from "../components/ProofPlayer";
import ThreeVisual from "../components/ThreeVisual";
import { EXERCISES, FLASHCARDS, GLOSSARY, type Exo } from "../extra";
import { EXERCISE_SCENE_CONFIG } from "../lib/sceneConfig";
import { shuffle } from "../lib/topo";
import { COURSE } from "../data";

/* ================= Exercices ================= */
function ExerciseCard({ exercise: e, index, onReveal }: { exercise: Exo; index: number; onReveal: (id: string) => void }) {
  const [hint, setHint] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const config = EXERCISE_SCENE_CONFIG[e.id];

  return (
    <article className="lesson-card lesson-example fade-up" style={{ animationDelay: `${Math.min(index * 35, 200)}ms` }}>
      <div className="lesson-card-grid">
        <div className="lesson-copy">
          <div className="exercise-topline">
            <div className="lesson-kind"><span /> Exercice {e.id}</div>
            <span className="exercise-difficulty" aria-label={`Difficulté ${e.level} sur 3`}>{"●".repeat(e.level)}<span>{"●".repeat(3 - e.level)}</span></span>
          </div>
          <h3>{e.title}</h3>
          <p className="lesson-body">{e.statement}</p>
          {hint && <div className="exercise-hint fade-up"><strong>Indice</strong> {e.hint}</div>}
          {!open && (
            <div className="exercise-actions">
              {!hint && <Btn size="sm" v="ghost" onClick={() => setHint(true)}>Voir un indice</Btn>}
              <Btn size="sm" v="outline" onClick={() => { setOpen(true); setStep(1); onReveal(e.id); }}>Voir le corrigé en 3D</Btn>
            </div>
          )}
          {open && (
            <div className="lesson-proof">
              <ProofPlayer steps={e.solution} step={step} setStep={setStep} title="Corrigé guidé" />
              <button type="button" className="proof-hide" onClick={() => setOpen(false)}>Masquer le corrigé</button>
            </div>
          )}
        </div>
        <div className="lesson-visual">
          {config && <ThreeVisual config={config} proofStep={open ? step : 0} proofLength={e.solution.length} />}
        </div>
      </div>
    </article>
  );
}

export function Exercises() {
  const { bump, addXP } = useStore();
  const [lvl, setLvl] = useState<0 | 1 | 2 | 3>(0);
  const [seen, setSeen] = useState<string[]>([]);
  const list = EXERCISES.filter((e) => lvl === 0 || e.level === lvl);
  const reveal = (id: string) => {
    if (!seen.includes(id)) {
      setSeen([...seen, id]);
      bump("exo");
      addXP(5, "Exercices");
    }
  };
  return (
    <div>
      <SectionTitle kicker="Travaux dirigés" title={<>Exercices <span className="italic grad-text">corrigés en 3D</span></>} sub="Cherchez d'abord, puis explorez un modèle et suivez le corrigé étape par étape." />
      <div className="flex gap-2 mb-6">
        {(["Tous", "★", "★★", "★★★"] as const).map((l, i) => <Btn key={l} size="sm" v={lvl === i ? "primary" : "ghost"} onClick={() => setLvl(i as any)}>{l}</Btn>)}
      </div>
      <div className="exercise-list">
        {list.map((exercise, i) => <ExerciseCard key={exercise.id} exercise={exercise} index={i} onReveal={reveal} />)}
      </div>
    </div>
  );
}

/* ================= Flashcards ================= */
export function Flashcards() {
  const { mastered, toggleMastered, addXP } = useStore();
  const [onlyTodo, setOnlyTodo] = useState(false);
  const [deck, setDeck] = useState(() => FLASHCARDS);
  const list = useMemo(() => deck.filter((c) => !onlyTodo || !mastered.includes(c.id)), [deck, onlyTodo, mastered]);
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const c = list[i % Math.max(1, list.length)];
  const next = (d = 1) => { setFlip(false); setTimeout(() => setI((x) => (x + d + list.length) % Math.max(1, list.length)), 150); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); setFlip((f) => !f); }
      if (e.key === "ArrowRight") next(1);
      if (e.key === "ArrowLeft") next(-1);
    };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  });
  return (
    <div>
      <SectionTitle kicker="Révision" title={<>Flash<span className="italic grad-text">cards</span></>} sub="Espace pour retourner la carte, ← → pour naviguer. Marque les cartes maîtrisées." />
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <Btn size="sm" v="ghost" onClick={() => { setDeck(shuffle(FLASHCARDS)); setI(0); }}>⤮ Mélanger</Btn>
        <Btn size="sm" v={onlyTodo ? "primary" : "ghost"} onClick={() => { setOnlyTodo(!onlyTodo); setI(0); }}>{onlyTodo ? "À revoir seulement" : "Toutes les cartes"}</Btn>
        <div className="flex-1" />
        <span className="text-sm text-slate-400">{mastered.length}/{FLASHCARDS.length} maîtrisées</span>
        <Progress value={(mastered.length / FLASHCARDS.length) * 100} className="w-40" />
      </div>
      {!c ? <Card className="text-center py-20"><div className="text-5xl">🎉</div><div className="font-serif text-3xl mt-3">Toutes les cartes sont maîtrisées !</div></Card> : (
        <div className="max-w-2xl mx-auto">
          <button className="flip-card w-full aspect-[16/10]" onClick={() => setFlip(!flip)}>
            <div className={cx("flip-inner", flip && "flipped")}>
              <div className="flip-face glass-strong rounded-[32px] p-10 flex flex-col items-center justify-center glow-border">
                <Badge color="violet">{c.tag}</Badge>
                <div className="font-serif text-4xl md:text-5xl mt-6 text-center">{c.front}</div>
                <div className="text-xs text-slate-500 mt-8">Cliquer pour retourner</div>
              </div>
              <div className="flip-face flip-back rounded-[32px] p-10 flex flex-col items-center justify-center bg-gradient-to-br from-violet-600/25 via-[#12122a] to-cyan-500/15 border border-cyan-300/30">
                <div className="text-xs uppercase tracking-widest text-cyan-300">{c.front}</div>
                <div className="font-serif text-2xl md:text-3xl mt-5 text-center leading-relaxed">{c.back}</div>
              </div>
            </div>
          </button>
          <div className="flex justify-between items-center mt-6">
            <Btn v="ghost" onClick={() => next(-1)}>←</Btn>
            <span className="font-mono text-sm text-slate-500">{(i % list.length) + 1} / {list.length}</span>
            <div className="flex gap-2">
              <Btn v={mastered.includes(c.id) ? "success" : "outline"} onClick={() => { if (!mastered.includes(c.id)) addXP(3, "Flashcards"); toggleMastered(c.id); next(1); }}>{mastered.includes(c.id) ? "✓ Maîtrisée" : "Je la connais"}</Btn>
              <Btn v="ghost" onClick={() => next(1)}>→</Btn>
            </div>
          </div>
        </div>
      )}
      <h3 className="font-serif text-3xl mt-16 mb-5">Glossaire</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {GLOSSARY.map(([t, d]) => <div key={t} className="glass rounded-2xl p-4 hover-lift"><div className="font-serif text-xl grad-text">{t}</div><div className="text-sm text-slate-400 mt-1">{d}</div></div>)}
      </div>
    </div>
  );
}

/* ================= Profil ================= */
export function Profile() {
  const st = useStore();
  const next = xpFor(st.level + 1), cur = xpFor(st.level);
  const bySrc = st.history.reduce<Record<string, number>>((m, h) => ({ ...m, [h.src]: (m[h.src] || 0) + h.xp }), {});
  const max = Math.max(1, ...Object.values(bySrc));
  const titles = ["Novice", "Étudiant", "Apprenti", "Analyste", "Topologue", "Expert", "Chercheur", "Professeur", "Maître", "Légende"];
  return (
    <div>
      <SectionTitle kicker="Profil" title={<>Ta <span className="italic grad-text">progression</span></>} />
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <Card glow className="flex flex-col items-center text-center">
          <Ring value={((st.xp - cur) / (next - cur)) * 100} size={190} stroke={12}>
            <div><div className="text-xs text-slate-500 uppercase tracking-widest">Niveau</div><div className="font-serif text-6xl grad-text">{st.level}</div></div>
          </Ring>
          <div className="font-serif text-3xl mt-4">{titles[Math.min(titles.length - 1, st.level - 1)]}</div>
          <div className="font-mono text-sm text-slate-400 mt-1">{st.xp} XP · encore {next - st.xp} pour le niveau {st.level + 1}</div>
          <Btn v="danger" size="sm" className="mt-6" onClick={() => confirm("Réinitialiser toute la progression ?") && st.reset()}>Réinitialiser</Btn>
        </Card>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="XP total" value={st.xp} />
            <Stat label="Succès" value={`${st.unlocked.length}/${ACHIEVEMENTS.length}`} />
            <Stat label="Sections lues" value={`${st.read.length}/${COURSE.length}`} />
            <Stat label="Cartes maîtrisées" value={st.mastered.length} />
          </div>
          <Card>
            <div className="font-serif text-2xl mb-4">XP par activité</div>
            {Object.keys(bySrc).length === 0 ? <div className="text-slate-500">Joue pour voir tes statistiques.</div> :
              <div className="space-y-3">{Object.entries(bySrc).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3"><span className="w-32 text-sm text-slate-300">{k}</span><Progress value={(v / max) * 100} className="flex-1 h-2.5" /><span className="font-mono text-sm text-cyan-200 w-14 text-right">{v}</span></div>
              ))}</div>}
          </Card>
        </div>
      </div>
      <h3 className="font-serif text-3xl mt-12 mb-5">Succès</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const on = st.unlocked.includes(a.id);
          return (
            <div key={a.id} className={cx("rounded-2xl p-4 flex gap-4 items-center border transition-all", on ? "bg-gradient-to-r from-amber-400/10 to-transparent border-amber-300/30" : "bg-white/[0.02] border-white/5 opacity-50 grayscale")}>
              <div className={cx("w-12 h-12 rounded-2xl grid place-items-center text-2xl shrink-0", on ? "bg-gradient-to-br from-amber-300 to-orange-500 text-slate-900 shadow-lg shadow-amber-500/30" : "bg-white/5")}>{on ? a.icon : "🔒"}</div>
              <div><div className="font-medium">{a.name}</div><div className="text-xs text-slate-400">{a.desc}</div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
