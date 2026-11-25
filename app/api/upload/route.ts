import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_AUDIO = 10 * 1024 * 1024;
// SVG sengaja tidak diizinkan karena bisa berisi skrip.
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "audio/mpeg"];

export async function POST(request: Request) {
  const user = await backend.getCurrentUser();
  if (!user) return NextResponse.json({ error: "Silakan masuk dulu." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File tidak ada." }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Format harus PNG, JPG, WEBP, GIF, atau MP3." }, { status: 400 });
  }
  const isAudio = file.type === "audio/mpeg";
  if (file.size > (isAudio ? MAX_AUDIO : MAX_IMAGE)) {
    return NextResponse.json({ error: isAudio ? "Ukuran lagu maksimal 10 MB." : "Ukuran gambar maksimal 5 MB." }, { status: 400 });
  }

  try {
    const url = await backend.uploadImage(user.id, file);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Gagal mengunggah gambar." }, { status: 500 });
  }
}
