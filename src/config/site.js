const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5493415603310';
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'panaqua3@gmail.com';
const instagramUrl =
  import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/panaqua_carteras';

const whatsappDisplay = `+${whatsappNumber.replace(/^(\d{2})(\d)(\d{3})(\d+)$/, '$1 $2 $3 $4')}`;

export function whatsappLink(text) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export { whatsappNumber, whatsappDisplay, contactEmail, instagramUrl };
