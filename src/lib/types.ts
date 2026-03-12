import type { Timestamp } from "firebase/firestore";

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
  preview?: {
    url: string;
    type: DeviceType;
    allowFullscreen?: boolean;
  };
  githubRepo?: string;
  githubUrl?: string;
  metadata?: Record<string, string>;
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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  published: boolean;
}
