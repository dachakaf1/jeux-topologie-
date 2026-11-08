import { useEffect, useRef } from "react";
import { PTS, has, setName } from "../lib/topo";

// Fond animé : réseau de points (évoque voisinages / ouverts)
export function NetworkBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -999, y: -999 };
    const resize = () => { w = c.width = innerWidth * devicePixelRatio; h = c.height = innerHeight * devicePixelRatio; };
    resize(); addEventListener("resize", resize);
    const mm = (e: MouseEvent) => { mouse.x = e.clientX * devicePixelRatio; mouse.y = e.clientY * devicePixelRatio; };
    addEventListener("mousemove", mm);
    const n = Math.min(70, Math.floor(innerWidth / 22));
    const P = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 }));
    const D = 150 * devicePixelRatio;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of P) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d = Math.hypot(dx, dy);
          if (d < D) {
            ctx.strokeStyle = `rgba(167,139,250,${0.12 * (1 - d / D)})`;
            ctx.lineWidth = devicePixelRatio;
            ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); ctx.stroke();
          }
        }
        const dm = Math.hypot(P[i].x - mouse.x, P[i].y - mouse.y);
        if (dm < D * 1.3) {
          ctx.strokeStyle = `rgba(34,211,238,${0.25 * (1 - dm / (D * 1.3))})`;
          ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = "rgba(226,232,240,.5)";
        ctx.beginPath(); ctx.arc(P[i].x, P[i].y, 1.4 * devicePixelRatio, 0, 7); ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("mousemove", mm); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none opacity-70" />;
}

export function Aurora() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="blob bg-violet-600/25 w-[620px] h-[620px] -top-60 -left-40" />
      <div className="blob bg-cyan-500/15 w-[520px] h-[520px] top-1/3 -right-52" style={{ animationDelay: "-6s" }} />
      <div className="blob bg-fuchsia-600/15 w-[480px] h-[480px] -bottom-40 left-1/3" style={{ animationDelay: "-12s" }} />
      <div className="absolute inset-0 noise" />
    </div>
  );
}

const POS = [[95, 95], [205, 95], [150, 190]];
const COL = ["#a78bfa", "#22d3ee", "#f472b6"];

// Visualisation d'un espace fini : ouverts dessinés comme des "blobs" englobant leurs points
export function SpaceView({ topo, hi = 0, hi2 = 0, label, size = 300, pts = PTS }: { topo: number[]; hi?: number; hi2?: number; label?: string; size?: number; pts?: string[] }) {
  const opens = topo.filter((o) => o !== 0 && o !== 7);
  const hull = (m: number, k: number) => {
    const idx = [0, 1, 2].filter((i) => has(m, i));
    const pad = 34 + k * 7;
    if (idx.length === 1) { const [x, y] = POS[idx[0]]; return <circle cx={x} cy={y} r={pad} />; }
    if (idx.length === 2) {
      const [a, b] = idx.map((i) => POS[i]);
      const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2, len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
      return <rect x={cx - len / 2 - pad} y={cy - pad} width={len + 2 * pad} height={2 * pad} rx={pad} transform={`rotate(${ang} ${cx} ${cy})`} />;
    }
    return <circle cx={150} cy={127} r={100} />;
  };
  return (
    <svg viewBox="0 0 300 260" style={{ maxWidth: size }} className="w-full mx-auto overflow-visible">
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <radialGradient id="pt"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#c4b5fd" /></radialGradient>
      </defs>
      <rect x="8" y="8" width="284" height="244" rx="26" fill="rgba(255,255,255,.015)" stroke="rgba(255,255,255,.12)" strokeDasharray="4 6" />
      <text x="22" y="30" fill="#64748b" fontSize="13" fontStyle="italic" fontFamily="serif">E</text>
      {opens.map((o, k) => {
        const c = COL[k % 3];
        return <g key={o} fill={c} fillOpacity={0.09} stroke={c} strokeOpacity={0.75} strokeWidth={1.4} className="draw-in" style={{ animationDelay: k * 90 + "ms" }}>{hull(o, opens.filter((x) => (x & o) === x && x !== o).length)}</g>;
      })}
      {pts.map((p, i) => {
        const [x, y] = POS[i];
        const h1 = has(hi, i), h2 = has(hi2, i);
        return (
          <g key={p}>
            {h1 && <circle cx={x} cy={y} r={20} fill="#fde047" fillOpacity={0.25} className="pulse-ring" />}
            <circle cx={x} cy={y} r={h1 ? 13 : 10} fill={h1 ? "#fde047" : h2 ? "#34d399" : "url(#pt)"} filter="url(#glow)" className="transition-all duration-300" />
            <text x={x} y={y + 4.5} textAnchor="middle" fontSize="13" fill="#0f172a" fontStyle="italic" fontFamily="serif" fontWeight="700">{p}</text>
          </g>
        );
      })}
      {label !== undefined && <text x="150" y="250" textAnchor="middle" fill="#94a3b8" fontSize="11">{label}</text>}
    </svg>
  );
}

export const TopoText = ({ t }: { t: number[] }) => (
  <span className="font-mono text-sm">τ = {"{"}{t.map((o, i) => <span key={o}><span className="text-violet-200">{setName(o)}</span>{i < t.length - 1 ? ", " : ""}</span>)}{"}"}</span>
);

// Diagramme sagittal d'une application entre deux espaces finis
export function MapView({ f, t1, t2, bad }: { f: number[]; t1: number[]; t2: number[]; bad?: number | null }) {
  const yy = [50, 120, 190];
  return (
    <svg viewBox="0 0 360 240" className="w-full max-w-md mx-auto">
      <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#22d3ee" /></marker></defs>
      <rect x="20" y="15" width="90" height="210" rx="40" fill="rgba(167,139,250,.07)" stroke="#a78bfa" strokeOpacity=".5" />
      <rect x="250" y="15" width="90" height="210" rx="40" fill="rgba(34,211,238,.07)" stroke="#22d3ee" strokeOpacity=".5" />
      <text x="65" y="240" textAnchor="middle" fill="#a78bfa" fontSize="12" fontStyle="italic">(E, τ)</text>
      <text x="295" y="240" textAnchor="middle" fill="#22d3ee" fontSize="12" fontStyle="italic">(F, τ′)</text>
      {f.map((fx, x) => {
        const isBad = bad != null && has(bad, fx);
        return <path key={x} d={`M78 ${yy[x]} C 170 ${yy[x]}, 190 ${yy[fx]}, 272 ${yy[fx]}`} fill="none" stroke={isBad ? "#fb7185" : "#22d3ee"} strokeWidth="1.8" markerEnd="url(#ar)" className="draw-path" strokeOpacity=".85" />;
      })}
      {PTS.map((p, i) => (
        <g key={p}>
          <circle cx={65} cy={yy[i]} r={13} fill="#ede9fe" /><text x={65} y={yy[i] + 5} textAnchor="middle" fontSize="13" fontStyle="italic" fontWeight="700" fill="#1e1b4b">{p}</text>
          <circle cx={295} cy={yy[i]} r={13} fill={bad != null && has(bad, i) ? "#fda4af" : "#cffafe"} /><text x={295} y={yy[i] + 5} textAnchor="middle" fontSize="13" fontStyle="italic" fontWeight="700" fill="#083344">{p}′</text>
        </g>
      ))}
      <text x="65" y="12" textAnchor="middle" fill="#64748b" fontSize="9">{t1.length} ouverts</text>
      <text x="295" y="12" textAnchor="middle" fill="#64748b" fontSize="9">{t2.length} ouverts</text>
    </svg>
  );
}
