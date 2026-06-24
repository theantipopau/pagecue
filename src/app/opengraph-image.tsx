import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const iconData = await readFile(
    join(process.cwd(), "public", "icons", "icon-192.png"),
  );
  const iconSrc = `data:image/png;base64,${iconData.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7f2e9",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={iconSrc} width={140} height={140} alt="" />
      <div
        style={{
          marginTop: 28,
          fontSize: 72,
          fontWeight: 600,
          color: "#1c2a66",
        }}
      >
        PageCue
      </div>
      <div style={{ marginTop: 16, fontSize: 32, color: "#6b6258" }}>
        Remember the story. Resume the journey.
      </div>
    </div>,
    { ...size },
  );
}
