import { useEffect, useRef, type ReactNode } from "react";
import { useStore } from "../lib/store";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Card({ children, className = "", glow = false, ...p }: any) {
  return (
    <div {...p} className={cx("glass rounded-[28px] p-6 md:p-7 relative", glow && "glow-border", className)}>
      {children}
    </div>
  );
}

export function Btn({ children, onClick, v = "primary", className = "", disabled, size = "md" }: {
  children: ReactNode; onClick?: () => void; v?: "primary" | "ghost" | "outline" | "success" | "danger"; className?: string; disabled?: boolean; size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "px-3.5 py-1.5 text-sm", md: "px-5 py-2.5", lg: "px-7 py-3.5 text-lg" };
  const vs = {
    primary: "btn-primary text-slate-950 font-semibold",
    ghost: "bg-white/[0.04] hover:bg-white/[0.09] border border-white/10",
    outline: "border border-violet-400/40 text-violet-200 hover:bg-violet-500/10",
    success: "bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/25",
    danger: "bg-rose-500/15 border border-rose-400/40 text-rose-200 hover:bg-rose-500/25",
  };
  return (
    <button disabled={disabled} onClick={onClick}
      className={cx("rounded-2xl transition-all duration-300 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-2 justify-center", sizes[size], vs[v], className)}>
      {children}
    </button>
  );
}

export const Badge = ({ children, color = "violet" }: { children: ReactNode; color?: string }) => {
  const m: Record<string, string> = {
    violet: "bg-violet-500/15 text-violet-200 border-violet-400/30",
    cyan: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
    amber: "bg-amber-500/15 text-amber-200 border-amber-400/30",
    emerald: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    rose: "bg-rose-500/15 text-rose-200 border-rose-400/30",
    slate: "bg-white/5 text-slate-300 border-white/10",
  };
  return <span className={cx("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider font-semibold border", m[color])}>{children}</span>;
};

export function Progress({ value, className = "", color = "from-violet-400 via-fuchsia-400 to-cyan-300" }: { value: number; className?: string; color?: string }) {
  return (
    <div className={cx("h-1.5 rounded-full bg-white/10 overflow-hidden", className)}>
      <div className={cx("h-full rounded-full bg-gradient-to-r transition-all duration-700", color)} style={{ width: Math.max(0, Math.min(100, value)) + "%" }} />
    </div>
  );
}

export function Ring({ value, size = 120, stroke = 9, children }: { value: number; size?: number; stroke?: number; children?: ReactNode }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#22d3ee" /></linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.08)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="url(#rg)" strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

export function SectionTitle({ kicker, title, sub }: { kicker: string; title: ReactNode; sub?: string }) {
  return (
    <div className="mb-8 fade-up">
      <div className="text-[11px] tracking-[0.35em] uppercase text-cyan-300/90 font-semibold">{kicker}</div>
      <h2 className="font-serif text-4xl md:text-5xl mt-2 leading-tight">{title}</h2>
      {sub && <p className="text-slate-400 mt-3 max-w-2xl">{sub}</p>}
    </div>
  );
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={cx("toast-in glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl", t.kind === "ach" ? "border-amber-300/50" : "")}>
          <span className={cx("w-8 h-8 rounded-xl grid place-items-center text-lg", t.kind === "ach" ? "bg-gradient-to-br from-amber-300 to-orange-500 text-slate-900" : "bg-gradient-to-br from-violet-400 to-cyan-300 text-slate-900")}>{t.icon}</span>
          <span className={t.kind === "ach" ? "text-amber-100 font-medium" : "font-mono text-cyan-200"}>{t.text}</span>
        </div>
      ))}
    </div>
  );
}

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm grid place-items-start pt-[12vh] px-4" onClick={onClose}>
      <div className="w-full max-w-2xl mx-auto scale-in" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

// Effet tilt 3D
export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className={cx("transition-transform duration-200 will-change-transform", className)}
      onMouseMove={(e) => {
        const el = ref.current!; const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
        el.style.setProperty("--mx", `${(x + 0.5) * 100}%`); el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
      }}
      onMouseLeave={() => { ref.current!.style.transform = ""; }}>
      {children}
    </div>
  );
}

export function Feedback({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div className={cx("fade-up mt-4 rounded-2xl px-4 py-3 border flex gap-3 items-start", ok ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-100" : "bg-rose-500/10 border-rose-400/30 text-rose-100")}>
      <span className="text-lg leading-none mt-0.5">{ok ? "✓" : "✗"}</span><div>{children}</div>
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs uppercase tracking-widest text-slate-500">{label}</div>
      <div className="font-serif text-3xl mt-1 grad-text">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}
