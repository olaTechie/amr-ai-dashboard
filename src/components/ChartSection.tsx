import ScrollReveal from "./ScrollReveal";

interface Props {
  figure: string;
  title: string;
  caption?: string;
  children: React.ReactNode;
}

export default function ChartSection({ figure, title, caption, children }: Props) {
  return (
    <ScrollReveal delay={0.05}>
      <figure className="h-full bg-white p-5 shadow-sm ring-1 ring-gray-200 md:p-6">
        <figcaption className="mb-3 text-xs font-semibold text-navy"><span className="text-med-blue">{figure}</span> · {title}</figcaption>
        <div className="h-72 min-w-0">{children}</div>
        {caption && <div className="mt-3 text-center text-[10px] italic leading-relaxed text-gray-400">{caption}</div>}
      </figure>
    </ScrollReveal>
  );
}
