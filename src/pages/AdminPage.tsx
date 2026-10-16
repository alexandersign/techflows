import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  LogOut,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import {
  CUSTOMIZATIONS,
  PRESETS,
  PROJECT_TYPES,
  getPreset,
  quoteSuggestion,
} from "@/quote/catalog";
import { isAdminAuthed, loginAdmin, logoutAdmin } from "@/quote/auth";
import {
  blankQuote,
  formatMoney,
  formatWeeks,
  loadQuotes,
  makeRef,
  quoteTitle,
  saveQuotes,
  shareUrl,
  type QuoteRecord,
  type QuoteStatus,
} from "@/quote/model";
import { useNoIndex } from "@/quote/useNoIndex";

const STATUSES: QuoteStatus[] = ["draft", "sent", "accepted", "declined"];

const STATUS_LABEL: Record<QuoteStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
};

const inputClass =
  "w-full border border-white/15 bg-navy px-3 py-2.5 text-sm text-ivory outline-none focus:border-gold/70";
const labelClass = "mb-2 block text-[11px] tracking-[0.18em] uppercase text-ivory/45";

function sumByStatus(quotes: QuoteRecord[], status: QuoteStatus) {
  const rows = quotes.filter((quote) => quote.status === status);
  const eur = rows.filter((quote) => quote.currency === "EUR").reduce((sum, quote) => sum + quote.budget, 0);
  const usd = rows.filter((quote) => quote.currency === "USD").reduce((sum, quote) => sum + quote.budget, 0);
  if (usd && !eur) return formatMoney(usd, "USD");
  if (usd && eur) return `${formatMoney(eur, "EUR")} · ${formatMoney(usd, "USD")}`;
  return formatMoney(eur, "EUR");
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function followUpDue(quote: QuoteRecord) {
  if (!quote.followUp || quote.status === "accepted" || quote.status === "declined") return false;
  return quote.followUp <= todayStamp();
}

export default function AdminPage() {
  useNoIndex("Quotes — TechFlows");
  const [authed, setAuthed] = useState(isAdminAuthed);
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Desk onLogout={() => setAuthed(false)} />;
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-6">
      <form
        className="w-full max-w-sm border border-white/10 p-8"
        onSubmit={(event) => {
          event.preventDefault();
          if (loginAdmin(password)) onSuccess();
          else setError("That password does not open the admin.");
        }}
      >
        <p className="text-xs tracking-[0.28em] uppercase text-gold">TechFlows</p>
        <h1 className="mt-4 text-3xl font-semibold">Quotes</h1>
        <p className="mt-3 text-sm leading-relaxed text-ivory/60">
          Build a quote, then send the unique link. The client does not need this password.
        </p>
        <label className={`${labelClass} mt-8`} htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          className={inputClass}
        />
        {error && <p className="mt-3 text-sm text-gold-light">{error}</p>}
        <button type="submit" className="mt-6 bg-gold px-5 py-2.5 text-sm font-semibold text-navy">
          Enter
        </button>
      </form>
    </main>
  );
}

function Desk({ onLogout }: { onLogout: () => void }) {
  const [quotes, setQuotes] = useState<QuoteRecord[]>(() => loadQuotes());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [locked, setLocked] = useState(true);
  const [notice, setNotice] = useState("");
  const [importError, setImportError] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const draft = quotes.find((quote) => quote.id === selectedId) ?? null;

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [selectedId]);

  function persist(next: QuoteRecord[]) {
    saveQuotes(next);
    setQuotes(next);
  }

  function patch(partial: Partial<QuoteRecord>) {
    if (!draft) return;
    const updated: QuoteRecord = {
      ...draft,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    persist(quotes.map((quote) => (quote.id === draft.id ? updated : quote)));
  }

  function createQuote() {
    const quote = blankQuote();
    persist([quote, ...quotes]);
    setSelectedId(quote.id);
    setLocked(true);
  }

  function selectPreset(presetId: string) {
    if (!draft) return;
    const preset = getPreset(presetId);
    const ids = [...preset.customizationIds];
    const suggested = quoteSuggestion(presetId, ids);
    const custom = preset.id === "custom";
    setLocked(!custom);
    patch({
      presetId,
      projectType: preset.projectType,
      customizationIds: ids,
      weeks: custom ? preset.weeks : suggested.weeks,
      budget: custom ? draft.budget : suggested.price,
    });
  }

  function toggleCustomization(id: string) {
    if (!draft) return;
    const ids = draft.customizationIds.includes(id)
      ? draft.customizationIds.filter((item) => item !== id)
      : [...draft.customizationIds, id];
    const suggested = quoteSuggestion(draft.presetId, ids);
    patch({
      customizationIds: ids,
      ...(locked ? { budget: suggested.price, weeks: suggested.weeks } : {}),
    });
  }

  const visible = quotes.filter((quote) => {
    const haystack = `${quote.company} ${quote.client} ${quote.email} ${quote.ref}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const accepted = sumByStatus(quotes, "accepted");
  const sent = sumByStatus(quotes, "sent");

  return (
    <div className="min-h-screen bg-navy text-ivory">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-gold">TechFlows</p>
          <h1 className="text-lg font-semibold">Quotes</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => downloadQuotes(quotes)} className={ghostButton}>
            <Download className="h-4 w-4" />
            Export
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className={ghostButton}>
            <Upload className="h-4 w-4" />
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              try {
                const parsed = JSON.parse(await file.text()) as unknown;
                if (!Array.isArray(parsed)) throw new Error("Expected a list of quotes.");
                const incoming = parsed.flatMap((item) => {
                  if (!item || typeof item !== "object") return [];
                  const record = item as QuoteRecord;
                  if (typeof record.id !== "string" || typeof record.ref !== "string") return [];
                  return [record];
                });
                const byId = new Map(quotes.map((quote) => [quote.id, quote]));
                for (const quote of incoming) byId.set(quote.id, quote);
                const merged = loadQuotesFrom(Array.from(byId.values()));
                persist(merged);
                setImportError("");
                setNotice(`Imported ${incoming.length} quotes.`);
              } catch {
                setImportError("That file is not a TechFlows quote export.");
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              onLogout();
            }}
            className={ghostButton}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-white/10 lg:max-h-[calc(100vh-65px)] lg:overflow-y-auto lg:border-r lg:border-b-0">
          <div className="border-b border-white/10 p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[11px] tracking-[0.16em] uppercase text-ivory/40">Accepted</p>
                <p className="mt-1 font-semibold text-gold">{accepted}</p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.16em] uppercase text-ivory/40">Sent</p>
                <p className="mt-1 font-semibold">{sent}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={createQuote}
              className="mt-4 flex w-full items-center justify-center gap-2 bg-gold px-4 py-2.5 text-sm font-semibold text-navy"
            >
              <Plus className="h-4 w-4" />
              New quote
            </button>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search company, client, quote"
              className={`${inputClass} mt-3`}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {(["all", ...STATUSES] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`border px-2 py-1 text-[11px] tracking-[0.14em] uppercase ${
                    statusFilter === status
                      ? "border-gold text-gold"
                      : "border-white/15 text-ivory/50"
                  }`}
                >
                  {status === "all" ? "All" : STATUS_LABEL[status]}
                </button>
              ))}
            </div>
            {importError && <p className="mt-3 text-sm text-gold-light">{importError}</p>}
          </div>
          <ul>
            {visible.length === 0 && (
              <li className="px-4 py-8 text-sm text-ivory/45">
                {quotes.length === 0
                  ? "No quotes yet. The first one starts as a Follow-up Desk."
                  : "Nothing in this filter."}
              </li>
            )}
            {visible.map((quote) => (
              <li key={quote.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(quote.id);
                    const suggested = quoteSuggestion(quote.presetId, quote.customizationIds);
                    setLocked(suggested.price === quote.budget && suggested.weeks === quote.weeks);
                  }}
                  className={`w-full border-b border-white/8 px-4 py-4 text-left ${
                    quote.id === selectedId ? "bg-white/5" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate font-medium">
                      {quote.company || quote.client || "Untitled quote"}
                    </span>
                    <span className="shrink-0 text-[11px] tracking-[0.14em] uppercase text-gold">
                      {STATUS_LABEL[quote.status]}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-ivory/50">
                    {quote.ref} · {formatMoney(quote.budget, quote.currency)} · {formatWeeks(quote.weeks)}
                  </span>
                  {followUpDue(quote) && (
                    <span className="mt-2 block text-xs text-gold-light">Follow up due</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div ref={mainRef} className="lg:max-h-[calc(100vh-65px)] lg:overflow-y-auto">
          {draft ? (
            <Editor
              key={draft.id}
              draft={draft}
              locked={locked}
              notice={notice}
              onPatch={patch}
              onLock={setLocked}
              onSelectPreset={selectPreset}
              onToggleCustomization={toggleCustomization}
              onNotice={setNotice}
              onDuplicate={() => {
                const now = new Date().toISOString();
                const copy: QuoteRecord = {
                  ...draft,
                  id: crypto.randomUUID(),
                  ref: makeRef(),
                  status: "draft",
                  createdAt: now,
                  updatedAt: now,
                  issued: now.slice(0, 10),
                };
                persist([copy, ...quotes]);
                setSelectedId(copy.id);
              }}
              onDelete={() => {
                if (!window.confirm(`Delete ${draft.ref}?`)) return;
                persist(quotes.filter((quote) => quote.id !== draft.id));
                setSelectedId(null);
              }}
            />
          ) : (
            <div className="px-8 py-20">
              <h2 className="text-3xl font-semibold">Choose a quote, or start one.</h2>
              <p className="mt-3 max-w-lg text-ivory/60">
                Presets fill the project type, scope, timeline, and budget. The client link
                carries the quote, so it opens on their phone without this login.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function loadQuotesFrom(records: QuoteRecord[]): QuoteRecord[] {
  saveQuotes(records);
  return loadQuotes();
}

function downloadQuotes(quotes: QuoteRecord[]) {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "techflows-quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

const ghostButton =
  "inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-sm text-ivory/80 hover:border-gold/50";

function Editor({
  draft,
  locked,
  notice,
  onPatch,
  onLock,
  onSelectPreset,
  onToggleCustomization,
  onNotice,
  onDuplicate,
  onDelete,
}: {
  draft: QuoteRecord;
  locked: boolean;
  notice: string;
  onPatch: (partial: Partial<QuoteRecord>) => void;
  onLock: (locked: boolean) => void;
  onSelectPreset: (presetId: string) => void;
  onToggleCustomization: (id: string) => void;
  onNotice: (notice: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const preset = getPreset(draft.presetId);
  const suggested = useMemo(
    () => quoteSuggestion(draft.presetId, draft.customizationIds),
    [draft.presetId, draft.customizationIds],
  );
  const matches = suggested.price === draft.budget && suggested.weeks === draft.weeks;
  const packageExtras = CUSTOMIZATIONS.filter(
    (item) =>
      draft.customizationIds.includes(item.id) &&
      preset.id !== "custom" &&
      !preset.customizationIds.includes(item.id),
  );

  async function copyLink() {
    const url = shareUrl(draft);
    try {
      await navigator.clipboard.writeText(url);
      onNotice("");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      onNotice(url);
    }
    if (draft.status === "draft") onPatch({ status: "sent" });
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 md:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.18em] uppercase text-gold">{draft.ref}</p>
          <h2 className="mt-2 text-3xl font-semibold">{quoteTitle(draft)}</h2>
          <p className="mt-2 text-ivory/60">
            {formatWeeks(draft.weeks)} · {formatMoney(draft.budget, draft.currency)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 bg-gold px-4 py-2.5 text-sm font-semibold text-navy">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Link copied" : "Copy client link"}
          </button>
          <button
            type="button"
            onClick={() => window.open(shareUrl(draft), "_blank", "noopener")}
            className={ghostButton}
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </button>
        </div>
      </div>
      {!draft.company && (
        <p className="mt-4 text-sm text-gold-light">Add a company so the quote is addressed.</p>
      )}
      {notice && <p className="mt-4 break-all text-sm text-ivory/70">{notice}</p>}

      <section className="mt-10">
        <h3 className="text-xs tracking-[0.2em] uppercase text-ivory/45">Client</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Company" value={draft.company} onChange={(company) => onPatch({ company })} />
          <Field label="Contact name" value={draft.client} onChange={(client) => onPatch({ client })} />
          <Field label="Email" value={draft.email} onChange={(email) => onPatch({ email })} />
          <Field label="Phone" value={draft.phone} onChange={(phone) => onPatch({ phone })} />
          <Field label="City" value={draft.city} onChange={(city) => onPatch({ city })} />
          <label>
            <span className={labelClass}>Status</span>
            <select
              value={draft.status}
              onChange={(event) => onPatch({ status: event.target.value as QuoteStatus })}
              className={inputClass}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABEL[status]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-xs tracking-[0.2em] uppercase text-ivory/45">Preset</h3>
        <p className="mt-2 text-sm text-ivory/50">
          A preset fills the type, scope, timeline, and budget. You can change any of them after.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PRESETS.map((item) => {
            const active = item.id === draft.presetId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPreset(item.id)}
                className={`border px-4 py-4 text-left ${
                  active ? "border-gold bg-gold/10" : "border-white/10 hover:border-white/30"
                }`}
              >
                <span className="block font-semibold">{item.name}</span>
                <span className="mt-1 block text-sm text-ivory/55">{item.summary}</span>
                <span className="mt-3 block text-sm text-gold">
                  {item.id === "custom"
                    ? "You set the budget"
                    : `${formatMoney(item.price, draft.currency)} · ${formatWeeks(item.weeks)}`}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <label>
          <span className={labelClass}>Project type</span>
          <select
            value={draft.projectType}
            onChange={(event) => onPatch({ projectType: event.target.value })}
            className={inputClass}
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelClass}>Currency</span>
          <select
            value={draft.currency}
            onChange={(event) => onPatch({ currency: event.target.value === "USD" ? "USD" : "EUR" })}
            className={inputClass}
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </label>
      </section>

      <section className="mt-10">
        <h3 className="text-xs tracking-[0.2em] uppercase text-ivory/45">Customisation</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {CUSTOMIZATIONS.map((item) => {
            const checked = draft.customizationIds.includes(item.id);
            const inPackage = preset.id !== "custom" && preset.customizationIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={checked}
                onClick={() => onToggleCustomization(item.id)}
                className={`border px-4 py-3 text-left ${
                  checked ? "border-gold/70" : "border-white/10"
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-medium">{item.label}</span>
                  <span className="shrink-0 text-xs tracking-[0.12em] uppercase text-gold">
                    {inPackage ? "Included" : item.price > 0 ? `+${formatMoney(item.price, draft.currency)}` : "Included"}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-ivory/50">{item.detail}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-xs tracking-[0.2em] uppercase text-ivory/45">Timeline and budget</h3>
        <p className="mt-2 text-sm text-ivory/55">
          {preset.id === "custom"
            ? `Add-ons suggest ${formatMoney(suggested.price, draft.currency)} and ${formatWeeks(suggested.weeks)}.`
            : packageExtras.length === 0
              ? `Package ${formatMoney(preset.price, draft.currency)} · ${formatWeeks(preset.weeks)}.`
              : `Package ${formatMoney(preset.price, draft.currency)} plus ${packageExtras
                  .map((item) => item.label)
                  .join(", ")}. Suggested ${formatMoney(suggested.price, draft.currency)} · ${formatWeeks(suggested.weeks)}.`}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className={labelClass}>Weeks</span>
            <input
              type="number"
              min={0.5}
              max={52}
              step={0.5}
              value={draft.weeks}
              onChange={(event) => {
                onLock(false);
                onPatch({ weeks: Number(event.target.value) || 0 });
              }}
              className={inputClass}
            />
          </label>
          <label>
            <span className={labelClass}>Budget</span>
            <input
              type="number"
              min={0}
              step={100}
              value={draft.budget}
              onChange={(event) => {
                onLock(false);
                onPatch({ budget: Number(event.target.value) || 0 });
              }}
              className={inputClass}
            />
          </label>
        </div>
        {!matches && (
          <button
            type="button"
            onClick={() => {
              onLock(true);
              onPatch({ budget: suggested.price, weeks: suggested.weeks });
            }}
            className="mt-4 text-sm text-gold underline decoration-gold/40 underline-offset-4"
          >
            Use suggestion, {formatMoney(suggested.price, draft.currency)} · {formatWeeks(suggested.weeks)}
          </button>
        )}
        {locked && <p className="mt-3 text-xs text-ivory/40">Timeline and budget follow the preset and add-ons.</p>}
      </section>

      <section className="mt-10 grid gap-4">
        <label>
          <span className={labelClass}>Note on the quote</span>
          <textarea
            value={draft.note}
            maxLength={600}
            rows={4}
            onChange={(event) => onPatch({ note: event.target.value })}
            className={inputClass}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label>
            <span className={labelClass}>Issued</span>
            <input
              type="date"
              value={draft.issued}
              onChange={(event) => onPatch({ issued: event.target.value })}
              className={inputClass}
            />
          </label>
          <label>
            <span className={labelClass}>Valid for days</span>
            <input
              type="number"
              min={1}
              max={90}
              value={draft.validDays}
              onChange={(event) => onPatch({ validDays: Number(event.target.value) || 14 })}
              className={inputClass}
            />
          </label>
          <label>
            <span className={labelClass}>Follow up</span>
            <input
              type="date"
              value={draft.followUp}
              onChange={(event) => onPatch({ followUp: event.target.value })}
              className={inputClass}
            />
          </label>
        </div>
        <label>
          <span className={labelClass}>Internal note</span>
          <textarea
            value={draft.internalNote}
            rows={3}
            onChange={(event) => onPatch({ internalNote: event.target.value })}
            placeholder="Stays in this admin. It is not on the client link."
            className={inputClass}
          />
        </label>
      </section>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-6">
        <button type="button" onClick={onDuplicate} className={ghostButton}>
          Duplicate
        </button>
        <button type="button" onClick={onDelete} className={`${ghostButton} text-gold-light`}>
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
    </label>
  );
}
