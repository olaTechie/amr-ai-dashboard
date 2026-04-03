import ScrollReveal from "./ScrollReveal";

export default function GlassCard({ label, value, detail, delay = 0 }: { label: string; value: string; detail: string; delay?: number }) {
  return (
    <ScrollReveal delay={delay}>
      <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow">
        <div className="text-[9px] uppercase tracking-[1.5px] text-med-blue font-semibold">{label}</div>
        <div className="text-xl font-extrabold text-navy mt-1">{value}</div>
        <div className="text-[10px] text-gray-500 mt-1">{detail}</div>
      </div>
    </ScrollReveal>
  );
}
