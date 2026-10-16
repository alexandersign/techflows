import { useMemo } from "react";
import { useParams } from "react-router-dom";
import QuoteDocument from "@/components/QuoteDocument";
import { decodeShare } from "@/quote/model";
import { useNoIndex } from "@/quote/useNoIndex";

export default function QuotePage() {
  const { token = "" } = useParams();
  const quote = useMemo(() => decodeShare(token), [token]);
  useNoIndex(quote ? `Quote ${quote.ref} — TechFlows` : "Quote — TechFlows");

  if (!quote) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory px-6 text-navy">
        <div className="max-w-md text-center">
          <p className="text-xs tracking-[0.22em] uppercase text-gold">TechFlows</p>
          <h1 className="mt-4 text-3xl font-semibold">This quote link is not valid.</h1>
          <p className="mt-3 text-navy/65">Ask TechFlows for a new link.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#e7e1d4] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto mb-6 flex max-w-3xl justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="border border-navy/15 bg-ivory px-4 py-2 text-sm text-navy"
        >
          Print
        </button>
      </div>
      <QuoteDocument quote={quote} />
    </main>
  );
}
