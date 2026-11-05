const payments = {
  alias: import.meta.env.VITE_PAYMENT_ALIAS || 'cm.camila.mercado',
  cbu: import.meta.env.VITE_PAYMENT_CBU || '0000003100052648667954',
  razonSocial: import.meta.env.VITE_PAYMENT_RAZON_SOCIAL || '',
};

export { payments };
