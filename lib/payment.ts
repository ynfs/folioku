// Tujuan pembayaran DANA. Isi lewat variabel lingkungan (Cloudflare → Settings → Variables)
// atau langsung di sini. Selama kosong, halaman bayar meminta pembeli menghubungi admin via WA.
//   DANA_NUMBER = nomor DANA penerima, mis. 0812xxxxxxx
//   DANA_NAME   = nama pemilik akun DANA (ditampilkan agar pembeli yakin)
// Gambar QR DANA (opsional): taruh di public/bayar/dana-qr.png lalu isi DANA_QR=/bayar/dana-qr.png

export const DANA = {
  number: process.env.DANA_NUMBER ?? "",
  name: process.env.DANA_NAME ?? "",
  qr: process.env.DANA_QR ?? "",
};

export const isDanaConfigured = () => DANA.number.replace(/\D/g, "").length >= 9;
