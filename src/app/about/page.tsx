"use client";

import ScrollReveal from "@/components/ScrollReveal";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl p-5 md:p-10">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-med-blue">Project information</div>
        <h1 className="mt-1 text-2xl font-extrabold text-navy">About this evidence dashboard</h1>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-gray-600">
        <ScrollReveal><section><h2 className="mb-2 text-base font-bold text-navy">Purpose</h2><p>This read-only dashboard presents the study-level findings of a scoping review examining applications of artificial intelligence and machine learning in antimicrobial resistance research. It is designed for transparent exploration rather than causal inference or direct comparison of model performance.</p></section></ScrollReveal>

        <ScrollReveal delay={0.05}><section><h2 className="mb-2 text-base font-bold text-navy">Current data release</h2><div className="grid grid-cols-1 gap-px bg-gray-200 ring-1 ring-gray-200 sm:grid-cols-3"><div className="bg-white p-5"><div className="text-2xl font-extrabold text-navy">346</div><div className="text-[10px] uppercase tracking-wide text-gray-400">Validated studies</div></div><div className="bg-white p-5"><div className="text-2xl font-extrabold text-med-blue">215</div><div className="text-[10px] uppercase tracking-wide text-gray-400">Extraction fields</div></div><div className="bg-white p-5"><div className="text-2xl font-extrabold text-teal">2000–2026</div><div className="text-[10px] uppercase tracking-wide text-gray-400">Publication years</div></div></div></section></ScrollReveal>

        <ScrollReveal delay={0.1}><section><h2 className="mb-2 text-base font-bold text-navy">Data provenance and interpretation</h2><p>The dashboard is generated from <code className="bg-gray-100 px-1 text-xs text-navy">extraction_run/collated.csv</code>. Dashboard categories are derived reproducibly from the original extraction fields; the Study Explorer preserves every populated source value. Counts can differ between figures because reporting completeness varies, and multivalue fields allow one study to contribute to more than one category. “Not reported” is not interpreted as “No”.</p></section></ScrollReveal>

        <ScrollReveal delay={0.15}><section><h2 className="mb-2 text-base font-bold text-navy">Scope</h2><p>The review covers uses of AI/ML across resistance prediction, diagnostic and laboratory interpretation, clinical decision support, surveillance, treatment outcomes, drug discovery and related AMR applications. The dashboard should be cited alongside the review manuscript and extraction methods.</p></section></ScrollReveal>

        <ScrollReveal delay={0.2}><section><h2 className="mb-2 text-base font-bold text-navy">Download</h2><a className="inline-flex min-h-11 items-center bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-dark-blue" href="../data/collated.csv" download>Download collated CSV</a></section></ScrollReveal>
      </div>
    </div>
  );
}
