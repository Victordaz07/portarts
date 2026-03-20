export interface PortfolioConfig {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  githubUsername: string;
  about: string[];
  stats: Array<{ value: string; label: string }>;
  techStack: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  allowedAdmins: string[];
  metaDescription?: string;
  ogImage?: string;
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
