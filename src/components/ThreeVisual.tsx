import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { createPortal } from "react-dom";
import { Expand, Hand, Maximize2, Minus, Pause, Play, Plus, RotateCcw, X } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { buildScene } from "../lib/threeScenes";
import type { SceneConfig } from "../lib/sceneConfig";

type Controls = { zoom: (factor: number) => void; rotate: (horizontal: number, vertical: number) => void; reset: () => void };

function ThreeCanvas({
  config,
  focus,
  playing,
  controlsRef,
}: {
  config: SceneConfig;
  focus: string[];
  playing: boolean;
  controlsRef: MutableRefObject<Controls | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef(focus);
  const playingRef = useRef(playing);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "unsupported">("loading");
  focusRef.current = focus;
  playingRef.current = playing;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!visible || !container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      setStatus("unsupported");
      return;
    }

    let model: ReturnType<typeof buildScene>;
    try {
      model = buildScene(config.kind, config);
    } catch (error) {
      console.error("Impossible de charger le modèle 3D", error);
      renderer.dispose();
      renderer.forceContextLoss();
      setStatus("unsupported");
      return;
    }
    const { scene, camera } = model;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.autoRotateSpeed = 0.75;
    controls.minDistance = 4;
    controls.maxDistance = 12;
    controls.saveState();

    // Keep normal page scrolling on the mouse wheel, while retaining pinch-to-zoom.
    const allowPageScroll = (event: WheelEvent) => event.stopImmediatePropagation();
    renderer.domElement.addEventListener("wheel", allowPageScroll, { capture: true, passive: true });

    controlsRef.current = {
      zoom: (factor) => {
        const offset = camera.position.clone().sub(controls.target);
        const distance = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
        camera.position.copy(controls.target).add(offset.setLength(distance));
        controls.update();
      },
      rotate: (horizontal, vertical) => {
        controls.rotateLeft(horizontal);
        controls.rotateUp(vertical);
        controls.update();
      },
      reset: () => controls.reset(),
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (config.layout === "hero") {
        const root = scene.getObjectByName("concept-model");
        if (root) {
          root.position.x = camera.aspect > 1.1 ? Math.min(2.2, camera.aspect * 0.95) : 0;
          root.position.y = camera.aspect > 1.1 ? 0 : -1.45;
          root.scale.setScalar(camera.aspect > 1.1 ? 1 : 0.62);
        }
      }
      renderer.setSize(width, height, false);
    };
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(container);
    window.addEventListener("resize", resize);
    resize();
    setStatus("ready");

    let previous = 0;
    let animationTime = 0;
    renderer.setAnimationLoop((now: number) => {
      const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0.016;
      previous = now;
      if (playingRef.current) animationTime += delta;
      controls.autoRotate = playingRef.current;
      controls.update(delta);
      model.update(animationTime, delta, focusRef.current);
      renderer.render(scene, camera);
    });

    return () => {
      controlsRef.current = null;
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      renderer.setAnimationLoop(null);
      controls.dispose();
      renderer.domElement.removeEventListener("wheel", allowPageScroll, true);
      model.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [visible, config, controlsRef]);

  return (
    <div
      ref={containerRef}
      className="three-canvas"
      role="img"
      tabIndex={0}
      aria-label={`Visualisation 3D : ${config.title}. ${config.description} Utilisez les flèches pour tourner et les touches plus et moins pour zoomer.`}
      onKeyDown={(event) => {
        const rotations: Record<string, [number, number]> = {
          ArrowLeft: [0.2, 0], ArrowRight: [-0.2, 0], ArrowUp: [0, 0.2], ArrowDown: [0, -0.2],
        };
        if (rotations[event.key]) {
          event.preventDefault();
          controlsRef.current?.rotate(...rotations[event.key]);
        } else if (event.key === "+" || event.key === "=") {
          event.preventDefault();
          controlsRef.current?.zoom(0.8);
        } else if (event.key === "-") {
          event.preventDefault();
          controlsRef.current?.zoom(1.25);
        }
      }}
    >
      {visible && status === "loading" && <div className="three-loading"><span className="three-spinner" /> Préparation du modèle</div>}
      {status === "unsupported" && (
        <div className="three-fallback">
          <div className="three-fallback-orbit" aria-hidden="true"><span>τ</span></div>
          <p>Le modèle 3D nécessite WebGL 2 sur ce navigateur.</p>
          <p>Le texte et les étapes restent accessibles.</p>
        </div>
      )}
    </div>
  );
}

type ThreeVisualProps = {
  config: SceneConfig;
  proofStep?: number;
  proofLength?: number;
  compact?: boolean;
};

export default function ThreeVisual({ config, proofStep = 0, proofLength = 0, compact = false }: ThreeVisualProps) {
  const [viewIndex, setViewIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(() => !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const controlsRef = useRef<Controls | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const canvasConfig = useMemo(() => expanded && config.layout === "hero" ? { ...config, layout: undefined } : config, [config, expanded]);
  const proofView = proofStep > 0 ? config.proof?.[proofStep - 1] : undefined;
  const selected = proofView ?? config.views[viewIndex] ?? config.views[0];
  const description = proofView ? proofView.description : viewIndex === 0 ? config.description : selected.description;

  useEffect(() => {
    if (!expanded) return;
    const oldOverflow = document.body.style.overflow;
    const oldFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => modalRef.current?.querySelector<HTMLButtonElement>("button")?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]'))
        .filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKey);
      window.requestAnimationFrame(() => (oldFocus?.isConnected ? oldFocus : expandButtonRef.current)?.focus());
    };
  }, [expanded]);

  const visual = (
    <div className={`three-visual ${compact ? "three-visual-compact" : ""} ${expanded ? "three-visual-expanded" : ""}`}>
      <div className="three-stage">
        <ThreeCanvas config={canvasConfig} focus={selected.parts} playing={playing} controlsRef={controlsRef} />
        <div className="three-stage-top">
          <div className="three-live"><span /> MODÈLE 3D</div>
          <div className="three-toolbar" aria-label="Commandes du modèle 3D">
            <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? "Mettre l'animation en pause" : "Lancer l'animation"} title={playing ? "Pause" : "Lecture"}>
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button type="button" onClick={() => controlsRef.current?.zoom(0.8)} aria-label="Agrandir le modèle" title="Zoom avant"><Plus size={15} /></button>
            <button type="button" onClick={() => controlsRef.current?.zoom(1.25)} aria-label="Réduire le modèle" title="Zoom arrière"><Minus size={15} /></button>
            <button type="button" onClick={() => controlsRef.current?.reset()} aria-label="Réinitialiser la vue" title="Réinitialiser"><RotateCcw size={14} /></button>
            <button ref={expandButtonRef} type="button" onClick={() => setExpanded(!expanded)} aria-label={expanded ? "Fermer la vue agrandie" : "Agrandir la visualisation"} title={expanded ? "Fermer" : "Agrandir"}>
              {expanded ? <X size={15} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>
        <div className="three-drag-hint"><Hand size={12} /> Glisser pour tourner</div>
        {proofView && <div className="three-proof-status">PREUVE <span>{String(proofStep).padStart(2, "0")} / {String(proofLength).padStart(2, "0")}</span></div>}
      </div>
      {(!compact || expanded) && (
        <div className="three-caption">
          <div className="three-caption-heading"><span>À OBSERVER</span><strong>{config.title}</strong></div>
          <p className="three-formula">{config.formula}</p>
          <p className="three-description" aria-live="polite">{description}</p>
          <div className="three-legend" aria-label="Légende">
            {config.legend.map((item) => <span key={item.label}><i style={{ backgroundColor: item.color }} />{item.label}</span>)}
          </div>
          {proofView ? (
            <div className="three-sync"><span /> Synchronisé avec l'étape de la preuve</div>
          ) : config.views.length > 1 ? (
            <div className="three-views" aria-label="Explorer les éléments du modèle">
              {config.views.map((item, index) => (
                <button key={item.label} type="button" onClick={() => setViewIndex(index)} aria-pressed={index === viewIndex}>
                  {index === 0 ? "Tout voir" : item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );

  return (
    <>
      {!expanded ? visual : (
        <button className="three-expanded-placeholder" onClick={() => setExpanded(false)} type="button">
          <Expand size={16} /> Visualisation ouverte en grand
        </button>
      )}
      {expanded && createPortal(
        <div className="three-overlay" role="dialog" aria-modal="true" aria-label={`Visualisation agrandie : ${config.title}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setExpanded(false); }}>
          <div ref={modalRef} className="three-modal">
            <div className="three-modal-header">
              <div><span>EXPLORATION INTERACTIVE</span><h3>{config.title}</h3></div>
              <button type="button" onClick={() => setExpanded(false)} aria-label="Fermer la visualisation"><X size={20} /></button>
            </div>
            {visual}
          </div>
        </div>, document.body,
      )}
    </>
  );
}
