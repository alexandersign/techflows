import Reveal from "./Reveal";

const industries = [
  { name: "Energy & resources", note: "SPVs, solar, registries, director mapping" },
  { name: "Finance & accounting", note: "Country-specific books, billing, close" },
  { name: "HR & workforce", note: "Onboarding, payroll, labour-law workflows" },
  { name: "Sales & CRM", note: "Prospecting, pipelines, AI follow-up" },
  { name: "Professional services", note: "Delivery, ticketing, knowledge bases" },
  { name: "Real estate & construction", note: "Projects, vendors, field operations" },
  { name: "Logistics & supply chain", note: "Tracking, partners, exception handling" },
  { name: "Technology & scale-ups", note: "Internal systems that grow with you" },
];

export default function Industries() {
  return (
    <section id="industries" className="py-24 lg:py-32 border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
        <div>
          <Reveal>
            <p className="text-gold text-xs tracking-[0.28em] uppercase mb-4">Industries</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-sans font-semibold tracking-tight text-4xl md:text-5xl leading-tight mb-5">
              Move your industry forward
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-ivory/65 text-lg leading-relaxed max-w-md">
              We don't sell a generic stack. We build the operating system for how your
              sector actually works — from energy SPVs to sales teams and country-specific
              finance.
            </p>
          </Reveal>
        </div>

        <div className="divide-y divide-white/8 border-t border-b border-white/8">
          {industries.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.04}>
              <a
                href="#services"
                className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-5 hover:bg-white/[0.02] transition-colors px-1"
              >
                <span className="text-xl md:text-2xl font-sans font-semibold group-hover:text-gold transition-colors">
                  {item.name}
                </span>
                <span className="text-sm text-ivory/45 group-hover:text-ivory/70 transition-colors">
                  {item.note}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
