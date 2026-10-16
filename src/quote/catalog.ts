export type ProjectType = {
  id: string;
  label: string;
  detail: string;
};

export type Customization = {
  id: string;
  label: string;
  detail: string;
  price: number;
  weeks: number;
};

export type Preset = {
  id: string;
  name: string;
  summary: string;
  projectType: string;
  weeks: number;
  price: number;
  customizationIds: string[];
};

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: "follow-up",
    label: "Follow-up desk",
    detail: "A pipeline and the next message, so leads do not sit in WhatsApp.",
  },
  {
    id: "crm",
    label: "CRM system",
    detail: "Contacts, pipeline, and activity for the way your team already sells.",
  },
  {
    id: "voice",
    label: "AI call agent",
    detail: "A voice agent that answers, qualifies, and books when the team misses a call.",
  },
  {
    id: "chatbot",
    label: "AI chatbot",
    detail: "A site assistant trained on your services that books a call.",
  },
  {
    id: "prospecting",
    label: "Prospecting and quotes",
    detail: "Enquiries in, a pipeline, and a quote your team can send.",
  },
  {
    id: "accounting",
    label: "Accounting and billing",
    detail: "Invoices and a working ledger for one country.",
  },
  {
    id: "hr",
    label: "HR system",
    detail: "Onboarding and the people workflow your team actually uses.",
  },
  {
    id: "support",
    label: "Ticketing and support",
    detail: "A helpdesk shaped around your SLAs and escalation path.",
  },
  {
    id: "custom",
    label: "Custom software",
    detail: "A system scoped to one workflow, built for this quote.",
  },
];

export const CUSTOMIZATIONS: Customization[] = [
  {
    id: "pipeline",
    label: "Pipeline and contacts",
    detail: "Stages, owners, and the activity on each lead.",
    price: 0,
    weeks: 0,
  },
  {
    id: "lead-import",
    label: "Lead import",
    detail: "Bring in the spreadsheet or export you already have.",
    price: 400,
    weeks: 0.5,
  },
  {
    id: "ai-followup",
    label: "AI follow-up drafts",
    detail: "The next message drafted from the lead and your tone.",
    price: 700,
    weeks: 0.5,
  },
  {
    id: "whatsapp",
    label: "WhatsApp on the lead",
    detail: "Replies stay attached to the person, not lost in a chat list.",
    price: 600,
    weeks: 0.5,
  },
  {
    id: "ai-voice",
    label: "AI voice agent",
    detail: "Answers or qualifies after a missed call.",
    price: 900,
    weeks: 1,
  },
  {
    id: "chatbot",
    label: "Site chatbot",
    detail: "Trained on your services and able to book a call.",
    price: 800,
    weeks: 1,
  },
  {
    id: "quoting",
    label: "Client quote sheet",
    detail: "A one-page quote your team can send to its own customers.",
    price: 500,
    weeks: 0.5,
  },
  {
    id: "reporting",
    label: "Weekly report",
    detail: "Open leads, stalled follow-ups, and won work.",
    price: 400,
    weeks: 0.5,
  },
  {
    id: "bilingual",
    label: "English and Greek",
    detail: "The screens your team uses, in both languages.",
    price: 500,
    weeks: 0.5,
  },
  {
    id: "seats",
    label: "Up to 8 users",
    detail: "Seats for the people who actually work the leads.",
    price: 300,
    weeks: 0,
  },
  {
    id: "knowledge",
    label: "Knowledge base",
    detail: "Internal answers the assistant can search.",
    price: 700,
    weeks: 1,
  },
];

export const PRESETS: Preset[] = [
  {
    id: "follow-up-desk",
    name: "Follow-up Desk",
    summary: "Your leads leave WhatsApp and spreadsheets. AI drafts the next message.",
    projectType: "follow-up",
    weeks: 3,
    price: 3400,
    customizationIds: ["pipeline", "lead-import", "ai-followup"],
  },
  {
    id: "estate-pipeline",
    name: "Estate Pipeline",
    summary: "Portal and Instagram leads land with an agent, with a draft ready to send.",
    projectType: "crm",
    weeks: 4,
    price: 4200,
    customizationIds: ["pipeline", "lead-import", "ai-followup", "whatsapp"],
  },
  {
    id: "clinic-desk",
    name: "Clinic Booking Desk",
    summary: "Missed calls and WhatsApp bookings land in one pipeline for the coordinator.",
    projectType: "voice",
    weeks: 3,
    price: 3200,
    customizationIds: ["pipeline", "whatsapp", "ai-voice"],
  },
  {
    id: "solar-desk",
    name: "Solar Quote Desk",
    summary: "Enquiries, site visits, and a quote sheet for the jobs you want to win.",
    projectType: "prospecting",
    weeks: 4,
    price: 4500,
    customizationIds: ["pipeline", "lead-import", "quoting", "reporting"],
  },
  {
    id: "corporate-desk",
    name: "Corporate Services Desk",
    summary: "Company-formation enquiries, a partner pipeline, and follow-up in English.",
    projectType: "follow-up",
    weeks: 3,
    price: 3800,
    customizationIds: ["pipeline", "lead-import", "ai-followup", "bilingual"],
  },
  {
    id: "ai-receptionist",
    name: "AI Receptionist",
    summary: "A voice agent that answers, qualifies, and books when your team misses the call.",
    projectType: "voice",
    weeks: 2,
    price: 2900,
    customizationIds: ["ai-voice", "pipeline"],
  },
  {
    id: "custom",
    name: "Custom scope",
    summary: "Set the project type, pieces, timeline, and budget yourself.",
    projectType: "custom",
    weeks: 4,
    price: 0,
    customizationIds: [],
  },
];

export function getPreset(id: string): Preset {
  return PRESETS.find((preset) => preset.id === id) ?? PRESETS[PRESETS.length - 1];
}

export function getProjectType(id: string): ProjectType {
  return PROJECT_TYPES.find((type) => type.id === id) ?? PROJECT_TYPES[PROJECT_TYPES.length - 1];
}

export function getCustomization(id: string): Customization | undefined {
  return CUSTOMIZATIONS.find((item) => item.id === id);
}

function roundHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

export function quoteSuggestion(presetId: string, customizationIds: string[]) {
  const preset = getPreset(presetId);
  const selected = customizationIds
    .map(getCustomization)
    .filter((item): item is Customization => Boolean(item));

  if (preset.id === "custom") {
    const price = selected.reduce((sum, item) => sum + item.price, 0);
    const extraWeeks = selected.reduce((sum, item) => sum + item.weeks, 0);
    return {
      price,
      weeks: roundHalf(Math.max(preset.weeks, extraWeeks || preset.weeks)),
    };
  }

  const included = new Set(preset.customizationIds);
  const extras = selected.filter((item) => !included.has(item.id));
  return {
    price: preset.price + extras.reduce((sum, item) => sum + item.price, 0),
    weeks: roundHalf(preset.weeks + extras.reduce((sum, item) => sum + item.weeks, 0)),
  };
}
