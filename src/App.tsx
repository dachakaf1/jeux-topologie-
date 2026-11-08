import { useEffect, useMemo, useState } from "react";
import { StoreProvider, useStore, xpFor } from "./lib/store";
import { Modal, Progress, Toasts, cx } from "./components/ui";
import { Aurora, NetworkBackground } from "./components/Visuals";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Labs from "./pages/Labs";
import Games from "./pages/Games";
import { Exercises, Flashcards, Profile } from "./pages/Study";
import { COURSE } from "./data";
import { EXERCISES, FLASHCARDS } from "./extra";

const NAV = [
  { k: "home", l: "Accueil", i: "⌂" },
  { k: "cours", l: "Cours", i: "§" },
  { k: "labs", l: "Labos", i: "⌬" },
  { k: "jeux", l: "Jeux", i: "◆" },
  { k: "exos", l: "Exercices", i: "✎" },
  { k: "cards", l: "Flashcards", i: "▤" },
  { k: "profil", l: "Profil", i: "♛" },
];

function CommandPalette({ open, onClose, go }: { open: boolean; onClose: () => void; go: (p: string) => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const index = useMemo(() => [
    ...NAV.map((n) => ({ t: n.l, s: "Page", p: n.k, i: n.i })),
    ...COURSE.flatMap((c) => c.items.map((it) => ({ t: `${it.kind} — ${it.title}`, s: `§ ${c.id}`, p: "cours", i: "§", body: it.body }))),
    ...EXERCISES.map((e) => ({ t: `Exercice ${e.id} — ${e.title}`, s: "Exercices", p: "exos", i: "✎", body: e.statement })),
    ...FLASHCARDS.map((f) => ({ t: f.front, s: "Flashcard", p: "cards", i: "▤", body: f.back })),
  ], []);
  const res = index.filter((x: any) => !q || (x.t + " " + (x.body || "")).toLowerCase().includes(q.toLowerCase())).slice(0, 9);
  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => { if (open) setQ(""); }, [open]);
  const pick = (r: any) => { go(r.p); onClose(); };
  return (
    <Modal open={open} onClose={onClose}>
      <div className="glass-strong rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/40">
        <div className="flex items-center gap-3 px-5 border-b border-white/10">
          <span className="text-slate-500 text-xl">⌕</span>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher une définition, un théorème, un exercice…"
            onKeyDown={(e) => { if (e.key === "ArrowDown") setSel((s) => Math.min(res.length - 1, s + 1)); if (e.key === "ArrowUp") setSel((s) => Math.max(0, s - 1)); if (e.key === "Enter" && res[sel]) pick(res[sel]); }}
            className="flex-1 bg-transparent py-5 outline-none text-lg" />
          <kbd className="text-xs text-slate-500 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {res.map((r: any, k) => (
            <button key={k} onMouseEnter={() => setSel(k)} onClick={() => pick(r)} className={cx("w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition", k === sel ? "bg-violet-500/20" : "")}>
              <span className="w-8 h-8 rounded-lg grid place-items-center bg-white/5 text-cyan-200">{r.i}</span>
              <span className="flex-1 truncate">{r.t}</span>
              <span className="text-xs text-slate-500">{r.s}</span>
            </button>
          ))}
          {res.length === 0 && <div className="text-center text-slate-500 py-10">Aucun résultat</div>}
        </div>
      </div>
    </Modal>
  );
}

function Shell() {
  const st = useStore();
  const [page, setPage] = useState(() => location.hash.slice(1) || "home");
  const [cmd, setCmd] = useState(false);
  const [menu, setMenu] = useState(false);
  const go = (p: string) => { setPage(p); location.hash = p; setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmd((c) => !c); } };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);
  const pct = ((st.xp - xpFor(st.level)) / (xpFor(st.level + 1) - xpFor(st.level))) * 100;
  return (
    <div className="min-h-screen bg-[#06060f] text-slate-100 relative overflow-x-hidden selection:bg-violet-500/40">
      <Aurora />
      <NetworkBackground />

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#06060f]/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center gap-5">
          <button onClick={() => go("home")} className="flex items-center gap-2.5 shrink-0">
            <img src="/favicon.svg" alt="Logo Iliass Errouifi" className="w-9 h-9 rounded-xl shadow-lg shadow-violet-500/30" />
            <span className="font-serif text-2xl tracking-tight hidden sm:block">Topologia</span>
          </button>
          <nav className="hidden lg:flex gap-1 mx-auto p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            {NAV.map((n) => (
              <button key={n.k} onClick={() => go(n.k)} className={cx("px-4 py-1.5 rounded-xl text-sm transition-all flex items-center gap-1.5", page === n.k ? "bg-white/10 text-white shadow-inner" : "text-slate-400 hover:text-white")}>
                <span className="opacity-60">{n.i}</span>{n.l}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 ml-auto lg:ml-0">
            <button onClick={() => setCmd(true)} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-slate-400 hover:text-white transition">⌕ Rechercher <kbd className="text-[10px] border border-white/10 rounded px-1">⌘K</kbd></button>
            <button onClick={() => go("profil")} className="flex items-center gap-2.5 group">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Niveau {st.level}</div>
                <div className="font-mono text-xs text-cyan-200">{st.xp} XP</div>
              </div>
              <div className="relative w-10 h-10">
                <svg viewBox="0 0 40 40" className="-rotate-90 absolute inset-0"><circle cx="20" cy="20" r="17" stroke="rgba(255,255,255,.1)" strokeWidth="3" fill="none" /><circle cx="20" cy="20" r="17" stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray={107} strokeDashoffset={107 * (1 - pct / 100)} className="transition-all duration-700" /></svg>
                <span className="absolute inset-0 grid place-items-center font-serif text-lg">{st.level}</span>
              </div>
            </button>
            <button className="lg:hidden w-10 h-10 rounded-xl bg-white/5 text-xl" onClick={() => setMenu(!menu)}>☰</button>
          </div>
        </div>
        <Progress value={pct} className="h-[2px] rounded-none" />
        {menu && (
          <div className="lg:hidden border-t border-white/5 p-3 grid grid-cols-2 gap-2 fade-up">
            {NAV.map((n) => <button key={n.k} onClick={() => go(n.k)} className={cx("p-3 rounded-xl text-left", page === n.k ? "bg-white/10" : "bg-white/[0.03]")}><span className="mr-2 text-cyan-300">{n.i}</span>{n.l}</button>)}
            <button onClick={() => { setCmd(true); setMenu(false); }} className="p-3 rounded-xl bg-white/[0.03] text-left col-span-2">⌕ Rechercher</button>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-5 py-10 md:py-14 min-h-[80vh]">
        <div key={page} className="page-in">
          {page === "home" && <Home go={go} />}
          {page === "cours" && <Course />}
          {page === "labs" && <Labs />}
          {page === "jeux" && <Games />}
          {page === "exos" && <Exercises />}
          {page === "cards" && <Flashcards />}
          {page === "profil" && <Profile />}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] mt-10">
        <div className="max-w-7xl mx-auto px-5 py-10 grid md:grid-cols-2 gap-6 text-sm text-slate-500">
          <div><div className="font-serif text-2xl text-slate-200">Topologia</div><p className="mt-2">Plateforme interactive de topologie.</p></div>
            <div className="md:text-right"><div className="text-slate-300">Iliass Errouifi</div><div className="font-serif italic mt-2 text-slate-400">« ∅ ∈ τ, E ∈ τ »</div></div>
        </div>
      </footer>

      <CommandPalette open={cmd} onClose={() => setCmd(false)} go={go} />
      <Toasts />
    </div>
  );
}

export default function App() {
  return <StoreProvider><Shell /></StoreProvider>;
}
