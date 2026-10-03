import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const links = [
  { label: "Industries", href: "#industries" },
  { label: "Capabilities", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy/90 backdrop-blur-xl border-b border-white/8"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" aria-label="TechFlows home">
          <Logo />
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] tracking-wide text-ivory/70 hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a
            href="mailto:alexanderpapacosta@gmail.com"
            className="px-5 py-2 text-[13px] font-semibold tracking-wide bg-gold text-navy hover:bg-gold-light transition-colors"
          >
            Let's connect
          </a>
        </div>

        <button
          className="lg:hidden text-ivory/70 hover:text-ivory"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden overflow-hidden bg-navy/95 backdrop-blur-xl border-b border-white/8"
      >
        <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-ivory/80 hover:text-gold transition-colors py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:alexanderpapacosta@gmail.com"
            className="mt-2 px-5 py-2.5 text-sm font-semibold bg-gold text-navy text-center"
          >
            Let's connect
          </a>
        </div>
      </motion.div>
    </motion.header>
  );
}
