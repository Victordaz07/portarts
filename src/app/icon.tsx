import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 32, height: 32 };

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
          fontFamily:
            "ui-sans-serif, system-ui, Segoe UI, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          VR
        </div>
      </div>
    ),
    { ...size }
  );
}
