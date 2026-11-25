import type { NextConfig } from "next";

// Catatan: cacheComponents sengaja tidak diaktifkan. Hampir semua halaman
// Folioku membaca sesi login, jadi model rendering dinamis klasik lebih cocok.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
