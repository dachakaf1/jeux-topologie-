// Moteur de topologie finie sur E = {a,b,c} (ou n points) — parties codées en bitmask
export const PTS = ["a", "b", "c"];
export const N = 3;
export const FULL = (1 << N) - 1;

export const setName = (m: number, pts = PTS) =>
  m === 0 ? "∅" : m === (1 << pts.length) - 1 ? "E" : "{" + pts.filter((_, i) => m & (1 << i)).join(",") + "}";

export const has = (m: number, i: number) => (m & (1 << i)) !== 0;
export const comp = (m: number, full = FULL) => full & ~m;
export const subset = (a: number, b: number) => (a & b) === a;

export function topoError(t: number[], full = FULL): string | null {
  const s = new Set(t);
  if (!s.has(0)) return "∅ ∉ τ (axiome i)";
  if (!s.has(full)) return "E ∉ τ (axiome i)";
  for (const x of s)
    for (const y of s) {
      if (!s.has(x & y)) return `${setName(x)} ∩ ${setName(y)} = ${setName(x & y)} ∉ τ (axiome ii)`;
      if (!s.has(x | y)) return `${setName(x)} ∪ ${setName(y)} = ${setName(x | y)} ∉ τ (axiome iii)`;
    }
  return null;
}
export const isTopo = (t: number[], full = FULL) => topoError(t, full) === null;

// Toutes les topologies sur 3 points (29)
export const ALL_TOPOS: number[][] = (() => {
  const out: number[][] = [];
  const mids = [1, 2, 3, 4, 5, 6];
  for (let mask = 0; mask < 1 << mids.length; mask++) {
    const t = [0, FULL, ...mids.filter((_, i) => mask & (1 << i))].sort((a, b) => a - b);
    if (isTopo(t)) out.push(t);
  }
  return out;
})();

export const interior = (t: number[], A: number) => t.filter((o) => subset(o, A)).reduce((u, o) => u | o, 0);
export const closure = (t: number[], A: number) => comp(interior(t, comp(A)));
export const boundary = (t: number[], A: number) => closure(t, A) & ~interior(t, A);
export const closedSets = (t: number[]) => t.map((o) => comp(o)).sort((a, b) => a - b);
export const isOpen = (t: number[], A: number) => t.includes(A);
export const isClosed = (t: number[], A: number) => t.includes(comp(A));

// plus petit ouvert contenant x (existe en fini)
export const minOpen = (t: number[], i: number) => t.filter((o) => has(o, i)).reduce((u, o) => u & o, FULL);

export function accumulation(t: number[], A: number) {
  let r = 0;
  for (let i = 0; i < N; i++) if ((minOpen(t, i) & A & ~(1 << i)) !== 0) r |= 1 << i;
  return r;
}
export function isolated(t: number[], A: number) {
  let r = 0;
  for (let i = 0; i < N; i++) if (has(A, i) && (minOpen(t, i) & A) === 1 << i) r |= 1 << i;
  return r;
}
export const dense = (t: number[], A: number) => closure(t, A) === FULL;

export function isHausdorff(t: number[]) {
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++)
      if (!t.some((u) => has(u, i) && !has(u, j) && t.some((v) => has(v, j) && !has(v, i) && (u & v) === 0))) return false;
  return true;
}
export function isT1(t: number[]) {
  for (let i = 0; i < N; i++) if (!isClosed(t, 1 << i)) return false;
  return true;
}
export function isT0(t: number[]) {
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (minOpen(t, i) === minOpen(t, j)) return false;
  return true;
}
export function hausdorffWitness(t: number[]): [number, number] | null {
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++)
      if (!t.some((u) => has(u, i) && !has(u, j) && t.some((v) => has(v, j) && !has(v, i) && (u & v) === 0))) return [i, j];
  return null;
}

export const preimage = (f: number[], B: number) => f.reduce((r, fx, x) => (has(B, fx) ? r | (1 << x) : r), 0);
export const image = (f: number[], A: number) => f.reduce((r, fx, x) => (has(A, x) ? r | (1 << fx) : r), 0);
export function continuityFail(f: number[], t1: number[], t2: number[]): number | null {
  for (const V of t2) if (!t1.includes(preimage(f, V))) return V;
  return null;
}
export const isContinuous = (f: number[], t1: number[], t2: number[]) => continuityFail(f, t1, t2) === null;
export const isBijective = (f: number[]) => new Set(f).size === f.length;
export function isHomeo(f: number[], t1: number[], t2: number[]) {
  if (!isBijective(f) || !isContinuous(f, t1, t2)) return false;
  return t1.every((U) => t2.includes(image(f, U)));
}

export function induced(t: number[], A: number) {
  return [...new Set(t.map((o) => o & A))].sort((a, b) => a - b);
}

export function topoName(t: number[]) {
  if (t.length === 2) return "grossière";
  if (t.length === 8) return "discrète";
  return `${t.length} ouverts`;
}

export const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
export const shuffle = <T,>(a: T[]) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

// ------- Intervalles réels pour le labo ℝ -------
export type Interval = { a: number; b: number; lc: boolean; rc: boolean }; // lc: fermé à gauche
export const ivName = (I: Interval) => {
  const f = (x: number) => (x === -Infinity ? "−∞" : x === Infinity ? "+∞" : String(+x.toFixed(2)));
  return `${I.lc ? "[" : "]"}${f(I.a)}, ${f(I.b)}${I.rc ? "]" : "["}`;
};
export function ivNature(I: Interval): "ouvert" | "fermé" | "ouvert et fermé" | "ni ouvert ni fermé" {
  const infL = I.a === -Infinity, infR = I.b === Infinity;
  if (infL && infR) return "ouvert et fermé";
  const openL = infL || !I.lc, openR = infR || !I.rc;
  const closedL = infL || I.lc, closedR = infR || I.rc;
  if (openL && openR) return "ouvert";
  if (closedL && closedR) return "fermé";
  return "ni ouvert ni fermé";
}
