import { motion } from "framer-motion";
import {
  Zap,
  Database,
  Users,
  CreditCard,
  Bot,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import Reveal from "./Reveal";

const features = [
  { icon: Database, label: "Auto-scrapes energy SPV companies across Europe" },
  { icon: Users, label: "Extracts directors and decision-makers into a CRM" },
  { icon: Zap, label: "AI-powered pipeline from prospecting to close" },
  { icon: CreditCard, label: "Integrated HR and country-specific accounting" },
  { icon: Bot, label: "AI chatbot for client support and internal queries" },
  { icon: PhoneCall, label: "Automated AI cold-call agents for outreach" },
];

export default function CaseStudy() {
  return (
    <section id="work" className="py-24 lg:py-32 bg-navy-800/30">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="text-gold text-xs tracking-[0.28em] uppercase mb-4">Work</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-sans font-semibold tracking-tight text-4xl md:text-5xl mb-4 leading-tight max-w-3xl">
            Lighthief: a full-stack <span className="text-gold">energy</span> operating
            system
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-ivory/65 text-lg max-w-2xl mb-14 leading-relaxed">
            Built for a European energy company — scrape, qualify, sell, run HR,
            keep country-specific books, and handle client comms with AI.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal direction="left">
            <div className="relative overflow-hidden border border-white/10">
              <img
                src="/lighthief-mockup.png"
                alt="Lighthief CRM Platform Dashboard"
                className="w-full h-auto"
              />
            </div>
          </Reveal>

          <div className="flex flex-col gap-3">
            {features.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.07} direction="right">
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-4 p-4 border border-white/8 hover:border-gold/30 transition-colors"
                >
                  <div className="w-9 h-9 border border-gold/25 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <CheckCircle2 className="w-4 h-4 text-gold/50 flex-shrink-0" />
                    <span className="text-ivory/80 text-sm">{f.label}</span>
                  </div>
                </motion.div>
              </Reveal>
            ))}
            <Reveal delay={0.5}>
              <div className="mt-2 p-5 border-l-2 border-gold bg-gold/5">
                <p className="text-gold-light text-sm leading-relaxed">
                  "TechFlows scaled our pipeline from $300K to $50M in revenue by year
                  two — the platform runs our entire operation automatically."
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
