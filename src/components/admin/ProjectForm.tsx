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
import type {
  Project,
  ProjectTheme,
  ProjectStatusColor,
  DeviceType,
} from "@/lib/types";

const PREVIEW_SLOT_COUNT = 3;

type PreviewSlot = { label: string; url: string; type: DeviceType };

function initialPreviewSlots(initial?: Partial<Project>): PreviewSlot[] {
  const fromArray = (initial?.previews ?? [])
    .slice(0, PREVIEW_SLOT_COUNT)
    .map((p) => ({
      label: (p.label ?? "").trim(),
      url: (p.url ?? "").trim(),
      type: (p.type ?? "desktop") as DeviceType,
    }));
  if (fromArray.length > 0) {
    while (fromArray.length < PREVIEW_SLOT_COUNT) {
      fromArray.push({ label: "", url: "", type: "desktop" });
    }
    return fromArray;
  }
  return [
    {
      label: "",
      url: (initial?.preview?.url ?? "").trim(),
      type: (initial?.preview?.type ?? "desktop") as DeviceType,
    },
    { label: "", url: "", type: "desktop" },
    { label: "", url: "", type: "desktop" },
  ];
}

function buildPreviewPayload(slots: PreviewSlot[]): NonNullable<Project["previews"]> {
  return slots
    .map((s, i) => ({
      label: s.label.trim() || `Vista ${i + 1}`,
      url: s.url.trim(),
      type: s.type,
      allowFullscreen: true as const,
    }))
    .filter((p) => p.url.length > 0);
}

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
  const [previewSlots, setPreviewSlots] = useState<PreviewSlot[]>(() =>
    initialPreviewSlots(initial)
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
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? "");
  const [showTitleOnCard, setShowTitleOnCard] = useState(
    initial?.showTitleOnCard !== false
  );
  const [links, setLinks] = useState(initial?.links ?? {});
  const [saving, setSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [slugError, setSlugError] = useState("");
  const [slugChecking, setSlugChecking] = useState(false);

  useEffect(() => {
    if (name && !initial?.slug) setSlug(slugify(name));
  }, [name, initial?.slug]);

  const getFormData = useCallback((): ProjectFormData => {
    const previews = buildPreviewPayload(previewSlots);
    const primary = previews[0];
    return {
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
    preview: primary
      ? { url: primary.url, type: primary.type, allowFullscreen: true }
      : { url: "", type: "desktop", allowFullscreen: true },
    previews,
    githubRepo,
    githubUrl: githubRepo ? `https://github.com/${githubRepo}` : "",
    metadata: Object.fromEntries(metadataEntries.filter(([k]) => k.trim())),
    features,
    techStack,
    timeline,
    gallery,
    coverImage: coverImage.trim() || undefined,
    logoUrl: logoUrl.trim() || undefined,
    showTitleOnCard,
    links,
    };
  }, [
    slug, name, tagline, description, fullDescription, featured, published,
    statusText, statusColor, tags, theme, themeColor, previewSlots,
    githubRepo, metadataEntries, features, techStack, timeline, gallery,
    coverImage, logoUrl, showTitleOnCard, links,
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
        const data = getFormData();
        await onAutosave(data);
        setAutosaveStatus("saved");
      } catch {
        setAutosaveStatus("unsaved");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [
    slug, name, tagline, description, fullDescription, featured, published,
    statusText, statusColor, tags, theme, themeColor, previewSlots,
    githubRepo, metadataEntries, features, techStack, timeline, gallery,
    coverImage, logoUrl, showTitleOnCard, links,
    projectId, onAutosave, getFormData, initial?.order,
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

  const updatePreviewSlot = (
    index: number,
    patch: Partial<PreviewSlot>
  ) => {
    setPreviewSlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

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
    <div className="grid w-full items-start gap-8 lg:gap-10 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(280px,min(40vw,460px))] 2xl:[grid-template-columns:minmax(0,1fr)_minmax(300px,min(38vw,500px))]">
      <form onSubmit={handleSubmit} className="min-w-0 w-full max-w-4xl xl:max-w-none space-y-4">
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

        <CollapsibleSection id="edit-homepage-card" title="Homepage card">
          <p className="text-text-muted text-sm mb-4">
            <strong className="text-text-secondary">Edita la cabecera de la tarjeta aquí.</strong> Portada
            para la cuadrícula de proyectos en la home. Si la dejas vacía, se usa la{" "}
            <strong>primera imagen de Gallery</strong>. El logo es opcional. Puedes ocultar el nombre del
            proyecto sobre la imagen si ya va en el diseño.
          </p>
          {projectId ? (
            <div className="space-y-2 mb-4">
              <label className="block text-xs text-text-secondary uppercase tracking-wider">
                Subir portada (cabecera de la tarjeta)
              </label>
              <ImageUploader
                projectId={projectId}
                inputId="project-card-cover-upload"
                onUpload={(url) => setCoverImage(url)}
              />
            </div>
          ) : (
            <p className="text-text-muted text-sm mb-4">
              Guarda el proyecto primero para poder subir una portada dedicada.
            </p>
          )}
          {coverImage ? (
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt=""
                className="h-24 w-full max-w-sm object-cover rounded-lg border border-border"
              />
              <Button type="button" variant="secondary" size="sm" onClick={() => setCoverImage("")}>
                Quitar portada
              </Button>
            </div>
          ) : null}
          <Input
            label="URL del logo (opcional)"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://…"
          />
          {projectId ? (
            <div className="space-y-2 mt-4">
              <label className="block text-xs text-text-secondary uppercase tracking-wider">
                O subir logo
              </label>
              <ImageUploader
                projectId={projectId}
                inputId="project-card-logo-upload"
                onUpload={(url) => setLogoUrl(url)}
              />
            </div>
          ) : null}
          <label className="flex items-start gap-3 mt-4 cursor-pointer max-w-lg">
            <input
              type="checkbox"
              checked={showTitleOnCard}
              onChange={(e) => setShowTitleOnCard(e.target.checked)}
              className="rounded mt-1 shrink-0"
            />
            <span className="text-sm text-text-secondary leading-snug">
              <span className="text-text-primary font-medium block mb-0.5">
                Mostrar nombre del proyecto sobre la portada
              </span>
              Desactívalo si tu imagen ya incluye el título o marca (evita texto duplicado).
            </span>
          </label>
        </CollapsibleSection>

        <CollapsibleSection id="edit-gallery" title="Gallery">
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

        <CollapsibleSection title="Iframes en la ficha (hasta 3)" defaultOpen>
          <p className="text-sm text-text-muted mb-4 leading-relaxed">
            Estas URLs son las que se incrustan en la página pública del proyecto (vista previa en
            móvil/tablet/desktop). No confundir con los enlaces de la sección siguiente:{" "}
            <strong className="text-text-secondary">Links</strong> son solo botones externos (GitHub,
            tiendas, etc.).
          </p>
          <p className="text-sm text-text-muted mb-4 leading-relaxed">
            Hasta tres iframes: cada uno puede ser una ruta distinta de tu app desplegada. Las filas sin
            URL se ignoran al guardar.
          </p>
          <div className="space-y-4">
            {previewSlots.map((slot, i) => (
              <div
                key={i}
                className="rounded-card border border-border bg-bg-card/40 p-4 space-y-3"
              >
                <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Iframe {i + 1} / 3
                </div>
                <Input
                  label="Título en la ficha"
                  value={slot.label}
                  onChange={(e) => updatePreviewSlot(i, { label: e.target.value })}
                  placeholder="Ej. Landing, App en vivo, Panel admin"
                />
                <Input
                  label="URL del iframe"
                  value={slot.url}
                  onChange={(e) => updatePreviewSlot(i, { url: e.target.value })}
                  placeholder="https://tu-app.vercel.app/ruta"
                />
                <Select
                  label="Dispositivo inicial"
                  value={slot.type}
                  onChange={(e) =>
                    updatePreviewSlot(i, {
                      type: e.target.value as DeviceType,
                    })
                  }
                  options={[
                    { value: "phone", label: "Phone" },
                    { value: "tablet", label: "Tablet" },
                    { value: "desktop", label: "Desktop" },
                  ]}
                />
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Links">
          <p className="text-xs text-text-muted mb-3 leading-relaxed">
            Enlaces externos (no son iframes). Los embeds van arriba en{" "}
            <strong className="text-text-secondary">Iframes en la ficha</strong>.
          </p>
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

      <aside
        id="admin-project-previews"
        aria-label="Vistas previas del proyecto"
        className="min-w-0 w-full space-y-6 xl:pb-2"
      >
        <header className="space-y-1 border-b border-border pb-4">
          <h3 className="font-display text-lg text-text-primary">Vistas previas</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Columna derecha fija en el layout: live, tarjeta del inicio y galería. Usa la misma barra de
            desplazamiento del panel (sin scroll interno aquí).
          </p>
        </header>

        <section className="rounded-card-lg border border-border bg-bg-card/90 p-3 sm:p-4 shadow-sm">
          <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
            Iframes (hasta 3)
          </h4>
          <div className="space-y-6">
            {previewSlots.some((s) => s.url.trim()) ? (
              previewSlots.map((slot, i) =>
                slot.url.trim() ? (
                  <div key={i}>
                    {slot.label.trim() ? (
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                        {slot.label.trim()}
                      </p>
                    ) : (
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                        Vista {i + 1}
                      </p>
                    )}
                    <DevicePreview
                      url={slot.url}
                      type={slot.type}
                      allowFullscreen={false}
                      className="mb-0"
                    />
                  </div>
                ) : null
              )
            ) : (
              <DevicePreview url="" type="desktop" allowFullscreen={false} className="mb-0" />
            )}
          </div>
        </section>

        <section className="rounded-card-lg border border-border bg-bg-card/90 p-3 sm:p-4 shadow-sm">
          <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-1">
            Tarjeta en el inicio
          </h4>
          <p className="text-xs text-text-muted leading-snug mb-3">
            Solo lectura. Edita en{" "}
            <a
              href="#edit-homepage-card"
              className="text-accent underline underline-offset-2 hover:opacity-90"
            >
              Homepage card
            </a>{" "}
            o en{" "}
            <a href="#edit-gallery" className="text-accent underline underline-offset-2 hover:opacity-90">
              Gallery
            </a>
            .
          </p>
          {(() => {
            const previewCover =
              coverImage.trim() || gallery[0]?.url?.trim() || "";
            const fallbackBg =
              theme === "custom" ? themeColor : THEME_PREVIEW[theme];
            return (
              <div className="rounded-card-lg overflow-hidden border border-border aspect-video relative">
                {previewCover ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewCover}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/10"
                      aria-hidden
                    />
                  </>
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: fallbackBg }}
                  />
                )}
                <div className="relative z-10 p-4 h-full min-h-[120px] flex flex-col justify-end items-center text-center gap-1">
                  {logoUrl.trim() ? (
                    <div className="mb-1 h-9 w-9 rounded-lg bg-white/15 p-0.5 ring-1 ring-white/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoUrl.trim()}
                        alt=""
                        className="size-full object-contain"
                      />
                    </div>
                  ) : null}
                  <span className="text-[10px] text-white/80 drop-shadow-sm">
                    {tagline || "Tagline"}
                  </span>
                  {showTitleOnCard ? (
                    <h3 className="font-display text-lg text-white drop-shadow-md">
                      {name || "Name"}
                    </h3>
                  ) : (
                    <span className="text-[10px] text-white/50 italic">
                      (sin título en cabecera)
                    </span>
                  )}
                </div>
              </div>
            );
          })()}
        </section>

        <section className="rounded-card-lg border border-border bg-bg-card/90 p-3 sm:p-4 shadow-sm">
          <h4 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
            Galería
          </h4>
          {gallery.length === 0 ? (
            <p className="text-xs text-text-muted leading-relaxed">
              Sin imágenes aún. Añádelas en la sección{" "}
              <a href="#edit-gallery" className="text-accent underline underline-offset-2">
                Gallery
              </a>
              .
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {gallery.map((g, i) => (
                <li
                  key={`${g.url}-${i}`}
                  className="aspect-square overflow-hidden rounded-lg border border-border bg-bg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.url}
                    alt={g.caption || `Imagen ${i + 1}`}
                    className="size-full object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
}
