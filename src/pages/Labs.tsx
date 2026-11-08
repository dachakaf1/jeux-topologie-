import { useState } from "react";
import { Badge, Card, SectionTitle, cx } from "../components/ui";
import { SpaceView, TopoText } from "../components/Visuals";
import {
  ALL_TOPOS, PTS, accumulation, boundary, closedSets, closure, dense, interior, isClosed, isHausdorff, isOpen, isT0, isT1,
  isolated, induced, minOpen, setName,
} from "../lib/topo";

function FiniteExplorer() {
  const [ti, setTi] = useState(5);
  const [A, setA] = useState(2);
  const t = ALL_TOPOS[ti];
  const rows: [string, string, number | string][] = [
    ["Å", "Intérieur", interior(t, A)], ["Ā", "Adhérence", closure(t, A)], ["∂A", "Frontière", boundary(t, A)],
    ["Acc", "Pts d'accumulation", accumulation(t, A)], ["Iso", "Pts isolés", isolated(t, A)],
  ];
  return (
    <Card>
      <div className="flex flex-wrap justify-between items-end gap-3 mb-5">
        <div><h3 className="font-serif text-3xl">Explorateur d'espaces finis</h3><p className="text-slate-400 text-sm">Les 29 topologies sur E = {"{a,b,c}"}, avec tous les calculs en temps réel.</p></div>
        <div className="flex gap-2 flex-wrap"><Badge color={isHausdorff(t) ? "emerald" : "slate"}>T2 {isHausdorff(t) ? "✓" : "✗"}</Badge><Badge color={isT1(t) ? "emerald" : "slate"}>T1 {isT1(t) ? "✓" : "✗"}</Badge><Badge color={isT0(t) ? "emerald" : "slate"}>T0 {isT0(t) ? "✓" : "✗"}</Badge></div>
      </div>
      <div className="flex gap-1 flex-wrap mb-6">
        {ALL_TOPOS.map((x, i) => (
          <button key={i} onClick={() => setTi(i)} title={x.map((o) => setName(o)).join(", ")}
            className={cx("w-9 h-9 rounded-lg text-xs font-mono transition-all", i === ti ? "bg-gradient-to-br from-violet-400 to-cyan-300 text-slate-900 scale-110 shadow-lg shadow-violet-500/40" : "bg-white/5 hover:bg-white/10 text-slate-400")}>{x.length}</button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
        <div>
          <SpaceView topo={t} hi={A} size={380} />
          <div className="mt-3 p-3 rounded-xl bg-black/25 border border-white/5"><TopoText t={t} /></div>
          <div className="text-xs font-mono text-slate-500 mt-2">Fermés : {closedSets(t).map((x) => setName(x)).join(", ")}</div>
          <div className="text-xs font-mono text-slate-500 mt-1">Plus petits ouverts : {PTS.map((p, i) => `U_${p}=${setName(minOpen(t, i))}`).join("  ")}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Choisis la partie A</div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }, (_, m) => (
              <button key={m} onClick={() => setA(m)} className={cx("py-2.5 rounded-xl font-mono text-sm border transition", A === m ? "bg-amber-300/20 border-amber-300/60 text-amber-100" : "bg-white/[0.03] border-white/10 hover:bg-white/10")}>{setName(m)}</button>
            ))}
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Badge color={isOpen(t, A) ? "emerald" : "slate"}>{isOpen(t, A) ? "ouvert" : "non ouvert"}</Badge>
            <Badge color={isClosed(t, A) ? "emerald" : "slate"}>{isClosed(t, A) ? "fermé" : "non fermé"}</Badge>
            <Badge color={dense(t, A) ? "cyan" : "slate"}>{dense(t, A) ? "dense" : "non dense"}</Badge>
          </div>
          <div className="mt-5 divide-y divide-white/5 rounded-2xl border border-white/10 overflow-hidden">
            {rows.map(([s, n, v]) => (
              <div key={s} className="flex items-center px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] transition">
                <span className="font-serif text-2xl w-16">{s}</span><span className="text-slate-400 text-sm flex-1">{n}</span>
                <span className="font-mono text-lg text-cyan-200 key-flash" key={String(v) + A + ti}>{setName(v as number)}</span>
              </div>
            ))}
            <div className="px-4 py-3 bg-white/[0.02]">
              <div className="text-slate-400 text-sm mb-1">Topologie induite τ_A</div>
              <div className="font-mono text-sm text-violet-200">{A === 0 ? "—" : "{" + induced(t, A).map((o) => (o === A ? "A" : setName(o))).join(", ") + "}"}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SequenceLab() {
  const [n, setN] = useState(1);
  const [mode, setMode] = useState<"inter" | "union">("inter");
  const X = (v: number) => 300 + v * 230;
  return (
    <Card>
      <div className="flex flex-wrap justify-between items-end gap-3">
        <div><h3 className="font-serif text-3xl">Limites des axiomes</h3><p className="text-slate-400 text-sm">Pourquoi n'exige-t-on que l'intersection <i>finie</i> ? (Remarques 1.1.7)</p></div>
        <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/5">
          <button onClick={() => setMode("inter")} className={cx("px-3 py-1.5 rounded-xl text-sm", mode === "inter" ? "bg-white/10" : "text-slate-400")}>⋂ ]−1/n, 1/n[</button>
          <button onClick={() => setMode("union")} className={cx("px-3 py-1.5 rounded-xl text-sm", mode === "union" ? "bg-white/10" : "text-slate-400")}>⋃ [1/n, 1]</button>
        </div>
      </div>
      <svg viewBox="0 0 600 200" className="w-full mt-6">
        <line x1="20" y1="160" x2="580" y2="160" stroke="#475569" />
        {[-1, -0.5, 0, 0.5, 1].map((v) => <g key={v}><line x1={X(v)} y1="155" x2={X(v)} y2="165" stroke="#64748b" /><text x={X(v)} y="185" fill="#64748b" fontSize="12" textAnchor="middle">{v}</text></g>)}
        {Array.from({ length: n }, (_, k) => k + 1).map((k) => {
          const y = 140 - ((k - 1) % 12) * 10, op = 0.25 + 0.75 * (k / n);
          return mode === "inter" ? (
            <g key={k} opacity={op}><line x1={X(-1 / k)} y1={y} x2={X(1 / k)} y2={y} stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
              <circle cx={X(-1 / k)} cy={y} r="4" fill="#0b0b1a" stroke="#a78bfa" strokeWidth="2" /><circle cx={X(1 / k)} cy={y} r="4" fill="#0b0b1a" stroke="#a78bfa" strokeWidth="2" /></g>
          ) : (
            <g key={k} opacity={op}><line x1={X(1 / k)} y1={y} x2={X(1)} y2={y} stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
              <circle cx={X(1 / k)} cy={y} r="4" fill="#22d3ee" /><circle cx={X(1)} cy={y} r="4" fill="#22d3ee" /></g>
          );
        })}
        {mode === "inter" ? (
          <><line x1={X(-1 / n)} y1="160" x2={X(1 / n)} y2="160" stroke="#fde047" strokeWidth="5" /><circle cx={X(0)} cy="160" r="5" fill="#fde047" className="pulse-ring" /></>
        ) : (
          <><line x1={X(1 / n)} y1="160" x2={X(1)} y2="160" stroke="#fde047" strokeWidth="5" /><circle cx={X(0)} cy="160" r="5" fill="#0b0b1a" stroke="#fde047" strokeWidth="2" /></>
        )}
      </svg>
      <input type="range" min={1} max={60} value={n} onChange={(e) => setN(+e.target.value)} className="w-full mt-2 accent-violet-400" />
      <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
        <div className="rounded-xl p-4 bg-white/[0.03] border border-white/5">
          <div className="text-slate-500 text-xs">Après n = {n} termes</div>
          <div className="font-serif text-2xl mt-1">{mode === "inter" ? `]−${(1 / n).toFixed(3)}, ${(1 / n).toFixed(3)}[` : `[${(1 / n).toFixed(3)}, 1]`}</div>
          <div className="text-slate-400">{mode === "inter" ? "intersection finie : encore un ouvert ✓" : "réunion finie : encore un fermé ✓"}</div>
        </div>
        <div className="rounded-xl p-4 bg-amber-500/5 border border-amber-400/20">
          <div className="text-amber-300 text-xs">Quand n → ∞</div>
          <div className="font-serif text-2xl mt-1">{mode === "inter" ? "{0}" : "]0, 1]"}</div>
          <div className="text-slate-400">{mode === "inter" ? "Fermé, et pas ouvert : l'intersection infinie casse l'axiome." : "Ni fermé (0 est adhérent), ni ouvert."}</div>
        </div>
      </div>
    </Card>
  );
}

function BallLab() {
  const [x, setX] = useState(0.3);
  const [eps, setEps] = useState(0.15);
  const [kind, setKind] = useState<"ouvert" | "fermé" | "semi">("semi");
  const a = -0.5, b = 0.5;
  const X = (v: number) => 300 + v * 400;
  const inside = x > a && x < b ? true : (x === a && kind === "fermé") || (x === b && kind !== "ouvert");
  const ballIn = x - eps >= a && x + eps <= b && (x - eps > a || false) && (x + eps < b || false);
  const meets = x + eps > a && x - eps < b;
  const status = ballIn && x > a && x < b ? "intérieur" : meets ? "adhérent (frontière)" : "extérieur";
  return (
    <Card>
      <h3 className="font-serif text-3xl">Voisinages dans ℝ</h3>
      <p className="text-slate-400 text-sm">Déplace x et le rayon ε du voisinage ]x−ε, x+ε[ pour tester intérieur / adhérence de A.</p>
      <div className="flex gap-2 mt-4">{(["ouvert", "fermé", "semi"] as const).map((k) => <button key={k} onClick={() => setKind(k)} className={cx("px-3 py-1.5 rounded-xl text-sm border", kind === k ? "border-violet-400/50 bg-violet-500/15" : "border-white/10 text-slate-400")}>{k === "ouvert" ? "]−½, ½[" : k === "fermé" ? "[−½, ½]" : "]−½, ½]"}</button>)}</div>
      <svg viewBox="0 0 600 130" className="w-full mt-4">
        <line x1="20" y1="70" x2="580" y2="70" stroke="#475569" />
        <line x1={X(a)} y1="70" x2={X(b)} y2="70" stroke="#a78bfa" strokeWidth="8" strokeLinecap="butt" opacity=".6" />
        <circle cx={X(a)} cy="70" r="7" fill={kind === "fermé" ? "#a78bfa" : "#0b0b1a"} stroke="#a78bfa" strokeWidth="2.5" />
        <circle cx={X(b)} cy="70" r="7" fill={kind !== "ouvert" ? "#a78bfa" : "#0b0b1a"} stroke="#a78bfa" strokeWidth="2.5" />
        <rect x={X(x - eps)} y="52" width={eps * 800} height="36" rx="18" fill="#22d3ee" fillOpacity=".12" stroke="#22d3ee" strokeDasharray="4 4" />
        <circle cx={X(x)} cy="70" r="6" fill="#fde047" />
        <text x={X(x)} y="40" textAnchor="middle" fill="#fde047" fontStyle="italic">x</text>
        <text x={X(a)} y="110" textAnchor="middle" fill="#64748b" fontSize="12">−½</text><text x={X(b)} y="110" textAnchor="middle" fill="#64748b" fontSize="12">½</text>
      </svg>
      <div className="grid md:grid-cols-2 gap-4 mt-2">
        <label className="text-sm text-slate-400">x = <span className="font-mono text-amber-200">{x.toFixed(2)}</span><input type="range" min={-0.7} max={0.7} step={0.01} value={x} onChange={(e) => setX(+e.target.value)} className="w-full accent-amber-300" /></label>
        <label className="text-sm text-slate-400">ε = <span className="font-mono text-cyan-200">{eps.toFixed(2)}</span><input type="range" min={0.01} max={0.4} step={0.01} value={eps} onChange={(e) => setEps(+e.target.value)} className="w-full accent-cyan-300" /></label>
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">
        <Badge color={inside ? "emerald" : "slate"}>x {inside ? "∈" : "∉"} A</Badge>
        <Badge color={ballIn ? "emerald" : "rose"}>]x−ε,x+ε[ {ballIn ? "⊂" : "⊄"} A</Badge>
        <Badge color={meets ? "cyan" : "rose"}>voisinage {meets ? "rencontre" : "ne rencontre pas"} A</Badge>
        <Badge color="violet">{status}</Badge>
      </div>
    </Card>
  );
}

export default function Labs() {
  return (
    <div className="space-y-8">
      <SectionTitle kicker="Laboratoires" title={<>Visualiser la <span className="italic grad-text">topologie</span></>} sub="Manipule directement les objets du cours : espaces finis, intervalles réels, voisinages." />
      <FiniteExplorer />
      <div className="grid xl:grid-cols-2 gap-8"><SequenceLab /><BallLab /></div>
    </div>
  );
}
