import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2,
  Globe,
  Users,
  Calculator,
  Bot,
  PhoneCall,
  Ticket,
  Mail,
  BarChart3,
  FolderKanban,
  BookOpen,
  Cpu,
} from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Custom Software",
    desc: "Bespoke programs and platforms built around your exact workflows — no off-the-shelf compromises.",
  },
  {
    icon: Globe,
    title: "Web Scraping",
    desc: "Automated data extraction from any source: directories, SPV registries, government databases, competitors.",
  },
  {
    icon: Users,
    title: "CRM Systems",
    desc: "Full customer relationship platforms with pipeline, contacts, activity tracking, and AI-assisted follow-ups.",
  },
  {
    icon: Cpu,
    title: "HR Systems",
    desc: "End-to-end human resources management: onboarding, payroll, compliance, and country-specific labour law.",
  },
  {
    icon: Calculator,
    title: "Accounting & Billing",
    desc: "Country-specific accounting, invoicing, expense tracking, and financial reporting in a single system.",
  },
  {
    icon: Bot,
    title: "AI Chatbots",
    desc: "Intelligent support and sales bots trained on your knowledge base, embedded in your site or app.",
  },
  {
    icon: PhoneCall,
    title: "AI Call Agents",
    desc: "Fully automated AI voice agents that prospect, qualify, and follow up — 24/7 with zero staff overhead.",
  },
  {
    icon: Ticket,
    title: "Ticketing & Support",
    desc: "Custom helpdesk and ticketing systems tailored to your SLAs, teams, and escalation paths.",
  },
  {
    icon: Mail,
    title: "Cold Email Outreach",
    desc: "Automated cold email sequences powered by scraped prospect data with AI personalization at scale.",
  },
  {
    icon: BarChart3,
    title: "Prospecting & Sales",
    desc: "Lead gen pipelines that scrape, enrich, score, and route prospects directly into your CRM.",
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    desc: "Custom PM systems that fit your delivery model — kanban, sprints, milestones, budgets and more.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    desc: "Internal wikis and AI-searchable knowledge systems so your team always has the right answer.",
  },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-gold text-xs tracking-[0.28em] uppercase mb-4"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sans font-semibold tracking-tight text-4xl md:text-5xl mb-4 leading-tight"
          >
            Create real value with systems built only for you
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-ivory/65 text-lg"
          >
            We don't use templates or boilerplate. Every module is designed from scratch
            for your operations, team, and market.
          </motion.p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8 border border-white/8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="group p-7 bg-navy hover:bg-navy-800 transition-colors duration-300 cursor-default"
            >
              <div className="w-10 h-10 border border-gold/30 flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-semibold text-ivory mb-2">{s.title}</h3>
              <p className="text-sm text-ivory/50 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
