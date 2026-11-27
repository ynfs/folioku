// Kontak resmi Safantara untuk layanan custom (profil, undangan, proposal).
export const CONTACT = {
  email: "zerotofrist@gmail.com",
  whatsapp: "081325254093",
  whatsappDisplay: "0813-2525-4093",
};

/** Link WhatsApp dengan pesan pembuka. */
export function waLink(message = "Halo Safantara, saya ingin konsultasi desain custom."): string {
  const intl = CONTACT.whatsapp.replace(/^0/, "62");
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

export const mailLink = (subject = "Konsultasi desain custom") => `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}`;
