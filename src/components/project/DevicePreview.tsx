"use client";

import { useState, useCallback } from "react";
import { Monitor, Tablet, Smartphone, ExternalLink, Maximize2 } from "lucide-react";
import type { DeviceType } from "@/lib/types";

interface DevicePreviewProps {
  url: string;
  type: DeviceType;
  allowFullscreen?: boolean;
}

export function DevicePreview({
  url: initialUrl,
  type: initialType,
  allowFullscreen = true,
}: DevicePreviewProps) {
  const [url, setUrl] = useState(initialUrl);
  const [deviceType, setDeviceType] = useState<DeviceType>(initialType);
  const [loading, setLoading] = useState(!!initialUrl);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setLoading(!!value);
    setError(false);
  };

  const openInNewTab = () => {
    if (url) window.open(url, "_blank");
  };

  const enterFullscreen = () => {
    if (!allowFullscreen || !url) return;
    const iframe = document.getElementById("device-iframe") as HTMLIFrameElement;
    if (iframe?.requestFullscreen) iframe.requestFullscreen();
  };

  const hasPreview = !!url;

  return (
    <div className="mb-14">
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
        {allowFullscreen && hasPreview && (
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
                <div className="device-phone-notch" />
                {loading && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg z-20">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg z-20 p-6 text-center">
                    <p className="text-text-muted text-sm">
                      The site blocks iframe display (X-Frame-Options).
                    </p>
                  </div>
                )}
                <iframe
                  id="device-iframe"
                  src={url}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  onLoad={handleLoad}
                  onError={handleError}
                  className="w-full h-full border-none rounded-[37px] bg-white"
                  title="Preview"
                />
                <div className="device-phone-bar" />
              </div>
            )}
            {deviceType === "tablet" && (
              <div className="device-tablet">
                <div className="device-tablet-cam" />
                {loading && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg z-20">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-bg z-20 p-6 text-center">
                    <p className="text-text-muted text-sm">
                      The site blocks iframe display.
                    </p>
                  </div>
                )}
                <iframe
                  id="device-iframe"
                  src={url}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  onLoad={handleLoad}
                  onError={handleError}
                  className="w-full h-full border-none rounded-[17px] bg-white"
                  title="Preview"
                />
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
                {loading && !error && (
                  <div className="absolute inset-0 top-8 flex items-center justify-center bg-bg z-20">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 top-8 flex items-center justify-center bg-bg z-20 p-6 text-center">
                    <p className="text-text-muted text-sm">
                      The site blocks iframe display.
                    </p>
                  </div>
                )}
                <iframe
                  id="device-iframe"
                  src={url}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  onLoad={handleLoad}
                  onError={handleError}
                  className="w-full h-[520px] border-none bg-white block"
                  title="Preview"
                />
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
