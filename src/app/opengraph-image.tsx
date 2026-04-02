import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Victor Ruiz — Frontend Developer";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 80,
          fontFamily:
            "ui-sans-serif, system-ui, Segoe UI, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
            fontSize: 16,
            color: "#6b7280",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          Available · Frontend Developer
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#0a0a0a",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Victor Ruiz
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#6b7280",
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          Frontend Developer building products people actually use.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            fontSize: 18,
            color: "#9ca3af",
          }}
        >
          portarts.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
