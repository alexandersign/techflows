export default function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src="/logo-mark.jpg"
        alt=""
        className="h-9 w-9 rounded-md object-cover border border-gold/20"
      />
      <span className="text-[15px] font-semibold tracking-[0.22em] uppercase text-ivory">
        TechFlows
      </span>
    </span>
  );
}
