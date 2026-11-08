import { ArrowRight, Play } from "lucide-react";
import { Btn, Card, Progress, Tilt } from "../components/ui";
import ThreeVisual from "../components/ThreeVisual";
import { COURSE } from "../data";
import { FLASHCARDS } from "../extra";
import { HOME_SCENE } from "../lib/sceneConfig";
import { ACHIEVEMENTS, useStore, xpFor } from "../lib/store";

const FEATURES = [
  { k: "cours", ico: "§", t: "Cours en 3D", d: "Des notions à explorer et des démonstrations animées étape par étape." },
  { k: "labs", ico: "⌬", t: "Laboratoires", d: "Explore les 29 topologies sur 3 points et visualise la droite réelle." },
  { k: "jeux", ico: "◆", t: "10 jeux", d: "Construction, continuité, séparation, preuves, memory, chrono…" },
  { k: "exos", ico: "✎", t: "Exercices corrigés", d: "Indices et corrigés guidés avec des modèles 3D." },
  { k: "cards", ico: "▤", t: "Flashcards", d: "Révisez les définitions et les théorèmes." },
  { k: "profil", ico: "♛", t: "Progression", d: "XP, niveaux, 18 succès à débloquer." },
];

export default function Home({ go }: { go: (p: string) => void }) {
  const st = useStore();
  const readPct = (st.read.length / COURSE.length) * 100;
  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-visual"><ThreeVisual config={HOME_SCENE} compact /></div>
        <div className="home-hero-shade" />
        <div className="home-hero-inner">
          <div className="home-hero-copy fade-up">
            <p className="home-hero-kicker">TOPOLOGIE</p>
            <h1>Topologia<span>La topologie<br /><em>prend forme.</em></span></h1>
            <p className="home-hero-description">Explorez les concepts et les démonstrations du cours grâce à des modèles 3D interactifs. Réalisé par Iliass Errouifi.</p>
            <div className="home-hero-actions">
              <Btn size="lg" onClick={() => go("cours")}>Explorer le cours <ArrowRight size={17} /></Btn>
              <Btn size="lg" v="ghost" onClick={() => go("jeux")}><Play size={14} /> Découvrir les jeux</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* Axiomes */}
      <section className="grid md:grid-cols-3 gap-4">
        {[["i", "∅ ∈ τ  et  E ∈ τ", "Le vide et l'espace entier sont ouverts."], ["ii", "U, V ∈ τ ⇒ U ∩ V ∈ τ", "Stabilité par intersection finie."], ["iii", "(Uᵢ) ⊂ τ ⇒ ⋃ Uᵢ ∈ τ", "Stabilité par réunion quelconque."]].map(([n, f, d], i) => (
          <Card key={n} className="fade-up hover-lift" style={{ animationDelay: i * 100 + "ms" }}>
            <div className="font-serif italic text-6xl text-white/10 absolute right-6 top-3">{n}</div>
            <div className="text-xs uppercase tracking-widest text-violet-300">Axiome {n}</div>
            <div className="font-serif text-2xl mt-3">{f}</div>
            <div className="text-slate-400 text-sm mt-2">{d}</div>
          </Card>
        ))}
      </section>

      {/* Progression */}
      <section>
        <Card className="grid md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-1">
            <div className="text-xs uppercase tracking-widest text-slate-500">Ta progression</div>
            <div className="font-serif text-5xl mt-1">Niv. <span className="grad-text">{st.level}</span></div>
            <Progress className="mt-3" value={((st.xp - xpFor(st.level)) / (xpFor(st.level + 1) - xpFor(st.level))) * 100} />
            <div className="text-xs text-slate-500 mt-1 font-mono">{st.xp} / {xpFor(st.level + 1)} XP</div>
          </div>
          <div><div className="text-sm text-slate-400">Cours lu</div><div className="font-serif text-3xl">{Math.round(readPct)}%</div><Progress value={readPct} className="mt-2" /></div>
          <div><div className="text-sm text-slate-400">Flashcards maîtrisées</div><div className="font-serif text-3xl">{st.mastered.length}/{FLASHCARDS.length}</div><Progress value={(st.mastered.length / FLASHCARDS.length) * 100} className="mt-2" /></div>
          <div><div className="text-sm text-slate-400">Succès</div><div className="font-serif text-3xl">{st.unlocked.length}/{ACHIEVEMENTS.length}</div><Progress value={(st.unlocked.length / ACHIEVEMENTS.length) * 100} className="mt-2" color="from-amber-300 to-orange-500" /></div>
        </Card>
      </section>

      {/* Features */}
      <section>
        <div className="text-[11px] tracking-[0.35em] uppercase text-cyan-300/90 font-semibold">Plateforme</div>
        <h2 className="font-serif text-5xl mt-2 mb-8">Tout pour maîtriser τ</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Tilt key={f.k}>
              <button onClick={() => go(f.k)} className="text-left w-full h-full fade-up" style={{ animationDelay: i * 70 + "ms" }}>
                <Card className="h-full spotlight group">
                  <div className="w-12 h-12 rounded-2xl grid place-items-center text-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/20 border border-white/10 group-hover:scale-110 transition-transform">{f.ico}</div>
                  <div className="font-serif text-2xl mt-4">{f.t}</div>
                  <div className="text-slate-400 text-sm mt-1">{f.d}</div>
                  <div className="text-cyan-300 text-sm mt-4 opacity-0 group-hover:opacity-100 transition">Ouvrir →</div>
                </Card>
              </button>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Sommaire */}
      <section>
        <h2 className="font-serif text-4xl mb-6">Table des matières</h2>
        <div className="space-y-2">
          {COURSE.map((c) => (
            <button key={c.id} onClick={() => go("cours")} className="w-full flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-violet-400/30 transition group">
              <span className="font-mono text-cyan-300 w-12">{c.id}</span>
              <span className="font-serif text-2xl flex-1 text-left">{c.title}</span>
              <span className="text-xs text-slate-500">{c.items.length} notions · {c.items.filter((x) => x.proof).length} preuves</span>
              {st.read.includes(c.id) && <span className="text-emerald-300">✓</span>}
              <span className="text-slate-500 group-hover:translate-x-1 transition">→</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
