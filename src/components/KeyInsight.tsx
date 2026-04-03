import ScrollReveal from "./ScrollReveal";

export default function KeyInsight({ children }: { children: React.ReactNode }) {
  return (
    <ScrollReveal>
      <div className="max-w-3xl mx-auto my-10 px-6">
        <div className="text-[10px] uppercase tracking-[3px] text-med-blue font-bold mb-2">Key Insight</div>
        <div className="text-xl font-bold text-navy leading-snug">{children}</div>
      </div>
    </ScrollReveal>
  );
}
