import ScrollReveal from "./ScrollReveal";

interface Props {
  figure: string;
  title: string;
  caption?: string;
  children: React.ReactNode;
}

export default function ChartSection({ figure, title, caption, children }: Props) {
  return (
    <ScrollReveal delay={0.1}>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="text-xs font-semibold text-navy mb-3">{figure}. {title}</div>
        <div className="h-72">{children}</div>
        {caption && <div className="text-[10px] text-gray-400 italic mt-3 text-center">{caption}</div>}
      </div>
    </ScrollReveal>
  );
}
