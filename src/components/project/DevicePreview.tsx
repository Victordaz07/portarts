"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Monitor, Tablet, Smartphone, ExternalLink, Maximize2 } from "lucide-react";
import type { DeviceType } from "@/lib/types";

interface DevicePreviewProps {
  url: string;
  type: DeviceType;
  allowFullscreen?: boolean;
  projectName?: string;
  /** Override root spacing (e.g. `mb-6` when stacking several previews) */
  className?: string;
}

export function DevicePreview({
  url: initialUrl,
  type: initialType,
  allowFullscreen = true,
  projectName,
  className,
}: DevicePreviewProps) {
  const [url, setUrl] = useState(initialUrl);
  const [deviceType, setDeviceType] = useState<DeviceType>(initialType);
  const [loading, setLoading] = useState(!!initialUrl);
  const [blocked, setBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const normalizedIframeSrc = (() => {
    if (!url) return "";
    try {
      return new URL(url).toString();
    } catch {
      return url;
    }
  })();

  /**
   * Reset overlay when URL changes; clear stuck spinner after a few seconds.
   * Also: we do not append #top to the URL — that breaks many SPA routers.
   */
  useEffect(() => {
    if (!normalizedIframeSrc) return;
    setLoading(true);
    setBlocked(false);
    const t = window.setTimeout(() => setLoading(false), 14_000);
    return () => window.clearTimeout(t);
  }, [normalizedIframeSrc]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const href = iframe.contentWindow?.location?.href;
      if (!href || href === "about:blank" || href.includes("about:blank")) {
        setBlocked(true);
      }
    } catch {
      // SecurityError = cross-origin page loaded successfully
      setBlocked(false);
    }
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setBlocked(true);
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setLoading(!!value);
    setBlocked(false);
  };

  const openInNewTab = () => {
    if (url) window.open(url, "_blank");
  };

  const enterFullscreen = () => {
    if (!allowFullscreen || !url) return;
    const iframe = iframeRef.current;
    if (iframe?.requestFullscreen) iframe.requestFullscreen();
  };

  const hasPreview = !!url;

  const blockedPlaceholder = (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg z-20 p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
        <ExternalLink className="w-5 h-5 text-text-muted" />
      </div>
      {projectName && (
        <h4 className="text-base font-display text-text-primary mb-1">
          {projectName}
        </h4>
      )}
      <p className="text-sm text-text-muted mb-4 max-w-[260px] leading-relaxed">
        This site cannot be embedded in a preview frame.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium bg-accent text-bg no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_18px_rgba(232,197,71,0.3)]"
      >
        Visit site
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );

  const loadingSpinner = (
    <div className="absolute inset-0 flex items-center justify-center bg-bg z-20">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const renderIframe = (className: string) => (
    <iframe
      key={normalizedIframeSrc}
      ref={iframeRef}
      src={normalizedIframeSrc}
      onLoad={handleLoad}
      onError={handleError}
      className={className}
      title="Preview"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );

  return (
    <div className={className ?? "mb-14"}>
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <button
          type="button"
          onClick={() => setDeviceType("phone")}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-mono transition-all ${
            deviceType === "phone"
              ? "bg-accent-dim border border-accent/20 text-accent"
              : "bg-surface border border-border text-text-secondary hover:bg-accent-dim hover:border-accent/20 hover:text-accent"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Phone
        </button>
        <button
          type="button"
          onClick={() => setDeviceType("tablet")}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-mono transition-all ${
            deviceType === "tablet"
              ? "bg-accent-dim border border-accent/20 text-accent"
              : "bg-surface border border-border text-text-secondary hover:bg-accent-dim hover:border-accent/20 hover:text-accent"
          }`}
        >
          <Tablet className="w-4 h-4" />
          Tablet
        </button>
        <button
          type="button"
          onClick={() => setDeviceType("desktop")}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-mono transition-all ${
            deviceType === "desktop"
              ? "bg-accent-dim border border-accent/20 text-accent"
              : "bg-surface border border-border text-text-secondary hover:bg-accent-dim hover:border-accent/20 hover:text-accent"
          }`}
        >
          <Monitor className="w-4 h-4" />
          Desktop
        </button>
        <input
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://tu-app-desplegada.com"
          className="flex-1 min-w-[200px] px-3 py-2 bg-bg border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={openInNewTab}
          className="flex items-center gap-1 px-3 py-2 bg-bg-hover border border-border rounded-lg text-sm text-text-secondary hover:text-accent hover:border-accent transition-all font-mono"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir
        </button>
        {allowFullscreen && hasPreview && !blocked && (
          <button
            type="button"
            onClick={enterFullscreen}
            className="flex items-center gap-1 px-3 py-2 bg-bg-hover border border-border rounded-lg text-sm text-text-secondary hover:text-accent hover:border-accent transition-all font-mono"
          >
            <Maximize2 className="w-4 h-4" />
            Fullscreen
          </button>
        )}
      </div>

      <div className="device-stage">
        {hasPreview ? (
          <>
            {deviceType === "phone" && (
              <div className="device-phone">
                {loading && !blocked && loadingSpinner}
                {blocked && blockedPlaceholder}
                {renderIframe(`w-full h-full border-none rounded-[37px] bg-white ${blocked ? "invisible absolute" : ""}`)}
              </div>
            )}
            {deviceType === "tablet" && (
              <div className="device-tablet">
                <div className="device-tablet-cam" />
                {loading && !blocked && loadingSpinner}
                {blocked && blockedPlaceholder}
                {renderIframe(`w-full h-full border-none rounded-[17px] bg-white ${blocked ? "invisible absolute" : ""}`)}
              </div>
            )}
            {deviceType === "desktop" && (
              <div className="device-desktop">
                <div className="device-desktop-topbar">
                  <span className="dot-red" />
                  <span className="dot-yellow" />
                  <span className="dot-green" />
                  <span className="url-bar truncate">{url}</span>
                </div>
                {loading && !blocked && (
                  <div className="absolute inset-0 top-8 flex items-center justify-center bg-bg z-20">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {blocked && blockedPlaceholder}
                {renderIframe(`w-full h-[520px] border-none bg-white block ${blocked ? "invisible absolute" : ""}`)}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-10 text-text-muted">
            <span className="text-5xl mb-4 opacity-40">🚀</span>
            <h4 className="text-base text-text-secondary mb-2 font-display">
              No preview configured
            </h4>
            <p className="text-sm max-w-[280px] leading-relaxed">
              Paste your deployed app URL above to see it live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
