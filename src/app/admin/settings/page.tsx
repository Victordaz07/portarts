"use client";

import { useEffect, useState, useRef } from "react";
import { getPortfolioConfig, updatePortfolioConfig } from "@/lib/data-client";
import type { PortfolioConfig } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { SortableList } from "@/components/admin/SortableList";
import { HomePreview } from "@/components/admin/HomePreview";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const isFirstRun = useRef(true);
  const prevConfigRef = useRef<string>("");

  useEffect(() => {
    getPortfolioConfig()
      .then(setConfig)
      .catch(() => setConfig(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!config) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      prevConfigRef.current = JSON.stringify(config);
      return;
    }
    const serialized = JSON.stringify(config);
    if (serialized === prevConfigRef.current) return;
    prevConfigRef.current = serialized;
    const statusTimer = window.setTimeout(() => setAutosaveStatus("unsaved"), 0);
    const timer = setTimeout(async () => {
      setAutosaveStatus("saving");
      try {
        await updatePortfolioConfig(config);
        prevConfigRef.current = JSON.stringify(config);
        setAutosaveStatus("saved");
      } catch {
        setAutosaveStatus("unsaved");
      }
    }, 2000);
    return () => {
      clearTimeout(statusTimer);
      clearTimeout(timer);
    };
  }, [config]);

  const update = (key: keyof PortfolioConfig, value: unknown) => {
    if (!config) return;
    setConfig({ ...config, [key]: value });
  };

  const updateAbout = (items: string[]) => {
    if (!config) return;
    setConfig({ ...config, about: items });
  };

  const addAbout = () => {
    if (!config) return;
    setConfig({
      ...config,
      about: [...(config.about ?? []), ""],
    });
  };

  const updateStat = (
    index: number,
    field: "value" | "label",
    value: string
  ) => {
    if (!config) return;
    const next = [...(config.stats ?? [])];
    next[index] = { ...next[index], [field]: value };
    setConfig({ ...config, stats: next });
  };

  const setStats = (stats: Array<{ value: string; label: string }>) => {
    if (!config) return;
    setConfig({ ...config, stats });
  };

  const addStat = () => {
    if (!config) return;
    setConfig({
      ...config,
      stats: [...(config.stats ?? []), { value: "", label: "" }],
    });
  };

  const updateTechStack = (value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      techStack: value.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  const updateAiTools = (value: string) => {
    if (!config) return;
    const items = value.split(",").map((t) => t.trim()).filter(Boolean);
    setConfig({
      ...config,
      aiTools: items.length > 0 ? items : undefined,
    });
  };

  const updateSocialLink = (key: "github" | "linkedin" | "twitter" | "website", value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      socialLinks: { ...config.socialLinks, [key]: value || undefined },
    });
  };

  const handleSave = async () => {
    if (!config) return;
    setAutosaveStatus("saving");
    try {
      await updatePortfolioConfig(config);
      prevConfigRef.current = JSON.stringify(config);
      setAutosaveStatus("saved");
    } catch {
      setAutosaveStatus("unsaved");
    }
  };

  if (loading) {
    return <div className="text-text-muted">Loading…</div>;
  }

  if (!config) {
    return (
      <p className="text-rose">
        config/portfolio does not exist. Create it manually in Firestore.
      </p>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:gap-10 w-full items-start">
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl">Settings</h1>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm ${
                autosaveStatus === "saved"
                  ? "text-green"
                  : autosaveStatus === "saving"
                    ? "text-text-muted"
                    : "text-amber"
              }`}
            >
              {autosaveStatus === "saved" && "Saved"}
              {autosaveStatus === "saving" && "Saving…"}
              {autosaveStatus === "unsaved" && "Unsaved"}
            </span>
            <Button onClick={handleSave} variant="secondary" size="sm">
              Save now
            </Button>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <CollapsibleSection title="Identity" defaultOpen>
            <div className="space-y-4">
              <Input
                label="Name"
                value={config.name}
                onChange={(e) => update("name", e.target.value)}
              />
              <Input
                label="Title"
                value={config.title}
                onChange={(e) => update("title", e.target.value)}
              />
              <Input
                label="Hero headline (H1)"
                value={config.heroHeadline ?? ""}
                onChange={(e) => update("heroHeadline", e.target.value)}
                placeholder="Frontend Developer building products people actually use"
              />
              <Input
                label="Subtitle"
                value={config.subtitle}
                onChange={(e) => update("subtitle", e.target.value)}
              />
              <Textarea
                label="Mini-bio — headline (Hero → Projects)"
                value={config.miniBio?.headline ?? ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    miniBio: {
                      headline: e.target.value,
                      body: config.miniBio?.body ?? "",
                    },
                  })
                }
                rows={2}
              />
              <Textarea
                label="Mini-bio — body"
                value={config.miniBio?.body ?? ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    miniBio: {
                      headline: config.miniBio?.headline ?? "",
                      body: e.target.value,
                    },
                  })
                }
                rows={3}
              />
              <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  checked={config.introTestimonial?.enabled !== false}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      introTestimonial: {
                        quote: config.introTestimonial?.quote ?? "",
                        enabled: e.target.checked,
                      },
                    })
                  }
                />
                Show intro paragraph (below AI pills, first person)
              </label>
              <Textarea
                label="Intro paragraph (you speaking — not a quote)"
                value={config.introTestimonial?.quote ?? ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    introTestimonial: {
                      quote: e.target.value,
                      enabled: config.introTestimonial?.enabled !== false,
                    },
                  })
                }
                rows={4}
                placeholder="First person: how you own UI, Agile mindset (iterative value, collaboration) — not speed — Git, AI — no quotes or signature line."
              />
              <Input
                label="Email"
                value={config.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Social links">
            <div className="space-y-4">
              <Input
                label="GitHub URL"
                value={config.socialLinks?.github ?? ""}
                onChange={(e) => updateSocialLink("github", e.target.value)}
              />
              <Input
                label="LinkedIn URL"
                value={config.socialLinks?.linkedin ?? ""}
                onChange={(e) => updateSocialLink("linkedin", e.target.value)}
              />
              <Input
                label="Twitter/X URL"
                value={config.socialLinks?.twitter ?? ""}
                onChange={(e) => updateSocialLink("twitter", e.target.value)}
              />
              <Input
                label="Website URL"
                value={config.socialLinks?.website ?? ""}
                onChange={(e) => updateSocialLink("website", e.target.value)}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="GitHub">
            <Input
              label="GitHub Username"
              value={config.githubUsername}
              onChange={(e) => update("githubUsername", e.target.value)}
            />
          </CollapsibleSection>

          <CollapsibleSection title="About (paragraphs)">
            <div className="space-y-2">
              <SortableList
                items={config.about ?? []}
                onReorder={updateAbout}
                getItemId={(_, i) => `about-${i}`}
                renderItem={(p, i) => (
                  <Textarea
                    value={p}
                    onChange={(e) => {
                      const next = [...(config.about ?? [])];
                      next[i] = e.target.value;
                      setConfig({ ...config, about: next });
                    }}
                    rows={2}
                    className="mb-0"
                  />
                )}
              />
              <Button type="button" variant="secondary" size="sm" onClick={addAbout}>
                + Paragraph
              </Button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Stats">
            <div className="space-y-2">
              <SortableList
                items={config.stats ?? []}
                onReorder={setStats}
                getItemId={(_, i) => `stat-${i}`}
                renderItem={(s, i) => (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Value"
                      value={s.value}
                      onChange={(e) => updateStat(i, "value", e.target.value)}
                      className="px-3 py-2 bg-bg border border-border rounded-lg text-sm flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      value={s.label}
                      onChange={(e) => updateStat(i, "label", e.target.value)}
                      className="px-3 py-2 bg-bg border border-border rounded-lg text-sm flex-1"
                    />
                  </div>
                )}
              />
              <Button type="button" variant="secondary" size="sm" onClick={addStat}>
                + Stat
              </Button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Tech Stack">
            <p className="text-xs text-text-muted leading-relaxed mb-3">
              Dos carriles en el hero: <strong className="text-text-secondary">Frontend Stack</strong>{" "}
              (React, Next.js, …) y <strong className="text-text-secondary">AI Workflow</strong>{" "}
              (Cursor, Claude, …). Opcionalmente puedes dejar solo{" "}
              <code className="text-[11px] bg-bg-hover px-1 rounded">techStack</code> mezclado: el sitio
              separa entradas conocidas de AI en el segundo carril.
            </p>
            <Input
              label="Frontend Stack — techStack (comma-separated)"
              value={(config.techStack ?? []).join(", ")}
              onChange={(e) => updateTechStack(e.target.value)}
            />
            <div className="mt-4">
              <Input
                label="AI Workflow — aiTools (comma-separated, opcional)"
                value={(config.aiTools ?? []).join(", ")}
                onChange={(e) => updateAiTools(e.target.value)}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Admin access">
            <div className="space-y-3">
              <p className="text-xs text-text-muted leading-relaxed">
                Admin access is controlled by the{" "}
                <code className="text-text-secondary bg-bg-hover px-1 rounded">
                  ADMIN_EMAILS
                </code>{" "}
                environment variable (comma-separated list of emails) on the
                server. Add or remove admins in your Vercel project settings →
                Environment Variables, then redeploy. Image uploads go to Vercel
                Blob and are authorized by your logged-in session — no extra
                permission sync needed.
              </p>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="SEO">
            <div className="space-y-4">
              <Textarea
                label="Meta description"
                value={config.metaDescription ?? ""}
                onChange={(e) => update("metaDescription", e.target.value)}
                rows={2}
                placeholder="Description for search engines and social media"
              />
              <Input
                label="OG Image URL"
                value={config.ogImage ?? ""}
                onChange={(e) => update("ogImage", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CollapsibleSection>
        </div>
      </div>

      <div className="w-full max-w-[min(100%,380px)] xl:max-w-[min(100%,440px)] xl:shrink-0 xl:sticky xl:top-6 xl:self-start">
        <div>
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Preview
          </div>
          <div className="border border-border rounded-card overflow-hidden bg-bg aspect-9/16 max-h-[min(72vh,560px)] xl:max-h-[min(80vh,640px)] relative mx-auto xl:mx-0">
            <div className="absolute inset-0 overflow-auto">
              <HomePreview config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
