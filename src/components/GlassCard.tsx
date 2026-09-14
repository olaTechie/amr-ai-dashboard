import ScrollReveal from "./ScrollReveal";

export default function GlassCard({ label, value, detail, delay = 0 }: { label: string; value: string; detail: string; delay?: number }) {
  return (
    <ScrollReveal delay={delay}>
      <div className="h-full border-t-2 border-teal bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <div className="text-[9px] font-semibold uppercase tracking-[1.5px] text-med-blue">{label}</div>
        <div className="mt-2 line-clamp-2 text-lg font-extrabold leading-tight text-navy" title={value}>{value}</div>
        <div className="mt-2 text-[10px] text-gray-500">{detail}</div>
      </div>
    </ScrollReveal>
  );
}
