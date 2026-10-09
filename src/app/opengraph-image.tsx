import { ImageResponse } from "next/og";

export const alt = "Halloween Pool Party · 31 de octubre de 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen provisional para compartir. Reemplazar por la pieza oficial (opengraph-image.jpg, 1200x630). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 70,
          background: "linear-gradient(135deg, #9B1020 0%, #080808 60%)",
          color: "#fff",
          fontFamily: "Impact, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#E32636" }}>31 OCTUBRE 2026 · COLOMBIA</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, lineHeight: 0.95 }}>
          <span>HALLOWEEN</span>
          <span style={{ color: "#E32636" }}>POOL PARTY</span>
        </div>
        <div style={{ fontSize: 30, letterSpacing: 6 }}>LISTA FREE COVER · CUPOS LIMITADOS</div>
      </div>
    ),
    size,
  );
}
