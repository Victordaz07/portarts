import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
          fontFamily:
            "ui-sans-serif, system-ui, Segoe UI, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-2px",
          }}
        >
          VR
        </div>
      </div>
    ),
    { ...size }
  );
}
