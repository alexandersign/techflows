import {
  getCustomization,
  getPreset,
  getProjectType,
  type Customization,
} from "@/quote/catalog";
import {
  formatDate,
  formatMoney,
  formatWeeks,
  quoteSummary,
  quoteTitle,
  validUntil,
  type ShareQuote,
} from "@/quote/model";

const PHASES = [
  "Kickoff, the workflow, and the data you already have.",
  "Build the system around the scope in this quote.",
  "Handover, one round of revisions, and your team using it.",
];

function phaseWhen(weeks: number, index: number): string {
  const last = Number.isInteger(weeks) ? String(weeks) : String(weeks);
  if (index === 0) return "Week 1";
  if (index === 2) return `Week ${last}`;
  const midEnd = Math.max(2, Math.floor(weeks - 1));
  return midEnd <= 2 ? "Week 2" : `Weeks 2–${midEnd}`;
}

export default function QuoteDocument({ quote }: { quote: ShareQuote }) {
  const preset = getPreset(quote.presetId);
  const project = getProjectType(quote.projectType);
  const lines = quote.customizationIds
    .map((id) => getCustomization(id))
    .filter((item): item is Customization => Boolean(item));
  const included = new Set(preset.id === "custom" ? [] : preset.customizationIds);
  const until = validUntil(quote);
  const half = quote.budget / 2;
  const person =
    quote.client && quote.company && quote.client !== quote.company ? quote.client : "";

  return (
    <article className="mx-auto max-w-3xl border border-navy/10 bg-ivory text-navy">
      <header className="bg-navy px-8 py-10 text-ivory md:px-12">
        <p className="text-[15px] font-semibold tracking-[0.22em] uppercase">TechFlows</p>
        <p className="mt-10 text-xs tracking-[0.28em] uppercase text-gold">Quote {quote.ref}</p>
        <h1 className="mt-3 font-semibold tracking-tight text-4xl md:text-5xl">{quoteTitle(quote)}</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ivory/70">{quoteSummary(quote)}</p>
      </header>

      <div className="px-8 py-10 md:px-12">
        <div className="flex flex-col gap-8 border-b border-navy/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-gold">Prepared for</p>
            <p className="mt-2 text-2xl font-semibold">
              {quote.company || quote.client || "Your company"}
            </p>
            {person && <p className="mt-1 text-navy/70">{person}</p>}
            {quote.city && <p className="mt-1 text-navy/55">{quote.city}</p>}
          </div>
          <div className="text-sm text-navy/60 sm:text-right">
            <p>{project.label}</p>
            {quote.issued && <p className="mt-1">Issued {formatDate(quote.issued)}</p>}
            {until && <p className="mt-1">Valid until {until}</p>}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xs tracking-[0.22em] uppercase text-navy/45">Scope</h2>
          {lines.length > 0 ? (
            <ul className="mt-4">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 border-t border-navy/10 py-4">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" />
                  <div>
                    <p className="font-semibold">
                      {line.label}
                      {!included.has(line.id) && preset.id !== "custom" && (
                        <span className="ml-2 text-xs font-medium tracking-[0.14em] uppercase text-gold">
                          Added
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-navy/65">{line.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 leading-relaxed text-navy/70">
              The workflow is scoped with you before kickoff. This quote fixes the timeline and the
              investment for that build.
            </p>
          )}
        </section>

        <section className="mt-10 grid gap-8 border-t border-navy/10 pt-8 sm:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-navy/45">Timeline</p>
            <p className="mt-2 text-3xl font-semibold">
              {quote.weeks > 0 ? formatWeeks(quote.weeks) : "To confirm"}
            </p>
            <p className="mt-2 text-sm text-navy/60">From kickoff to handover.</p>
          </div>
          <div className="border-l-0 sm:border-l-2 sm:border-gold sm:pl-6">
            <p className="text-xs tracking-[0.22em] uppercase text-navy/45">Investment</p>
            <p className="mt-2 text-3xl font-semibold">
              {quote.budget > 0 ? formatMoney(quote.budget, quote.currency) : "To confirm"}
            </p>
            {quote.budget > 0 && (
              <p className="mt-2 text-sm leading-relaxed text-navy/65">
                {formatMoney(half, quote.currency)} to start. {formatMoney(half, quote.currency)} on
                handover.
              </p>
            )}
          </div>
        </section>

        {quote.weeks >= 3 && (
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {PHASES.map((text, index) => (
              <li key={text} className="border border-navy/10 p-4">
                <p className="text-xs tracking-[0.16em] uppercase text-gold">
                  {phaseWhen(quote.weeks, index)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-navy/75">{text}</p>
              </li>
            ))}
          </ol>
        )}

        {quote.note.trim() && (
          <section className="mt-10 border-t border-navy/10 pt-8">
            <h2 className="text-xs tracking-[0.22em] uppercase text-navy/45">Notes</h2>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed text-navy/80">{quote.note}</p>
          </section>
        )}

        <footer className="mt-12 border-t border-navy/10 pt-8">
          <p className="font-semibold">Alexander Papacosta</p>
          <p className="mt-1 text-sm text-navy/60">TechFlows · Limassol</p>
          <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
            <a className="text-navy underline decoration-gold/60 underline-offset-4" href={`mailto:alexanderpapacosta@gmail.com?subject=${encodeURIComponent(`Quote ${quote.ref}`)}`}>
              alexanderpapacosta@gmail.com
            </a>
            <a className="text-navy underline decoration-gold/60 underline-offset-4" href="tel:+35799164158">
              +357 99 164 158
            </a>
            <a
              className="text-navy underline decoration-gold/60 underline-offset-4"
              href={`https://wa.me/35799164158?text=${encodeURIComponent(`About quote ${quote.ref}`)}`}
            >
              WhatsApp
            </a>
          </div>
        </footer>
      </div>
    </article>
  );
}
