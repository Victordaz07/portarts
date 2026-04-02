export interface PortfolioConfig {
  name: string;
  title: string;
  /** Homepage hero H1; optional so existing Firestore docs keep working. */
  heroHeadline?: string;
  subtitle: string;
  email: string;
  githubUsername: string;
  about: string[];
  stats: Array<{ value: string; label: string }>;
  techStack: string[];
  /** Carril AI del hero (marquee); opcional — si falta, se infiere de `techStack` o fallback. */
  aiTools?: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  allowedAdmins: string[];
  metaDescription?: string;
  ogImage?: string;
  /** Mini-bio between Hero and Projects (optional; defaults in code). */
  miniBio?: {
    headline: string;
    body: string;
  };
  /**
   * Párrafo en 1ª persona bajo intro + AI pills (`quote` = texto; nombre histórico "testimonial").
   * `enabled: false` oculta el bloque. `author`/`role` legacy — ya no se muestran en UI.
   */
  introTestimonial?: {
    quote?: string;
    author?: string;
    role?: string;
    enabled?: boolean;
  };
}

export type ProjectTheme =
  | "fleet"
  | "family"
  | "focus"
  | "gospel"
  | "default"
  | "custom";

export type ProjectStatusColor = "green" | "yellow" | "blue" | "red";

export type DeviceType = "phone" | "tablet" | "desktop";

/** Optional KPI chips shown on project cards (max 3 in admin). */
export type ProjectKpi = {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
};

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  featured: boolean;
  order: number;
  status?: {
    text: string;
    color: ProjectStatusColor;
  };
  tags?: string[];
  theme?: ProjectTheme;
  themeColor?: string;
  /** Hero image on the homepage project card; overrides first gallery image when set */
  coverImage?: string;
  /** Optional brand mark on the card header (URL, e.g. Firebase Storage) */
  logoUrl?: string;
  /** When false, the project name is not drawn on the card header (use when the cover art already includes the title). Default: true */
  showTitleOnCard?: boolean;
  preview?: {
    url: string;
    type: DeviceType;
    allowFullscreen?: boolean;
  };
  previews?: Array<{
    url: string;
    type: DeviceType;
    label: string;
    allowFullscreen?: boolean;
    /** If false, show a compact link banner instead of an iframe (e.g. marketing URL that blocks embedding). */
    embed?: boolean;
  }>;
  demoCredentials?: {
    url: string;
    email: string;
    password: string;
    disclaimer?: string;
  };
  githubRepo?: string;
  githubUrl?: string;
  metadata?: Record<string, string>;
  valueProps?: {
    problem?: string;
    role?: string;
    outcome?: string;
  };
  /** Optional: AI-augmented Agile workflow narrative (set in Firestore). */
  workflow?: {
    tools: string[];
    summary: string;
  };
  /** Shown on project cards; optional so legacy documents keep working. */
  kpis?: ProjectKpi[];
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  techStack?: string[];
  timeline?: Array<{
    date: string;
    title: string;
    description: string;
  }>;
  gallery?: Array<{
    url: string;
    caption: string;
  }>;
  links?: {
    live?: string;
    github?: string;
    figma?: string;
    appStore?: string;
    playStore?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  published: boolean;
}
