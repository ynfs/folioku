import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";

const MAX_BYTES = 5 * 1024 * 1024;
// SVG sengaja tidak diizinkan karena bisa berisi skrip.
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const user = await backend.getCurrentUser();
  if (!user) return NextResponse.json({ error: "Silakan masuk dulu." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File tidak ada." }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Format harus PNG, JPG, WEBP, atau GIF." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Ukuran maksimal 5 MB." }, { status: 400 });

  try {
    const url = await backend.uploadImage(user.id, file);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Gagal mengunggah gambar." }, { status: 500 });
  }
}
