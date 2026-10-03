import { Mail, Phone, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <p className="text-gold text-xs tracking-[0.28em] uppercase mb-4">Contact</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-sans font-semibold tracking-tight text-4xl md:text-6xl mb-6 leading-tight">
            Have a question? <span className="text-gold">Drop us a line.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-ivory/65 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Tell us about the operation you want to run. We'll scope a custom platform
            that fits it exactly.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="flex justify-center mb-12">
            <a
              href="mailto:alexanderpapacosta@gmail.com"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-navy font-semibold text-lg hover:bg-gold-light transition-colors"
            >
              <Mail className="w-5 h-5" />
              alexanderpapacosta@gmail.com
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <a
              href="tel:+35799164158"
              className="group flex items-center gap-3 text-ivory/60 hover:text-ivory transition-colors"
            >
              <div className="w-10 h-10 border border-white/15 flex items-center justify-center group-hover:border-gold/50 transition-all">
                <Phone className="w-4 h-4 text-gold" />
              </div>
              <div className="text-left">
                <div className="text-xs text-ivory/40 mb-0.5">Call</div>
                <div className="font-medium">+357 99 164 158</div>
              </div>
            </a>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <a
              href="mailto:alexanderpapacosta@gmail.com"
              className="group flex items-center gap-3 text-ivory/60 hover:text-ivory transition-colors"
            >
              <div className="w-10 h-10 border border-white/15 flex items-center justify-center group-hover:border-gold/50 transition-all">
                <Mail className="w-4 h-4 text-gold" />
              </div>
              <div className="text-left">
                <div className="text-xs text-ivory/40 mb-0.5">Email</div>
                <div className="font-medium">alexanderpapacosta@gmail.com</div>
              </div>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
