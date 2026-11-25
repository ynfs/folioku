import { promises as fs } from "node:fs";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/backend/local";

// Menyajikan gambar yang diunggah di mode lokal.
const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  mp3: "audio/mpeg",
};

export async function GET(_req: Request, ctx: RouteContext<"/api/files/[name]">) {
  const { name } = await ctx.params;
  const match = /^[a-f0-9-]{36}\.(png|jpg|webp|gif|mp3)$/.exec(name);
  if (!match) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": TYPES[match[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
