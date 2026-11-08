import { useEffect, useMemo, useState } from "react";
import { Badge, Btn, Feedback, Progress, Ring, cx } from "../components/ui";
import { COURSE } from "../data";
import { MEMORY_PAIRS, QUIZ, TF } from "../extra";
import { useStore } from "../lib/store";
import { ivName, ivNature, shuffle, type Interval } from "../lib/topo";
import { GameHeader } from "./SpaceGames";

/* ================= QCM chrono ================= */
export function Quiz() {
  const { addXP, unlock } = useStore();
  const [len, setLen] = useState(12);
  const [qs, setQs] = useState(() => shuffle(QUIZ).slice(0, 12));
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [good, setGood] = useState(0);
  const [time, setTime] = useState(20);
  const [started, setStarted] = useState(false);
  const q = qs[i];
  useEffect(() => {
    if (!started || pick !== null || !q) return;
    if (time <= 0) { setPick(-1); return; }
    const t = setTimeout(() => setTime((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [time, pick, q, started]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (!started || !q) return;
      const n = "1234".indexOf(e.key);
      if (n >= 0 && pick === null) choose(n);
      if (e.key === "Enter" && pick !== null) next();
    };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  });
  const restart = (n = len) => { setLen(n); setQs(shuffle(QUIZ).slice(0, n)); setI(0); setGood(0); setPick(null); setTime(20); setStarted(true); };
  const choose = (k: number) => { if (pick !== null) return; setPick(k); if (k === q.a) { setGood((g) => g + 1); addXP(8 + Math.ceil(time / 2), "QCM"); } };
  const next = () => { setI(i + 1); setPick(null); setTime(20); };
  if (!started)
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4 float">⧗</div>
        <h3 className="font-serif text-4xl">QCM Chrono</h3>
        <p className="text-slate-400 mt-2">{QUIZ.length} questions dans la banque · 20 s par question · touches 1-4 et Entrée</p>
        <div className="flex justify-center gap-3 mt-8">{[8, 12, 20].map((n) => <Btn key={n} v={n === 12 ? "primary" : "ghost"} size="lg" onClick={() => restart(n)}>{n} questions</Btn>)}</div>
      </div>
    );
  if (!q) {
    const pct = Math.round((good / qs.length) * 100);
    if (good >= 10) unlock("quiz10");
    return (
      <div className="text-center py-8 flex flex-col items-center">
        <Ring value={pct} size={180} stroke={12}><div><div className="font-serif text-5xl grad-text">{good}/{qs.length}</div><div className="text-xs text-slate-500">{pct}%</div></div></Ring>
        <p className="mt-5 font-serif text-2xl">{pct >= 85 ? "Maîtrise remarquable 🏆" : pct >= 60 ? "Très bon travail !" : "Revois le cours et retente ta chance."}</p>
        <div className="flex gap-3 mt-6"><Btn onClick={() => restart()}>Rejouer</Btn><Btn v="ghost" onClick={() => setStarted(false)}>Changer de format</Btn></div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center text-sm text-slate-400">
        <span>Question <b className="text-white">{i + 1}</b> / {qs.length}</span>
        <span className={cx("font-mono text-lg", time <= 5 ? "text-rose-300 animate-pulse" : "text-cyan-200")}>{time}s</span>
        <span>Score <b className="text-emerald-300">{good}</b></span>
      </div>
      <Progress value={time * 5} className="mt-3 h-2" color={time > 10 ? "from-emerald-400 to-cyan-300" : time > 5 ? "from-amber-300 to-orange-400" : "from-rose-500 to-rose-300"} />
      <div className="flex gap-1 mt-2">{qs.map((_, k) => <div key={k} className={cx("h-1 flex-1 rounded-full", k < i ? "bg-violet-400" : k === i ? "bg-cyan-300" : "bg-white/10")} />)}</div>
      <h3 className="font-serif text-3xl mt-8 fade-up" key={i}>{q.q}</h3>
      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {q.choices.map((c, k) => (
          <button key={k} onClick={() => choose(k)}
            className={cx("group p-4 rounded-2xl text-left transition-all border flex gap-3 items-center fade-up",
              pick === null ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:-translate-y-0.5 hover:border-violet-400/40" : k === q.a ? "border-emerald-400 bg-emerald-500/15" : k === pick ? "border-rose-400 bg-rose-500/15 shake" : "border-white/5 opacity-40")}
            style={{ animationDelay: k * 60 + "ms" }}>
            <span className="w-8 h-8 rounded-lg grid place-items-center bg-white/5 font-mono text-cyan-300 group-hover:bg-violet-500/30">{k + 1}</span>
            <span>{c}</span>
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <Feedback ok={pick === q.a}>{pick === -1 && "⏱ Temps écoulé. "}{q.why}</Feedback>
          <Btn onClick={next}>Suivant ↵</Btn>
        </div>
      )}
    </div>
  );
}

/* ================= Vrai/Faux ================= */
export function TrueFalse() {
  const { addXP, unlock } = useStore();
  const [list, setList] = useState(() => shuffle(TF));
  const [i, setI] = useState(0);
  const [res, setRes] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(3);
  const s = list[i % list.length];
  const go = (v: boolean) => {
    if (res !== null || lives <= 0) return;
    const ok = v === s.v; setRes(ok);
    if (ok) { const n = streak + 1; setStreak(n); setBest(Math.max(best, n)); addXP(5 + Math.min(streak, 10) * 2, "Vrai/Faux"); if (n >= 5) unlock("streak5"); if (n >= 10) unlock("streak10"); }
    else { setStreak(0); setLives(lives - 1); }
  };
  const next = () => { if ((i + 1) % list.length === 0) setList(shuffle(TF)); setI(i + 1); setRes(null); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "ArrowLeft") go(true); if (e.key === "ArrowRight") go(false); if (e.key === "Enter" && res !== null) next(); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  });
  if (lives <= 0 && res === null)
    return (
      <div className="text-center py-12">
        <div className="font-serif text-5xl">Partie terminée</div>
        <p className="text-slate-400 mt-3">Meilleure série : <b className="text-amber-300 text-2xl">{best}</b></p>
        <Btn className="mt-6" onClick={() => { setLives(3); setStreak(0); setBest(0); setList(shuffle(TF)); setI(0); }}>Rejouer</Btn>
      </div>
    );
  return (
    <div className="text-center py-2">
      <div className="flex justify-between items-center">
        <div className="text-2xl">{"❤️".repeat(lives)}<span className="opacity-20">{"❤️".repeat(3 - lives)}</span></div>
        <Badge color="amber">🔥 série {streak} · record {best}</Badge>
      </div>
      <div key={i} className={cx("scale-in mx-auto mt-10 max-w-2xl rounded-[32px] p-10 border transition-colors duration-500", res === null ? "border-white/10 bg-white/[0.03]" : res ? "border-emerald-400/50 bg-emerald-500/10" : "border-rose-400/50 bg-rose-500/10")}>
        <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Affirmation #{i + 1}</div>
        <div className="font-serif text-3xl md:text-4xl mt-4 leading-snug">« {s.s} »</div>
        {res !== null && <p className={cx("mt-6 fade-up", res ? "text-emerald-200" : "text-rose-200")}>{res ? "✓ Correct" : `✗ C'était ${s.v ? "VRAI" : "FAUX"}`} — {s.why}</p>}
      </div>
      {res === null ? (
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => go(true)} className="w-40 py-5 rounded-3xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-100 text-2xl font-serif hover:bg-emerald-500/25 hover:-translate-y-1 transition-all">Vrai <span className="text-xs opacity-50">←</span></button>
          <button onClick={() => go(false)} className="w-40 py-5 rounded-3xl bg-rose-500/15 border border-rose-400/40 text-rose-100 text-2xl font-serif hover:bg-rose-500/25 hover:-translate-y-1 transition-all">Faux <span className="text-xs opacity-50">→</span></button>
        </div>
      ) : <Btn className="mt-8" onClick={next}>Suivant ↵</Btn>}
    </div>
  );
}

/* ================= Puzzle de preuves ================= */
const PROOFS = COURSE.flatMap((c) => c.items.filter((x) => x.proof));
export function ProofPuzzle() {
  const { addXP, bump } = useStore();
  const [k, setK] = useState(0);
  const pr = PROOFS[k % PROOFS.length];
  const pool = useMemo(() => shuffle(pr.proof!.map((t, i) => ({ t, i }))), [k]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [err, setErr] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const done = chosen.length === pr.proof!.length;
  const pickStep = (i: number) => {
    if (i === chosen.length) {
      const n = [...chosen, i]; setChosen(n); setErr(null);
      if (n.length === pr.proof!.length) { addXP(Math.max(10, 35 - mistakes * 5), "Preuves"); bump("proof"); }
    } else { setErr(i); setMistakes(mistakes + 1); setTimeout(() => setErr(null), 500); }
  };
  const go = (n: number) => { setK(n); setChosen([]); setMistakes(0); };
  return (
    <div>
      <GameHeader title="Puzzle de démonstrations" sub="Clique sur les étapes dans l'ordre logique pour reconstruire la preuve."
        right={<><Badge color="rose">{mistakes} erreur(s)</Badge><Badge color="cyan">{(k % PROOFS.length) + 1}/{PROOFS.length}</Badge></>} />
      <div className="rounded-2xl p-5 bg-gradient-to-r from-violet-500/10 to-transparent border-l-4 border-violet-400">
        <div className="text-violet-300 text-xs uppercase tracking-widest">{pr.kind} — {pr.title}</div>
        <div className="font-serif text-2xl mt-1">{pr.body}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Étapes disponibles</div>
          <div className="space-y-2">
            {pool.filter((s) => !chosen.includes(s.i)).map((s) => (
              <button key={s.i} onClick={() => pickStep(s.i)}
                className={cx("w-full text-left p-3.5 rounded-xl border transition-all text-[15px]", err === s.i ? "border-rose-400 bg-rose-500/20 shake" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:translate-x-1 hover:border-violet-400/40")}>{s.t}</button>
            ))}
            {done && <div className="scale-in rounded-2xl p-6 text-center bg-emerald-500/10 border border-emerald-400/30"><div className="text-4xl">∎</div><div className="text-emerald-200 mt-1">Démonstration reconstruite !</div></div>}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Ta démonstration</div>
          <div className="space-y-2 rounded-2xl p-4 bg-black/25 border border-violet-400/20 min-h-[200px]">
            {chosen.length === 0 && <div className="text-slate-600 italic">Démonstration.</div>}
            {chosen.map((i, n) => <div key={i} className="fade-up flex gap-3"><span className="text-cyan-300 font-mono">{n + 1}.</span><span>{pr.proof![i]}</span></div>)}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <Btn v="ghost" onClick={() => go(k - 1 + PROOFS.length)}>← Précédente</Btn>
        <Btn v={done ? "primary" : "ghost"} onClick={() => go(k + 1)}>Suivante →</Btn>
      </div>
    </div>
  );
}

/* ================= Memory ================= */
export function Memory() {
  const { addXP, unlock } = useStore();
  const build = () => shuffle(MEMORY_PAIRS.flatMap(([a, b], i) => [{ id: i * 2, pair: i, t: a, sym: true }, { id: i * 2 + 1, pair: i, t: b, sym: false }]));
  const [cards, setCards] = useState(build);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const flip = (idx: number) => {
    if (open.length === 2 || open.includes(idx) || found.includes(cards[idx].pair)) return;
    const o = [...open, idx]; setOpen(o);
    if (o.length === 2) {
      setMoves(moves + 1);
      const [x, y] = o.map((j) => cards[j]);
      setTimeout(() => {
        if (x.pair === y.pair) {
          const f = [...found, x.pair]; setFound(f); addXP(6, "Memory");
          if (f.length === MEMORY_PAIRS.length) { unlock("memory"); addXP(Math.max(10, 50 - moves * 2), "Memory"); }
        }
        setOpen([]);
      }, 750);
    }
  };
  const won = found.length === MEMORY_PAIRS.length;
  return (
    <div>
      <GameHeader title="Memory topologique" sub="Associe chaque notion à sa définition."
        right={<><Badge color="slate">{moves} coups</Badge><Badge color="emerald">{found.length}/{MEMORY_PAIRS.length}</Badge><Btn size="sm" v="ghost" onClick={() => { setCards(build()); setFound([]); setOpen([]); setMoves(0); }}>↻</Btn></>} />
      <div className="grid grid-cols-4 gap-3">
        {cards.map((c, idx) => {
          const shown = open.includes(idx) || found.includes(c.pair);
          return (
            <button key={c.id} onClick={() => flip(idx)} className="flip-card aspect-[4/3]">
              <div className={cx("flip-inner", shown && "flipped")}>
                <div className="flip-face rounded-2xl bg-gradient-to-br from-violet-600/30 to-cyan-500/10 border border-white/10 grid place-items-center">
                  <span className="font-serif text-3xl text-white/30">τ</span>
                </div>
                <div className={cx("flip-face flip-back rounded-2xl border grid place-items-center p-2 text-center", found.includes(c.pair) ? "bg-emerald-500/15 border-emerald-400/40" : "bg-white/10 border-violet-300/40")}>
                  <span className={c.sym ? "font-serif text-2xl md:text-3xl" : "text-xs md:text-sm"}>{c.t}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {won && <Feedback ok>Bravo ! Terminé en {moves} coups.</Feedback>}
    </div>
  );
}

/* ================= Intervalles de ℝ ================= */
const NATURES = ["ouvert", "fermé", "ni ouvert ni fermé", "ouvert et fermé"] as const;
function genInterval(): Interval {
  const r = Math.random();
  if (r < 0.06) return { a: -Infinity, b: Infinity, lc: false, rc: false };
  const a = Math.floor(Math.random() * 9) - 4, b = a + 1 + Math.floor(Math.random() * 4);
  if (r < 0.2) return { a: -Infinity, b, lc: false, rc: Math.random() < 0.5 };
  if (r < 0.34) return { a, b: Infinity, lc: Math.random() < 0.5, rc: false };
  return { a, b, lc: Math.random() < 0.5, rc: Math.random() < 0.5 };
}
export function Intervals() {
  const { addXP, bump } = useStore();
  const [I, setI] = useState(genInterval);
  const [ans, setAns] = useState<string | null>(null);
  const [score, setScore] = useState({ g: 0, n: 0 });
  const truth = ivNature(I);
  const go = (n: string) => { if (ans) return; setAns(n); const ok = n === truth; setScore({ g: score.g + (ok ? 1 : 0), n: score.n + 1 }); if (ok) { addXP(6, "Intervalles"); bump("interval"); } };
  const X = (v: number) => (v === -Infinity ? 20 : v === Infinity ? 580 : 300 + v * 40);
  return (
    <div>
      <GameHeader title="La droite réelle" sub="Dans (ℝ, τu), quelle est la nature de cet ensemble ?" right={<Badge color="emerald">{score.g}/{score.n}</Badge>} />
      <svg viewBox="0 0 600 120" className="w-full">
        <line x1="10" y1="60" x2="590" y2="60" stroke="#475569" strokeWidth="2" />
        {Array.from({ length: 13 }, (_, k) => k - 6).map((k) => <g key={k}><line x1={300 + k * 40} y1="54" x2={300 + k * 40} y2="66" stroke="#475569" /><text x={300 + k * 40} y="90" textAnchor="middle" fontSize="12" fill="#64748b">{k}</text></g>)}
        <line key={ivName(I)} x1={X(I.a)} y1="60" x2={X(I.b)} y2="60" stroke="url(#ivg)" strokeWidth="7" strokeLinecap="round" className="draw-path" />
        <defs><linearGradient id="ivg"><stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#22d3ee" /></linearGradient></defs>
        {I.a !== -Infinity && <circle cx={X(I.a)} cy="60" r="8" fill={I.lc ? "#a78bfa" : "#0b0b1a"} stroke="#a78bfa" strokeWidth="3" />}
        {I.b !== Infinity && <circle cx={X(I.b)} cy="60" r="8" fill={I.rc ? "#22d3ee" : "#0b0b1a"} stroke="#22d3ee" strokeWidth="3" />}
        {I.a === -Infinity && <text x="14" y="45" fill="#a78bfa">←</text>}
        {I.b === Infinity && <text x="574" y="45" fill="#22d3ee">→</text>}
      </svg>
      <div className="text-center font-serif text-5xl mt-2">{ivName(I)}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
        {NATURES.map((n) => (
          <button key={n} onClick={() => go(n)} className={cx("p-4 rounded-2xl border transition-all capitalize", !ans ? "border-white/10 bg-white/[0.04] hover:bg-white/10 hover:-translate-y-0.5" : n === truth ? "border-emerald-400 bg-emerald-500/15" : n === ans ? "border-rose-400 bg-rose-500/15 shake" : "opacity-40 border-white/5")}>{n}</button>
        ))}
      </div>
      {ans && (
        <div className="flex items-end justify-between flex-wrap gap-3">
          <Feedback ok={ans === truth}>
            {truth === "ouvert et fermé" ? "ℝ est à la fois ouvert et fermé." : truth === "ouvert" ? "Aucune borne finie n'est incluse : c'est une réunion d'intervalles ]a,b[." : truth === "fermé" ? "Son complémentaire est une réunion d'intervalles ouverts." : "Une borne est incluse et l'autre non : ni ouvert (borne incluse) ni fermé (borne manquante adhérente)."}
          </Feedback>
          <Btn onClick={() => { setI(genInterval()); setAns(null); }}>Suivant →</Btn>
        </div>
      )}
    </div>
  );
}
