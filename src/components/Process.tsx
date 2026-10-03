import Reveal from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Discover",
    desc: "We map every workflow, pain point and growth target. That becomes the blueprint.",
  },
  {
    number: "02",
    title: "Design & build",
    desc: "Every module is built from scratch — no templates, no tools duct-taped together.",
  },
  {
    number: "03",
    title: "Automate",
    desc: "Chatbots, call agents, scraping pipelines and workflows replace the manual work.",
  },
  {
    number: "04",
    title: "Evolve",
    desc: "We keep adding modules as you grow. You are never locked into a generic stack.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="text-gold text-xs tracking-[0.28em] uppercase mb-4">How we work</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-sans font-semibold tracking-tight text-4xl md:text-5xl mb-4 leading-tight max-w-3xl">
            From idea to a fully automated system
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-ivory/65 text-lg max-w-2xl mb-16">
            A clear path from operational chaos to an AI-native operation that runs
            the way your business actually works.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 border border-white/8">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1}>
              <div className="p-8 bg-navy h-full hover:bg-navy-800 transition-colors">
                <div className="font-sans font-semibold text-4xl text-gold mb-6">{step.number}</div>
                <h3 className="text-lg font-semibold text-ivory mb-3">{step.title}</h3>
                <p className="text-sm text-ivory/50 leading-relaxed">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
