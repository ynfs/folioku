// Konfigurasi OpenNext untuk menjalankan Next.js di Cloudflare Workers.
// Tanpa cache R2 (butuh kartu kredit); semua halaman Safantara dinamis.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
