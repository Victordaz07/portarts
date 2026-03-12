"use client";

import { useEffect, useState, useRef } from "react";
import { getPortfolioConfig, updatePortfolioConfig } from "@/lib/firestore";
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
    setAutosaveStatus("unsaved");
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
    return () => clearTimeout(timer);
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

  const updateSocialLink = (key: "github" | "linkedin" | "twitter" | "website", value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      socialLinks: { ...config.socialLinks, [key]: value || undefined },
    });
  };

  const updateAllowedAdmins = (value: string) => {
    if (!config) return;
    const uids = value.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
    setConfig({ ...config, allowedAdmins: uids });
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
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
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
                label="Subtitle"
                value={config.subtitle}
                onChange={(e) => update("subtitle", e.target.value)}
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
            <Input
              label="Tech Stack (comma-separated)"
              value={(config.techStack ?? []).join(", ")}
              onChange={(e) => updateTechStack(e.target.value)}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Admin">
            <div className="space-y-2">
              <label className="block text-xs text-text-secondary uppercase tracking-wider">
                Allowed UIDs (comma or space separated)
              </label>
              <Textarea
                value={(config.allowedAdmins ?? []).join(", ")}
                onChange={(e) => updateAllowedAdmins(e.target.value)}
                rows={3}
                placeholder="uid1, uid2"
              />
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

      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-8">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Preview
          </div>
          <div className="border border-border rounded-card overflow-hidden bg-bg aspect-[9/16] max-h-[500px] relative">
            <div className="absolute inset-0 overflow-auto">
              <HomePreview config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
