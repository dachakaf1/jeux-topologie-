import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Boxes, Check, Search } from "lucide-react";
import { Btn, Progress, cx } from "../components/ui";
import ProofPlayer from "../components/ProofPlayer";
import ThreeVisual from "../components/ThreeVisual";
import { COURSE, type Item } from "../data";
import { SCENE_CONFIG } from "../lib/sceneConfig";
import { useStore } from "../lib/store";

const kindColor = (kind: string) =>
  /Théorème/.test(kind) ? "theorem" :
  /Proposition|Propriét|Corollaire/.test(kind) ? "property" :
  /Exemple|Remarque/.test(kind) ? "example" : "definition";

function ItemCard({ it, i }: { it: Item; i: number }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const config = SCENE_CONFIG[it.kind];

  return (
    <article className={`lesson-card lesson-${kindColor(it.kind)} fade-up`} style={{ animationDelay: `${Math.min(i * 35, 240)}ms` }} id={it.kind}>
      <div className="lesson-card-grid">
        <div className="lesson-copy">
          <div className="lesson-kind"><span />{it.kind}</div>
          <h3>{it.title}</h3>
          <div className="lesson-body math-body">{it.body}</div>
          {it.proof && (
            <div className="lesson-proof">
              {!open ? (
                <button className="proof-reveal" onClick={() => { setStep(1); setOpen(true); }} type="button">
                  <span className="proof-play">▶</span>
                  Voir la démonstration
                  <span className="proof-reveal-detail">{it.proof.length} étapes en 3D</span>
                </button>
              ) : (
                <>
                  <ProofPlayer steps={it.proof} step={step} setStep={setStep} />
                  <button className="proof-hide" onClick={() => setOpen(false)} type="button">Masquer la démonstration</button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="lesson-visual">
          {config && <ThreeVisual config={config} proofStep={open ? step : 0} proofLength={it.proof?.length} />}
        </div>
      </div>
    </article>
  );
}

export default function Course() {
  const { markRead, read } = useStore();
  const [ch, setCh] = useState(0);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("Tout");
  const c = COURSE[ch];

  useEffect(() => {
    const timer = window.setTimeout(() => markRead(c.id), 4000);
    return () => window.clearTimeout(timer);
  }, [c.id, markRead]);

  const items = useMemo(() => c.items.filter((it) =>
    (filter === "Tout" || (filter === "Définitions" && /Définition/.test(it.kind)) || (filter === "Théorèmes" && /Théorème|Proposition|Propriét|Corollaire/.test(it.kind)) || (filter === "Exemples" && /Exemple|Remarque/.test(it.kind)) || (filter === "Preuves" && it.proof))
    && (q === "" || (it.title + it.body + it.kind).toLowerCase().includes(q.toLowerCase()))), [c, q, filter]);

  const changeChapter = (index: number) => {
    setCh(index);
    setQ("");
    setFilter("Tout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="course-page">
      <div className="course-intro fade-up">
        <div className="course-kicker"><span /> LE COURS, EN TROIS DIMENSIONS</div>
        <h2>Voir la topologie <em>autrement.</em></h2>
        <p>Chaque notion prend forme. Explorez les modèles 3D et suivez les démonstrations, une étape à la fois.</p>
        <div className="course-intro-meta"><Boxes size={16} /> Chapitre 1 <span>·</span> Espaces topologiques <span>·</span> Iliass Errouifi</div>
      </div>

      <div className="course-layout">
        <aside className="course-aside">
          <div className="course-aside-label">SOMMAIRE DU CHAPITRE <span>01</span></div>
          <nav aria-label="Sections du cours" className="course-sections">
            {COURSE.map((section, index) => (
              <button key={section.id} onClick={() => changeChapter(index)} className={cx("course-section", index === ch && "course-section-active")}>
                <span className="course-section-number">{section.id}</span>
                <span className="course-section-title">{section.title}</span>
                {read.includes(section.id) && <Check size={13} className="course-section-check" />}
              </button>
            ))}
          </nav>
          <div className="course-reading">
            <div><span>Progression de lecture</span><strong>{read.length} / {COURSE.length}</strong></div>
            <Progress value={(read.length / COURSE.length) * 100} />
          </div>
        </aside>

        <div className="course-content">
          <div className="course-content-heading">
            <div>
              <div className="course-section-kicker">SECTION {c.id} <span /> COURS INTERACTIF</div>
              <h3>{c.title}</h3>
            </div>
            <div className="course-3d-note"><Boxes size={16} /><span>Modèles 3D<br /><small>à manipuler librement</small></span></div>
          </div>

          <div className="course-tools">
            <div className="course-search">
              <Search size={16} />
              <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Rechercher dans la section" aria-label="Rechercher dans la section" />
            </div>
            <div className="course-filters" aria-label="Filtrer les notions">
              {["Tout", "Définitions", "Théorèmes", "Exemples", "Preuves"].map((name) => (
                <button key={name} type="button" onClick={() => setFilter(name)} aria-pressed={filter === name}>{name}</button>
              ))}
            </div>
          </div>

          <div className="course-items" key={ch + filter}>
            {items.map((item, i) => <ItemCard key={item.kind + item.title} it={item} i={i} />)}
            {items.length === 0 && <div className="course-empty">Aucune notion ne correspond à votre recherche.</div>}
          </div>

          <div className="course-pagination">
            <Btn v="ghost" disabled={ch === 0} onClick={() => changeChapter(ch - 1)}><ArrowLeft size={15} /> Section précédente</Btn>
            <Btn disabled={ch === COURSE.length - 1} onClick={() => changeChapter(ch + 1)}>Section suivante <ArrowRight size={15} /></Btn>
          </div>
        </div>
      </div>
    </div>
  );
}