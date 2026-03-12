"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { ImageUploader } from "./ImageUploader";
import { SortableList } from "./SortableList";
import { DevicePreview } from "@/components/project/DevicePreview";
import { isSlugUnique } from "@/lib/firestore";
import type { Project, ProjectTheme, ProjectStatusColor } from "@/lib/types";

const THEMES: { value: ProjectTheme; label: string }[] = [
  { value: "fleet", label: "Fleet" },
  { value: "family", label: "Family" },
  { value: "focus", label: "Focus" },
  { value: "gospel", label: "Gospel" },
  { value: "default", label: "Default" },
  { value: "custom", label: "Custom" },
];

const STATUS_COLORS: { value: ProjectStatusColor; label: string }[] = [
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "blue", label: "Blue" },
  { value: "red", label: "Red" },
];

const THEME_PREVIEW: Record<ProjectTheme, string> = {
  fleet: "linear-gradient(135deg, #0f1923, #1a2940)",
  family: "linear-gradient(135deg, #1a0f23, #291a40)",
  focus: "linear-gradient(135deg, #0f2318, #1a4030)",
  gospel: "linear-gradient(135deg, #1f1408, #352414)",
  default: "linear-gradient(135deg, #0f1118, #1a1d2a)",
  custom: "linear-gradient(135deg, #0f1118, #1a1d2a)",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type ProjectFormData = Omit<Project, "id" | "createdAt" | "updatedAt">;

interface ProjectFormProps {
  initial?: Partial<Project>;
  projectId?: string;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onAutosave?: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({
  initial,
  projectId,
  onSubmit,
  onAutosave,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [fullDescription, setFullDescription] = useState(
    initial?.fullDescription ?? ""
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [statusText, setStatusText] = useState(initial?.status?.text ?? "");
  const [statusColor, setStatusColor] = useState<ProjectStatusColor>(
    initial?.status?.color ?? "green"
  );
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [theme, setTheme] = useState<ProjectTheme>(
    (initial?.theme as ProjectTheme) ?? "default"
  );
  const [themeColor, setThemeColor] = useState(initial?.themeColor ?? "#e8c547");
  const [previewUrl, setPreviewUrl] = useState(initial?.preview?.url ?? "");
  const [previewType, setPreviewType] = useState<"phone" | "tablet" | "desktop">(
    initial?.preview?.type ?? "desktop"
  );
  const [githubRepo, setGithubRepo] = useState(initial?.githubRepo ?? "");
  const [metadataEntries, setMetadataEntries] = useState<[string, string][]>(
    Object.entries(initial?.metadata ?? {})
  );
  const [features, setFeatures] = useState(
    initial?.features ?? []
  );
  const [techStack, setTechStack] = useState<string[]>(
    initial?.techStack ?? []
  );
  const [techInput, setTechInput] = useState("");
  const [timeline, setTimeline] = useState(
    initial?.timeline ?? []
  );
  const [gallery, setGallery] = useState(
    initial?.gallery ?? []
  );
  const [links, setLinks] = useState(initial?.links ?? {});
  const [saving, setSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [slugError, setSlugError] = useState("");
  const [slugChecking, setSlugChecking] = useState(false);

  useEffect(() => {
    if (name && !initial?.slug) setSlug(slugify(name));
  }, [name, initial?.slug]);

  const getFormData = useCallback((): ProjectFormData => ({
    slug,
    name,
    tagline,
    description,
    fullDescription,
    featured,
    published,
    order: initial?.order ?? 0,
    status: { text: statusText || "In development", color: statusColor },
    tags,
    theme,
    themeColor: theme === "custom" ? themeColor : undefined,
    preview: { url: previewUrl, type: previewType, allowFullscreen: true },
    githubRepo,
    githubUrl: githubRepo ? `https://github.com/${githubRepo}` : "",
    metadata: Object.fromEntries(metadataEntries.filter(([k]) => k.trim())),
    features,
    techStack,
    timeline,
    gallery,
    links,
  }), [
    slug, name, tagline, description, fullDescription, featured, published,
    statusText, statusColor, tags, theme, themeColor, previewUrl, previewType,
    githubRepo, metadataEntries, features, techStack, timeline, gallery, links,
    initial?.order,
  ]);

  const isFirstRun = useRef(true);
  const prevProjectId = useRef(projectId);
  if (prevProjectId.current !== projectId) {
    prevProjectId.current = projectId;
    isFirstRun.current = true;
  }
  useEffect(() => {
    if (!projectId || !onAutosave) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setAutosaveStatus("unsaved");
    const timer = setTimeout(async () => {
      setAutosaveStatus("saving");
      try {
        const data: ProjectFormData = {
          slug, name, tagline, description, fullDescription, featured, published,
          order: initial?.order ?? 0,
          status: { text: statusText || "In development", color: statusColor },
          tags, theme, themeColor: theme === "custom" ? themeColor : undefined,
          preview: { url: previewUrl, type: previewType, allowFullscreen: true },
          githubRepo, githubUrl: githubRepo ? `https://github.com/${githubRepo}` : "",
          metadata: Object.fromEntries(metadataEntries.filter(([k]) => k.trim())),
          features, techStack, timeline, gallery, links,
        };
        await onAutosave(data);
        setAutosaveStatus("saved");
      } catch {
        setAutosaveStatus("unsaved");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [
    slug, name, tagline, description, fullDescription, featured, published,
    statusText, statusColor, tags, theme, themeColor, previewUrl, previewType,
    githubRepo, metadataEntries, features, techStack, timeline, gallery, links,
    projectId, onAutosave, initial?.order,
  ]);

  useEffect(() => {
    if (!slug || slug === initial?.slug) {
      setSlugError("");
      return;
    }
    const timer = setTimeout(async () => {
      setSlugChecking(true);
      try {
        const unique = await isSlugUnique(slug, projectId);
        setSlugError(unique ? "" : "Este slug ya existe");
      } finally {
        setSlugChecking(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [slug, projectId, initial?.slug]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };
  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const addTech = () => {
    const t = techInput.trim();
    if (t && !techStack.includes(t)) setTechStack([...techStack, t]);
    setTechInput("");
  };
  const removeTech = (t: string) => setTechStack(techStack.filter((x) => x !== t));

  const addFeature = () =>
    setFeatures([...features, { title: "", description: "" }]);
  const updateFeature = (i: number, field: "title" | "description", v: string) => {
    const next = [...features];
    next[i] = { ...next[i], [field]: v };
    setFeatures(next);
  };
  const removeFeature = (i: number) =>
    setFeatures(features.filter((_, j) => j !== i));

  const addTimeline = () =>
    setTimeline([...timeline, { date: "", title: "", description: "" }]);
  const updateTimeline = (
    i: number,
    field: "date" | "title" | "description",
    v: string
  ) => {
    const next = [...timeline];
    next[i] = { ...next[i], [field]: v };
    setTimeline(next);
  };
  const removeTimeline = (i: number) =>
    setTimeline(timeline.filter((_, j) => j !== i));

  const addMetadata = () => setMetadataEntries([...metadataEntries, ["", ""]]);
  const updateMetadata = (i: number, key: string, value: string) => {
    const next = [...metadataEntries];
    next[i] = [key, value];
    setMetadataEntries(next);
  };
  const removeMetadata = (i: number) =>
    setMetadataEntries(metadataEntries.filter((_, j) => j !== i));

  const handleGalleryUpload = (url: string, caption: string) => {
    setGallery([...gallery, { url, caption }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const unique = await isSlugUnique(slug, projectId);
    if (!unique) {
      setSlugError("Este slug ya existe");
      return;
    }
    setSaving(true);
    try {
      await onSubmit(getFormData());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-8 flex-col lg:flex-row">
      <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-4 max-w-2xl">
        {projectId && (
          <div className="flex items-center gap-2 text-sm mb-4">
            {autosaveStatus === "saved" && (
              <span className="text-green flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green" /> Saved
              </span>
            )}
            {autosaveStatus === "saving" && (
              <span className="text-text-muted">Saving…</span>
            )}
            {autosaveStatus === "unsaved" && (
              <span className="text-text-muted flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Unsaved
              </span>
            )}
          </div>
        )}

        <CollapsibleSection title="Basic" defaultOpen>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input
                label="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                error={slugError}
              />
            </div>
            <Input label="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            <Input label="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Textarea label="Full description" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} rows={4} />
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded" />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded" />
                <span className="text-sm">Published</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Status (text)" value={statusText} onChange={(e) => setStatusText(e.target.value)} />
              <Select label="Status (color)" value={statusColor} onChange={(e) => setStatusColor(e.target.value as ProjectStatusColor)} options={STATUS_COLORS} />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Tags and theme" defaultOpen>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Tags</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {tags.map((t) => (
                  <span key={t} className="px-2 py-1 bg-bg-card border border-border rounded-full text-xs flex items-center gap-1">
                    {t}
                    <button type="button" onClick={() => removeTag(t)} className="text-rose hover:underline">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag" className="px-3 py-2 bg-bg border border-border rounded-lg text-sm flex-1" />
                <Button type="button" variant="secondary" size="sm" onClick={addTag}>+</Button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Theme</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {THEMES.filter((t) => t.value !== "custom").map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value as ProjectTheme)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${theme === t.value ? "border-accent scale-110" : "border-border hover:border-border-hover"}`}
                    style={{ background: THEME_PREVIEW[t.value as ProjectTheme] }}
                    title={t.label}
                  />
                ))}
              </div>
              <Select label="Theme" value={theme} onChange={(e) => setTheme(e.target.value as ProjectTheme)} options={THEMES} />
              {theme === "custom" && (
                <div className="mt-2 flex items-center gap-2">
                  <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                  <Input label="Custom color (hex)" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Preview" defaultOpen>
          <div className="space-y-4">
            <Input label="Preview URL" value={previewUrl} onChange={(e) => setPreviewUrl(e.target.value)} placeholder="https://your-app.vercel.app" />
            <Select label="Device type" value={previewType} onChange={(e) => setPreviewType(e.target.value as "phone" | "tablet" | "desktop")} options={[{ value: "phone", label: "Phone" }, { value: "tablet", label: "Tablet" }, { value: "desktop", label: "Desktop" }]} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="GitHub y metadata">
          <div className="space-y-4">
            <Input label="GitHub Repo (usuario/repo)" value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} placeholder="Victordaz07/portarts" />
            <div>
              <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">Metadata (key: value)</label>
              {metadataEntries.map(([k, v], i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" placeholder="Key" value={k} onChange={(e) => updateMetadata(i, e.target.value, v)} className="px-3 py-2 bg-bg border border-border rounded-lg text-sm flex-1" />
                  <input type="text" placeholder="Value" value={v} onChange={(e) => updateMetadata(i, k, e.target.value)} className="px-3 py-2 bg-bg border border-border rounded-lg text-sm flex-1" />
                  <button type="button" onClick={() => removeMetadata(i)} className="text-rose px-2">×</button>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={addMetadata}>+ Metadata</Button>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Tech Stack">
          <div>
            <div className="flex gap-2 flex-wrap mb-2">
              {techStack.map((t) => (
                <span key={t} className="px-2 py-1 bg-bg-card border border-border rounded-full text-xs flex items-center gap-1">
                  {t}
                  <button type="button" onClick={() => removeTech(t)} className="text-rose hover:underline">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
                <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} placeholder="Add tech" className="px-3 py-2 bg-bg border border-border rounded-lg text-sm flex-1" />
              <Button type="button" variant="secondary" size="sm" onClick={addTech}>+</Button>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Features">
          <div className="space-y-2">
            <SortableList
              items={features}
              onReorder={setFeatures}
              getItemId={(_, i) => `f-${i}`}
              renderItem={(f, i) => (
                <div className="flex gap-2">
                  <input type="text" placeholder="Title" value={f.title} onChange={(e) => updateFeature(i, "title", e.target.value)} className="px-3 py-2 bg-bg border border-border rounded-lg text-sm flex-1" />
                  <input type="text" placeholder="Description" value={f.description} onChange={(e) => updateFeature(i, "description", e.target.value)} className="px-3 py-2 bg-bg border border-border rounded-lg text-sm flex-1" />
                  <button type="button" onClick={() => removeFeature(i)} className="text-rose px-2">×</button>
                </div>
              )}
            />
            <Button type="button" variant="secondary" size="sm" onClick={addFeature}>+ Feature</Button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Timeline">
          <div className="space-y-2">
            <SortableList
              items={timeline}
              onReorder={setTimeline}
              getItemId={(_, i) => `t-${i}`}
              renderItem={(t, i) => (
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" placeholder="Date" value={t.date} onChange={(e) => updateTimeline(i, "date", e.target.value)} className="px-3 py-2 bg-bg border border-border rounded-lg text-sm" />
                  <input type="text" placeholder="Title" value={t.title} onChange={(e) => updateTimeline(i, "title", e.target.value)} className="px-3 py-2 bg-bg border border-border rounded-lg text-sm" />
                  <div className="flex gap-1">
                    <input type="text" placeholder="Description" value={t.description} onChange={(e) => updateTimeline(i, "description", e.target.value)} className="px-3 py-2 bg-bg border border-border rounded-lg text-sm flex-1" />
                    <button type="button" onClick={() => removeTimeline(i)} className="text-rose px-2">×</button>
                  </div>
                </div>
              )}
            />
            <Button type="button" variant="secondary" size="sm" onClick={addTimeline}>+ Timeline</Button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Gallery">
          {projectId && <ImageUploader projectId={projectId} onUpload={handleGalleryUpload} />}
          {!projectId && <p className="text-text-muted text-sm">Save the project first to upload images.</p>}
          <div className="space-y-2 mt-2">
            <SortableList
              items={gallery}
              onReorder={setGallery}
              getItemId={(_, i) => `g-${i}`}
              renderItem={(g, i) => (
                <div className="flex items-center gap-2">
                  <img src={g.url} alt={g.caption} className="w-16 h-16 object-cover rounded shrink-0" />
                  <span className="text-sm text-text-secondary flex-1 truncate">{g.caption || "No caption"}</span>
                  <button type="button" onClick={() => setGallery(gallery.filter((_, j) => j !== i))} className="text-rose">×</button>
                </div>
              )}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Links">
          <div className="space-y-2">
            <Input label="Live" value={links.live ?? ""} onChange={(e) => setLinks({ ...links, live: e.target.value })} placeholder="https://..." />
            <Input label="GitHub" value={links.github ?? ""} onChange={(e) => setLinks({ ...links, github: e.target.value })} />
            <Input label="Figma" value={links.figma ?? ""} onChange={(e) => setLinks({ ...links, figma: e.target.value })} />
            <Input label="App Store" value={links.appStore ?? ""} onChange={(e) => setLinks({ ...links, appStore: e.target.value })} placeholder="https://apps.apple.com/..." />
            <Input label="Play Store" value={links.playStore ?? ""} onChange={(e) => setLinks({ ...links, playStore: e.target.value })} placeholder="https://play.google.com/..." />
          </div>
        </CollapsibleSection>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving || !!slugError}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>

      <div className="lg:w-[400px] shrink-0 space-y-6">
        <div className="sticky top-8">
          <h3 className="font-display text-lg mb-4">Live preview</h3>
          <div className="bg-bg-card border border-border rounded-card-lg p-4">
            <DevicePreview url={previewUrl} type={previewType} allowFullscreen={false} />
          </div>
          <div className="mt-4">
            <h4 className="text-sm text-text-muted mb-2">Card view</h4>
            <div
              className="rounded-card-lg overflow-hidden border border-border aspect-video"
              style={{ background: theme === "custom" ? themeColor : THEME_PREVIEW[theme] }}
            >
              <div className="p-4 h-full flex flex-col justify-end">
                <span className="text-xs text-text-secondary">{tagline || "Tagline"}</span>
                <h3 className="font-display text-xl text-text-primary">{name || "Name"}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
