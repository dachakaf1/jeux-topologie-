import { useMemo, useState } from "react";
import { Badge, Btn, Feedback, cx } from "../components/ui";
import { MapView, SpaceView, TopoText } from "../components/Visuals";
import { useStore } from "../lib/store";
import {
  ALL_TOPOS, FULL, PTS, accumulation, boundary, closedSets, closure, continuityFail, has, hausdorffWitness, interior,
  isBijective, isContinuous, isHausdorff, isHomeo, isT0, isT1, isolated, minOpen, preimage, rand, setName, topoError,
} from "../lib/topo";

const GameHeader = ({ title, sub, right }: any) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
    <div><h3 className="font-serif text-3xl">{title}</h3><p className="text-slate-400 text-sm mt-1">{sub}</p></div>
    <div className="flex gap-2">{right}</div>
  </div>
);
export { GameHeader };

/* ================= 1. Architecte de τ ================= */
const TARGETS = [
  { goal: "Construis une topologie à exactement 3 ouverts", ok: (t: number[]) => t.length === 3, hint: "Une chaîne ∅ ⊂ U ⊂ E." },
  { goal: "Construis une topologie à exactement 4 ouverts", ok: (t: number[]) => t.length === 4, hint: "Essaie ∅ ⊂ {a} ⊂ {a,b} ⊂ E." },
  { goal: "Une topologie où {a} est ouvert mais {b} ne l'est pas", ok: (t: number[]) => t.includes(1) && !t.includes(2), hint: "" },
  { goal: "Une topologie où {a} et {b} sont ouverts, mais {c} ne l'est pas", ok: (t: number[]) => t.includes(1) && t.includes(2) && !t.includes(4), hint: "N'oublie pas {a,b} = {a} ∪ {b}." },
  { goal: "Une topologie où {c} est à la fois ouvert et fermé", ok: (t: number[]) => t.includes(4) && t.includes(3), hint: "{c}ᶜ = {a,b} doit aussi être ouvert." },
  { goal: "Une topologie T0 mais non T1", ok: (t: number[]) => isT0(t) && !isT1(t), hint: "Une chaîne ∅ ⊂ {a} ⊂ {a,b} ⊂ E distingue tous les points." },
  { goal: "Une topologie à 5 ouverts", ok: (t: number[]) => t.length === 5, hint: "{a}, {b}, {a,b}, plus ∅ et E." },
  { goal: "Une topologie à 6 ouverts", ok: (t: number[]) => t.length === 6, hint: "" },
  { goal: "La topologie discrète", ok: (t: number[]) => t.length === 8, hint: "Toutes les parties !" },
  { goal: "Une topologie séparée (Hausdorff)", ok: (t: number[]) => isHausdorff(t), hint: "Sur un ensemble fini, séparé ⇔ discret." },
];
export function Builder() {
  const { addXP, bump, unlock } = useStore();
  const [sel, setSel] = useState<number[]>([0, FULL]);
  const [lvl, setLvl] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [solved, setSolved] = useState<number[]>([]);
  const T = TARGETS[lvl];
  const toggle = (m: number) => { setMsg(null); setSel((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m].sort((a, b) => a - b))); };
  const err = topoError(sel);
  const check = () => {
    if (err) return setMsg({ ok: false, t: "Ce n'est pas une topologie : " + err });
    if (!T.ok(sel)) return setMsg({ ok: false, t: "C'est bien une topologie, mais l'objectif n'est pas atteint. " + T.hint });
    setMsg({ ok: true, t: "Parfait ! Topologie valide qui remplit l'objectif." });
    if (!solved.includes(lvl)) { setSolved([...solved, lvl]); addXP(20 + lvl * 3, "Architecte"); bump("builder"); }
    if (sel.length === 8) unlock("discrete");
  };
  return (
    <div>
      <GameHeader title="Architecte de τ" sub="Sélectionne des parties de E = {a,b,c} pour former une topologie qui remplit l'objectif."
        right={<Badge color="cyan">{solved.length}/{TARGETS.length} niveaux</Badge>} />
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {TARGETS.map((_, i) => (
          <button key={i} onClick={() => { setLvl(i); setSel([0, FULL]); setMsg(null); }}
            className={cx("w-9 h-9 rounded-xl text-sm font-mono transition-all", i === lvl ? "bg-gradient-to-br from-violet-400 to-cyan-300 text-slate-900 scale-110" : solved.includes(i) ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30" : "bg-white/5 hover:bg-white/10")}>{i + 1}</button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="rounded-2xl p-4 bg-gradient-to-r from-violet-500/10 to-cyan-500/5 border border-violet-400/20">
            <div className="text-xs uppercase tracking-widest text-violet-300">Objectif {lvl + 1}</div>
            <div className="font-serif text-2xl mt-1">{T.goal}</div>
          </div>
          <div className="grid grid-cols-4 gap-2.5 mt-5">
            {Array.from({ length: 8 }, (_, m) => {
              const on = sel.includes(m);
              return (
                <button key={m} onClick={() => toggle(m)}
                  className={cx("py-3.5 rounded-2xl font-mono text-sm transition-all duration-300 border", on ? "bg-gradient-to-br from-violet-500/70 to-fuchsia-500/50 border-violet-300/60 text-white shadow-lg shadow-violet-500/30 -translate-y-0.5" : "bg-white/[0.03] border-white/10 hover:bg-white/10")}>
                  {setName(m)}
                </button>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-black/20 border border-white/5"><TopoText t={sel} /></div>
          <div className="mt-2 text-xs flex items-center gap-2">
            <span className={cx("w-2 h-2 rounded-full", err ? "bg-rose-400" : "bg-emerald-400")} />
            <span className={err ? "text-rose-300" : "text-emerald-300"}>{err ? "Axiomes non vérifiés" : `Topologie valide · ${isT0(sel) ? "T0" : "non T0"} · ${isT1(sel) ? "T1" : "non T1"}`}</span>
          </div>
          <div className="flex gap-2 mt-5">
            <Btn onClick={check}>Vérifier</Btn>
            <Btn v="ghost" onClick={() => { setSel([0, FULL]); setMsg(null); }}>Réinitialiser</Btn>
            {lvl < TARGETS.length - 1 && <Btn v="ghost" onClick={() => { setLvl(lvl + 1); setSel([0, FULL]); setMsg(null); }}>Suivant →</Btn>}
          </div>
          {msg && <Feedback ok={msg.ok}>{msg.t}</Feedback>}
        </div>
        <SpaceView topo={sel} label={`${sel.length} ouvert(s)${err ? "" : " · fermés : " + closedSets(sel).map((x) => setName(x)).join(", ")}`} />
      </div>
    </div>
  );
}

/* ================= 2. Opérateurs Å Ā ∂A ================= */
const NONTRIVIAL = ALL_TOPOS.filter((t) => t.length > 2 && t.length < 8);
export function Operators() {
  const { addXP, bump } = useStore();
  const gen = () => ({ t: rand(NONTRIVIAL), A: 1 + Math.floor(Math.random() * 6) });
  const [p, setP] = useState(gen);
  const [ans, setAns] = useState([0, 0, 0, 0, 0]);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState<"base" | "expert">("base");
  const truth = [interior(p.t, p.A), closure(p.t, p.A), boundary(p.t, p.A), accumulation(p.t, p.A), isolated(p.t, p.A)];
  const labels = ["Å", "Ā", "∂A", "Acc(A)", "Isolés"];
  const names = ["Intérieur", "Adhérence", "Frontière", "Pts d'accumulation", "Pts isolés"];
  const count = mode === "base" ? 3 : 5;
  const submit = () => {
    setDone(true);
    const n = truth.slice(0, count).filter((v, i) => v === ans[i]).length;
    addXP(n * 5 + (n === count ? 10 + (mode === "expert" ? 15 : 0) : 0), "Opérateurs");
    if (n === count) bump("operator");
  };
  const next = () => { setP(gen()); setAns([0, 0, 0, 0, 0]); setDone(false); };
  return (
    <div>
      <GameHeader title="Å · Ā · ∂A" sub="Calcule les opérateurs topologiques de la partie A dans l'espace fini donné."
        right={<>{(["base", "expert"] as const).map((m) => <Btn key={m} size="sm" v={mode === m ? "primary" : "ghost"} onClick={() => { setMode(m); next(); }}>{m === "base" ? "Base" : "Expert"}</Btn>)}</>} />
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5"><TopoText t={p.t} /></div>
          <div className="text-xs text-slate-500 mt-2 font-mono">Fermés : {closedSets(p.t).map((x) => setName(x)).join(", ")}</div>
          <div className="font-serif text-4xl mt-4">A = <span className="text-amber-200">{setName(p.A)}</span></div>
          <div className="space-y-2.5 mt-6">
            {labels.slice(0, count).map((l, k) => (
              <div key={k} className="flex items-center gap-3 flex-wrap">
                <div className="w-40"><div className="font-serif text-xl">{l}</div><div className="text-[11px] text-slate-500">{names[k]}</div></div>
                {PTS.map((pt, i) => {
                  const on = has(ans[k], i), good = has(truth[k], i);
                  return (
                    <button key={pt} disabled={done} onClick={() => setAns(ans.map((v, j) => (j === k ? v ^ (1 << i) : v)))}
                      className={cx("w-11 h-11 rounded-full italic font-serif text-lg transition-all", on ? "bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30" : "bg-white/5 hover:bg-white/15", done && good && "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0b0b1a]", done && on && !good && "ring-2 ring-rose-400")}>{pt}</button>
                  );
                })}
                {done && <span className={cx("text-sm font-mono", truth[k] === ans[k] ? "text-emerald-300" : "text-rose-300")}>{truth[k] === ans[k] ? "✓" : "→ " + setName(truth[k])}</span>}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-6">{!done ? <Btn onClick={submit}>Valider</Btn> : <Btn onClick={next}>Nouvel exercice →</Btn>}</div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">Å = ⋃ des ouverts ⊂ A · Ā = ⋂ des fermés ⊃ A · ∂A = Ā ∖ Å · dans un espace fini, x est d'accumulation ssi son plus petit ouvert U_x vérifie U_x ∩ (A∖{"{"}x{"}"}) ≠ ∅.</p>
        </div>
        <SpaceView topo={p.t} hi={p.A} hi2={done ? truth[0] : 0} label="A en jaune · Å en vert après validation" />
      </div>
    </div>
  );
}

/* ================= 3. Continuité ================= */
export function Continuity() {
  const { addXP, bump } = useStore();
  const gen = () => {
    const t1 = rand(ALL_TOPOS), t2 = rand(ALL_TOPOS.filter((t) => t.length < 8));
    const f = [0, 1, 2].map(() => Math.floor(Math.random() * 3));
    return { t1, t2, f };
  };
  const [p, setP] = useState(gen);
  const [ans, setAns] = useState<null | { c: boolean; h?: boolean }>(null);
  const [streak, setStreak] = useState(0);
  const cont = isContinuous(p.f, p.t1, p.t2);
  const bad = continuityFail(p.f, p.t1, p.t2);
  const homeo = isHomeo(p.f, p.t1, p.t2);
  const answer = (c: boolean) => {
    if (ans) return;
    setAns({ c });
    if (c === cont) { addXP(12 + streak * 2, "Continuité"); bump("cont"); setStreak(streak + 1); } else setStreak(0);
  };
  return (
    <div>
      <GameHeader title="Détecteur de continuité" sub="f : (E,τ) → (F,τ′) est-elle continue ? Rappel : f continue ⇔ f⁻¹(V) ∈ τ pour tout V ∈ τ′."
        right={<Badge color="amber">🔥 série {streak}</Badge>} />
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-400/20"><span className="text-violet-300 text-xs mr-2">Départ</span><TopoText t={p.t1} /></div>
          <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-400/20"><span className="text-cyan-300 text-xs mr-2">Arrivée</span><span className="font-mono text-sm">τ′ = {"{"}{p.t2.map((x) => setName(x, ["a′", "b′", "c′"])).join(", ")}{"}"}</span></div>
          <div className="font-mono text-sm text-slate-300">f : {PTS.map((x, i) => `${x} ↦ ${PTS[p.f[i]]}′`).join(" ,  ")}</div>
          {!ans ? (
            <div className="flex gap-3 pt-3"><Btn v="success" size="lg" onClick={() => answer(true)}>Continue</Btn><Btn v="danger" size="lg" onClick={() => answer(false)}>Non continue</Btn></div>
          ) : (
            <>
              <Feedback ok={ans.c === cont}>
                {cont ? <>f est <b>continue</b> : chaque image réciproque est ouverte.{" "}{isBijective(p.f) && (homeo ? "C'est même un homéomorphisme !" : "Bijective, mais f⁻¹ n'est pas continue : pas un homéomorphisme.")}</>
                  : <>f n'est <b>pas continue</b> : V = {setName(bad!, ["a′", "b′", "c′"])} ∈ τ′ mais f⁻¹(V) = {setName(preimage(p.f, bad!))} ∉ τ.</>}
              </Feedback>
              <div className="text-xs text-slate-400 font-mono space-y-0.5 mt-2">
                {p.t2.map((V) => <div key={V}>f⁻¹({setName(V, ["a′", "b′", "c′"])}) = {setName(preimage(p.f, V))} {p.t1.includes(preimage(p.f, V)) ? "✓" : "✗"}</div>)}
              </div>
              <Btn onClick={() => { setP(gen()); setAns(null); }}>Application suivante →</Btn>
            </>
          )}
        </div>
        <MapView f={p.f} t1={p.t1} t2={p.t2} bad={ans ? bad : null} />
      </div>
    </div>
  );
}

/* ================= 4. Séparé ou non ? ================= */
export function Hausdorff() {
  const { addXP, bump } = useStore();
  const pool = useMemo(() => [...ALL_TOPOS, ALL_TOPOS[ALL_TOPOS.length - 1], ALL_TOPOS[ALL_TOPOS.length - 1]], []);
  const [t, setT] = useState(() => rand(pool));
  const [q, setQ] = useState<"T2" | "T1" | "T0">("T2");
  const [ans, setAns] = useState<boolean | null>(null);
  const truth = q === "T2" ? isHausdorff(t) : q === "T1" ? isT1(t) : isT0(t);
  const w = hausdorffWitness(t);
  const go = (v: boolean) => { if (ans !== null) return; setAns(v); if (v === truth) { addXP(10, "Séparation"); bump("haus"); } };
  const next = () => { setT(rand(pool)); setQ(rand(["T2", "T1", "T0"] as const)); setAns(null); };
  const qtext = { T2: "séparé (Hausdorff, T2)", T1: "T1 (singletons fermés)", T0: "T0 (points topologiquement distinguables)" }[q];
  return (
    <div>
      <GameHeader title="Axiomes de séparation" sub="Décide si l'espace vérifie la propriété demandée. Séparé ⇒ T1 ⇒ T0." />
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5"><TopoText t={t} /></div>
          <div className="font-serif text-3xl mt-5">Cet espace est-il <span className="grad-text">{qtext}</span> ?</div>
          {ans === null ? (
            <div className="flex gap-3 mt-6"><Btn v="success" size="lg" onClick={() => go(true)}>Oui</Btn><Btn v="danger" size="lg" onClick={() => go(false)}>Non</Btn></div>
          ) : (
            <>
              <Feedback ok={ans === truth}>
                {q === "T2" && (truth ? "Discret ⇒ séparé : prendre les singletons." : `Les points ${PTS[w![0]]} et ${PTS[w![1]]} n'admettent pas de voisinages disjoints.`)}
                {q === "T1" && (truth ? "Chaque singleton est fermé." : `Les singletons non fermés : ${PTS.filter((_, i) => !t.includes(FULL & ~(1 << i))).map((x) => "{" + x + "}").join(", ")}.`)}
                {q === "T0" && (truth ? "Les plus petits ouverts U_a, U_b, U_c sont deux à deux distincts." : "Deux points ont exactement les mêmes ouverts : on ne peut pas les distinguer.")}
              </Feedback>
              <div className="text-xs font-mono text-slate-400 mt-2">Plus petits ouverts : {PTS.map((x, i) => `U_${x} = ${setName(minOpen(t, i))}`).join(" · ")}</div>
              <Btn className="mt-4" onClick={next}>Espace suivant →</Btn>
            </>
          )}
        </div>
        <SpaceView topo={t} hi={ans !== null && w && q === "T2" && !truth ? (1 << w[0]) | (1 << w[1]) : 0} />
      </div>
    </div>
  );
}

/* ================= 5. Voisinages ================= */
export function Neighbourhood() {
  const { addXP, bump } = useStore();
  const gen = () => ({ t: rand(NONTRIVIAL), x: Math.floor(Math.random() * 3), V: 1 + Math.floor(Math.random() * 7) });
  const [p, setP] = useState(gen);
  const [ans, setAns] = useState<boolean | null>(null);
  const U = minOpen(p.t, p.x);
  const truth = (U & p.V) === U && has(p.V, p.x);
  const go = (v: boolean) => { if (ans !== null) return; setAns(v); if (v === truth) { addXP(8, "Voisinages"); bump("neigh"); } };
  return (
    <div>
      <GameHeader title="Bon voisin" sub="V est-il un voisinage de x ? (Il faut un ouvert W avec x ∈ W ⊂ V.)" />
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5"><TopoText t={p.t} /></div>
          <div className="font-serif text-4xl mt-6">V = <span className="text-cyan-200">{setName(p.V)}</span> ∈ 𝒱<sub className="text-2xl">{PTS[p.x]}</sub> ?</div>
          {ans === null ? (
            <div className="flex gap-3 mt-6"><Btn v="success" size="lg" onClick={() => go(true)}>Voisinage</Btn><Btn v="danger" size="lg" onClick={() => go(false)}>Pas voisinage</Btn></div>
          ) : (
            <>
              <Feedback ok={ans === truth}>
                {!has(p.V, p.x) ? `${PTS[p.x]} ∉ V : impossible.` : truth ? `W = ${setName(U)} est ouvert et ${PTS[p.x]} ∈ W ⊂ V.` : `Le plus petit ouvert contenant ${PTS[p.x]} est ${setName(U)} ⊄ V.`}
              </Feedback>
              <Btn className="mt-4" onClick={() => { setP(gen()); setAns(null); }}>Suivant →</Btn>
            </>
          )}
        </div>
        <SpaceView topo={p.t} hi={1 << p.x} hi2={p.V & ~(1 << p.x)} label="x en jaune · V en vert" />
      </div>
    </div>
  );
}
