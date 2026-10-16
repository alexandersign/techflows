import { getPreset, getProjectType } from "@/quote/catalog";

export type Currency = "EUR" | "USD";
export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";

export type ShareQuote = {
  ref: string;
  client: string;
  company: string;
  city: string;
  presetId: string;
  projectType: string;
  customizationIds: string[];
  weeks: number;
  budget: number;
  currency: Currency;
  note: string;
  issued: string;
  validDays: number;
};

export type QuoteRecord = ShareQuote & {
  id: string;
  email: string;
  phone: string;
  internalNote: string;
  followUp: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "tf-quotes-v1";

const STATUSES: QuoteStatus[] = ["draft", "sent", "accepted", "declined"];

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function num(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isStatus(value: unknown): value is QuoteStatus {
  return typeof value === "string" && STATUSES.includes(value as QuoteStatus);
}

export function makeRef(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  let code = "";
  for (const byte of bytes) code += alphabet[byte % alphabet.length];
  return `TF-${new Date().getFullYear()}-${code}`;
}

export function blankQuote(): QuoteRecord {
  const preset = getPreset("follow-up-desk");
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    ref: makeRef(),
    client: "",
    company: "",
    email: "",
    city: "Limassol",
    phone: "",
    presetId: preset.id,
    projectType: preset.projectType,
    customizationIds: [...preset.customizationIds],
    weeks: preset.weeks,
    budget: preset.price,
    currency: "EUR",
    note: "",
    issued: now.slice(0, 10),
    validDays: 14,
    internalNote: "",
    followUp: "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

export function toShare(quote: QuoteRecord): ShareQuote {
  return {
    ref: quote.ref,
    client: quote.client,
    company: quote.company,
    city: quote.city,
    presetId: quote.presetId,
    projectType: quote.projectType,
    customizationIds: quote.customizationIds,
    weeks: quote.weeks,
    budget: quote.budget,
    currency: quote.currency,
    note: quote.note,
    issued: quote.issued,
    validDays: quote.validDays,
  };
}

export function encodeShare(quote: ShareQuote): string {
  const bytes = new TextEncoder().encode(JSON.stringify(quote));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeShare(token: string): ShareQuote | null {
  try {
    const pad = token.length % 4 === 0 ? "" : "=".repeat(4 - (token.length % 4));
    const b64 = token.replaceAll("-", "+").replaceAll("_", "/") + pad;
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    if (typeof parsed.ref !== "string") return null;
    return {
      ref: parsed.ref,
      client: str(parsed.client),
      company: str(parsed.company),
      city: str(parsed.city),
      presetId: str(parsed.presetId) || "custom",
      projectType: str(parsed.projectType) || "custom",
      customizationIds: Array.isArray(parsed.customizationIds)
        ? parsed.customizationIds.filter((id): id is string => typeof id === "string")
        : [],
      weeks: num(parsed.weeks, 0),
      budget: num(parsed.budget, 0),
      currency: parsed.currency === "USD" ? "USD" : "EUR",
      note: str(parsed.note),
      issued: str(parsed.issued),
      validDays: num(parsed.validDays, 14),
    };
  } catch {
    return null;
  }
}

function normalize(value: unknown): QuoteRecord | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || typeof record.ref !== "string") return null;
  const now = new Date().toISOString();
  return {
    id: record.id,
    ref: record.ref,
    client: str(record.client),
    company: str(record.company),
    email: str(record.email),
    city: str(record.city),
    phone: str(record.phone),
    presetId: str(record.presetId) || "custom",
    projectType: str(record.projectType) || "custom",
    customizationIds: Array.isArray(record.customizationIds)
      ? record.customizationIds.filter((id): id is string => typeof id === "string")
      : [],
    weeks: num(record.weeks, 4),
    budget: num(record.budget, 0),
    currency: record.currency === "USD" ? "USD" : "EUR",
    note: str(record.note),
    issued: str(record.issued) || now.slice(0, 10),
    validDays: num(record.validDays, 14),
    internalNote: str(record.internalNote),
    followUp: str(record.followUp),
    status: isStatus(record.status) ? record.status : "draft",
    createdAt: str(record.createdAt) || now,
    updatedAt: str(record.updatedAt) || now,
  };
}

export function loadQuotes(): QuoteRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      const quote = normalize(item);
      return quote ? [quote] : [];
    });
  } catch {
    return [];
  }
}

export function saveQuotes(quotes: QuoteRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

export function quoteTitle(quote: { presetId: string; projectType: string }): string {
  const preset = getPreset(quote.presetId);
  if (preset.id !== "custom") return preset.name;
  return getProjectType(quote.projectType).label;
}

export function quoteSummary(quote: { presetId: string; projectType: string }): string {
  const preset = getPreset(quote.presetId);
  if (preset.id !== "custom") return preset.summary;
  return getProjectType(quote.projectType).detail;
}

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWeeks(weeks: number): string {
  const label = Number.isInteger(weeks) ? String(weeks) : String(weeks);
  return `${label} ${weeks === 1 ? "week" : "weeks"}`;
}

export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function validUntil(quote: { issued: string; validDays: number }): string {
  const date = new Date(`${quote.issued}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + quote.validDays);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function shareUrl(quote: QuoteRecord): string {
  return `${window.location.origin}/q/${encodeShare(toShare(quote))}`;
}
