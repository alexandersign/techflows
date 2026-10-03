import { GraduationCap, Cpu, TrendingUp, Globe2 } from "lucide-react";
import Reveal from "./Reveal";

const credentials = [
  { icon: GraduationCap, label: "CS50 Harvard graduate" },
  { icon: Cpu, label: "AI-native builder" },
  { icon: TrendingUp, label: "$300K → $50M in 12 months" },
  { icon: Globe2, label: "Business, crypto and AI projects launched" },
];

export default function Founder() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-navy-800/30">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Reveal>
            <p className="text-gold text-xs tracking-[0.28em] uppercase mb-4">Leadership</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-sans font-semibold tracking-tight text-4xl md:text-5xl mb-4">
              Alexander <span className="text-gold">Papacosta</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-ivory/65 text-lg mb-6 leading-relaxed">
              I've spent years building AI-native systems that actually run businesses —
              not just dashboards. From scaling a company from $300K to $50M in one year
              with the right systems stack, to launching multiple AI, crypto and SaaS
              projects, I know what works at every stage of growth.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="text-ivory/55 mb-10 leading-relaxed">
              At TechFlows we apply that experience to the system your business
              specifically needs — not a generic product tweaked to fit.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {credentials.map((c, i) => (
              <Reveal key={c.label} delay={0.3 + i * 0.06}>
                <div className="flex items-center gap-3 p-3.5 border border-white/8 hover:border-gold/30 transition-colors">
                  <div className="w-8 h-8 border border-gold/25 flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-4 h-4 text-gold" />
                  </div>
                  <span className="text-sm text-ivory/80">{c.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal direction="right">
          <div className="overflow-hidden border border-white/10 aspect-[4/5] bg-navy">
            <img
              src="/founder-portrait.jpg"
              alt="Alexander Papacosta — Founder, TechFlows"
              className="w-full h-full object-cover object-[center_18%]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
