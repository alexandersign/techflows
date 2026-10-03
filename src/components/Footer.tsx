import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo />
        <p className="text-sm text-ivory/40 text-center">
          © {new Date().getFullYear()} TechFlows. AI-native systems built only for your
          business.
        </p>
        <div className="flex gap-6 text-sm text-ivory/45">
          <a
            href="mailto:alexanderpapacosta@gmail.com"
            className="hover:text-gold transition-colors"
          >
            Email
          </a>
          <a href="tel:+35799164158" className="hover:text-gold transition-colors">
            +357 99 164 158
          </a>
        </div>
      </div>
    </footer>
  );
}
