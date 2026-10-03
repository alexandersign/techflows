import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 scale-110">
        <img
          src="/hero-corporate.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/30" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 pt-36 pb-24 w-full">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gold text-xs tracking-[0.28em] uppercase mb-6"
        >
          AI-native business systems
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="font-sans font-semibold tracking-tight text-5xl md:text-7xl lg:text-[5.4rem] leading-[1.05] max-w-4xl mb-8"
        >
          Technology is our how.
          <br />
          Your <em className="text-gold not-italic">operation</em> is our why.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18 }}
          className="text-lg md:text-xl text-ivory/70 max-w-2xl mb-10 leading-relaxed"
        >
          We design and build the CRM, HR, accounting, prospecting and support systems
          your business actually runs on — custom software, AI agents and country-specific
          operations, with no templates and no off-the-shelf compromise.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.28 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="mailto:alexanderpapacosta@gmail.com"
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold text-navy font-semibold hover:bg-gold-light transition-colors"
          >
            Let's connect
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="tel:+35799164158"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-ivory/20 text-ivory hover:border-gold/60 transition-colors"
          >
            <Phone className="w-4 h-4 text-gold" />
            +357 99 164 158
          </a>
        </motion.div>
      </div>
    </section>
  );
}
