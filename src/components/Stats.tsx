import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Reveal from "./Reveal";

function Counter({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const duration = 2000;
    const interval = 16;
    const totalSteps = duration / interval;
    const increment = to / totalSteps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [inView, to]);

  const display =
    count >= 1_000_000
      ? `${(count / 1_000_000).toFixed(0)}M`
      : count >= 1_000
        ? `${(count / 1_000).toFixed(0)}K`
        : count;

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 50_000_000, prefix: "$", suffix: "+", label: "Client revenue enabled in year two" },
  { value: 300_000, prefix: "$", suffix: "", label: "Starting point in year one" },
  { value: 12, prefix: "", suffix: "+", label: "AI-native platforms in production" },
  { value: 5, prefix: "", suffix: "x", label: "Typical operating leverage" },
];

export default function Stats() {
  return (
    <section className="relative py-16 border-y border-white/8 bg-navy-800/40">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div>
              <div className="font-sans font-semibold tracking-tight text-4xl md:text-5xl text-gold mb-2">
                <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-sm text-ivory/50 leading-snug">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
