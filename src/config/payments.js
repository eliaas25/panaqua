const payments = {
  alias: import.meta.env.VITE_PAYMENT_ALIAS || 'cm.camila.mercado',
  cbu: import.meta.env.VITE_PAYMENT_CBU || '0000003100052648667954',
  qrUrl: import.meta.env.VITE_PAYMENT_QR_URL || null,
};

export { payments };
