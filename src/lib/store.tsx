import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Achievement = { id: string; name: string; desc: string; icon: string };
export const ACHIEVEMENTS: Achievement[] = [
  { id: "first", name: "Premier ouvert", desc: "Gagner tes premiers XP", icon: "✦" },
  { id: "builder", name: "Architecte", desc: "Construire 5 topologies valides", icon: "⬡" },
  { id: "discrete", name: "Tout est ouvert", desc: "Construire la topologie discrète", icon: "◈" },
  { id: "operator", name: "Opérateur", desc: "Réussir 5 calculs Å, Ā, ∂A parfaits", icon: "◎" },
  { id: "quiz10", name: "Érudit", desc: "Obtenir ≥ 10 au QCM chrono", icon: "⧗" },
  { id: "streak5", name: "En feu", desc: "Série de 5 au Vrai/Faux", icon: "🔥" },
  { id: "streak10", name: "Inarrêtable", desc: "Série de 10 au Vrai/Faux", icon: "☄" },
  { id: "proof", name: "Logicien", desc: "Reconstruire 3 démonstrations", icon: "∎" },
  { id: "cont", name: "Continuité", desc: "Juger 10 applications correctement", icon: "ƒ" },
  { id: "haus", name: "Séparateur", desc: "Classer 8 espaces (séparé ou non)", icon: "⊥" },
  { id: "memory", name: "Mémoire d'éléphant", desc: "Terminer le Memory", icon: "❖" },
  { id: "interval", name: "Droite réelle", desc: "Classer 10 intervalles", icon: "ℝ" },
  { id: "cards", name: "Révision", desc: "Maîtriser 15 flashcards", icon: "▤" },
  { id: "reader", name: "Lecteur assidu", desc: "Lire toutes les sections du cours", icon: "§" },
  { id: "exo", name: "Exercé", desc: "Ouvrir 5 corrigés d'exercices", icon: "✎" },
  { id: "lvl5", name: "Topologue", desc: "Atteindre le niveau 5", icon: "τ" },
  { id: "lvl10", name: "Maître de τ", desc: "Atteindre le niveau 10", icon: "♛" },
  { id: "neigh", name: "Bon voisin", desc: "Réussir 6 questions de voisinages", icon: "◌" },
];

type State = {
  xp: number;
  counters: Record<string, number>;
  unlocked: string[];
  read: string[];
  mastered: string[];
  history: { t: number; xp: number; src: string }[];
};
const init: State = { xp: 0, counters: {}, unlocked: [], read: [], mastered: [], history: [] };

type Toast = { id: number; text: string; icon: string; kind: "xp" | "ach" };
type Ctx = State & {
  addXP: (n: number, src?: string) => void;
  bump: (k: string, n?: number) => number;
  unlock: (id: string) => void;
  markRead: (id: string) => void;
  toggleMastered: (id: string) => void;
  reset: () => void;
  toasts: Toast[];
  level: number;
};
const C = createContext<Ctx>(null as any);
export const useStore = () => useContext(C);
export const levelOf = (xp: number) => Math.floor(Math.sqrt(xp / 40)) + 1;
export const xpFor = (lvl: number) => 40 * (lvl - 1) ** 2;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(() => {
    try { return { ...init, ...JSON.parse(localStorage.getItem("topologia-v2") || "{}") }; } catch { return init; }
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const announced = useRef(new Set(s.unlocked));
  useEffect(() => localStorage.setItem("topologia-v2", JSON.stringify(s)), [s]);

  const toast = useCallback((text: string, icon: string, kind: Toast["kind"]) => {
    const id = Math.random();
    setToasts((t) => [...t.slice(-3), { id, text, icon, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const unlock = useCallback((id: string) => {
    setS((st) => {
      if (st.unlocked.includes(id) || !ACHIEVEMENTS.some((achievement) => achievement.id === id)) return st;
      return { ...st, unlocked: [...st.unlocked, id] };
    });
  }, []);

  useEffect(() => {
    s.unlocked.forEach((id) => {
      if (announced.current.has(id)) return;
      announced.current.add(id);
      const achievement = ACHIEVEMENTS.find((item) => item.id === id);
      if (achievement) toast(`Succès débloqué : ${achievement.name}`, achievement.icon, "ach");
    });
    announced.current = new Set(s.unlocked);
  }, [s.unlocked, toast]);

  const addXP = useCallback((n: number, src = "jeu") => {
    if (n <= 0) return;
    toast(`+${n} XP`, "✦", "xp");
    setS((st) => {
      const xp = st.xp + n;
      return { ...st, xp, history: [...st.history.slice(-59), { t: Date.now(), xp: n, src }] };
    });
  }, [toast]);

  useEffect(() => {
    if (s.xp > 0) unlock("first");
    const l = levelOf(s.xp);
    if (l >= 5) unlock("lvl5");
    if (l >= 10) unlock("lvl10");
  }, [s.xp, unlock]);

  const bump = useCallback((k: string, n = 1) => {
    let v = 0;
    setS((st) => { v = (st.counters[k] || 0) + n; return { ...st, counters: { ...st.counters, [k]: v } }; });
    return v;
  }, []);
  const markRead = useCallback((id: string) => setS((st) => (st.read.includes(id) ? st : { ...st, read: [...st.read, id] })), []);
  const toggleMastered = useCallback((id: string) =>
    setS((st) => ({ ...st, mastered: st.mastered.includes(id) ? st.mastered.filter((x) => x !== id) : [...st.mastered, id] })), []);
  const reset = () => setS(init);

  // succès basés sur compteurs
  useEffect(() => {
    const c = s.counters;
    if ((c.builder || 0) >= 5) unlock("builder");
    if ((c.operator || 0) >= 5) unlock("operator");
    if ((c.proof || 0) >= 3) unlock("proof");
    if ((c.cont || 0) >= 10) unlock("cont");
    if ((c.haus || 0) >= 8) unlock("haus");
    if ((c.interval || 0) >= 10) unlock("interval");
    if ((c.exo || 0) >= 5) unlock("exo");
    if ((c.neigh || 0) >= 6) unlock("neigh");
    if (s.mastered.length >= 15) unlock("cards");
    if (s.read.length >= 4) unlock("reader");
  }, [s.counters, s.mastered, s.read, unlock]);

  return (
    <C.Provider value={{ ...s, addXP, bump, unlock, markRead, toggleMastered, reset, toasts, level: levelOf(s.xp) }}>
      {children}
    </C.Provider>
  );
}
