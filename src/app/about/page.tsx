"use client";
import ScrollReveal from "@/components/ScrollReveal";

export default function AboutPage() {
  return (
    <div className="p-10 max-w-3xl">
      <h1 className="text-2xl font-extrabold text-navy mb-6">About This Dashboard</h1>

      <ScrollReveal>
        <section className="mb-8">
          <h2 className="text-sm font-bold text-dark-blue mb-2">Project Overview</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            This interactive dashboard presents findings from a scoping review examining the application
            of artificial intelligence and machine learning in antimicrobial resistance (AMR) research.
            The review followed the Arksey &amp; O&apos;Malley (2005) framework and adheres to PRISMA-ScR
            reporting guidelines (Tricco et al. 2018).
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <section className="mb-8">
          <h2 className="text-sm font-bold text-dark-blue mb-2">Methodology</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            272 studies were screened for eligibility. Each included study underwent independent dual-reviewer
            data extraction across 10 domains using a standardised extraction form with 90+ data items.
            A Lead Reviewer resolved discrepancies to produce consensus data. AI-assisted extraction
            (Claude Haiku) was used for efficiency, with human oversight at all decision points.
          </p>
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center my-4">
            <div className="text-xs font-semibold text-navy mb-3">Study Selection Flow</div>
            <div className="flex items-center justify-center gap-3 text-xs">
              <div className="bg-navy text-white px-4 py-2 rounded-lg font-bold">272<br/><span className="font-normal text-[10px]">Screened</span></div>
              <div className="text-gray-300">&rarr;</div>
              <div className="bg-teal text-white px-4 py-2 rounded-lg font-bold">252<br/><span className="font-normal text-[10px]">Included</span></div>
              <div className="text-gray-300">+</div>
              <div className="bg-danger text-white px-4 py-2 rounded-lg font-bold">20<br/><span className="font-normal text-[10px]">Excluded</span></div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <section className="mb-8">
          <h2 className="text-sm font-bold text-dark-blue mb-2">Scope</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The review covers <strong>any use of AI/ML in AMR research</strong>, including resistance prediction,
            diagnosis, treatment outcomes, drug discovery (antimicrobial peptide design), dosing optimisation,
            prescribing support, surveillance, antibiotic resistance gene annotation, species identification,
            and outbreak forecasting. Viral resistance (HIV, SARS-CoV-2) was excluded.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <section className="mb-8">
          <h2 className="text-sm font-bold text-dark-blue mb-2">How to Cite</h2>
          <div className="bg-light-blue/30 border border-light-blue rounded-lg p-4 text-sm text-navy">
            [Author names]. Application of Artificial Intelligence in Antimicrobial Resistance Research:
            A Scoping Review. [Year]. Interactive Dashboard available at:
            https://olatechie.github.io/amr-ai-dashboard/
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
}
