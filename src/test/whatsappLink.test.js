import { describe, it, expect } from 'vitest';
import { whatsappLink } from '../config/site';

describe('whatsappLink', () => {
  it('builds a valid wa.me URL with encoded message', () => {
    const link = whatsappLink('Hola! Me interesa Bolso Karen');
    expect(link).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(link).toContain(encodeURIComponent('Hola! Me interesa Bolso Karen'));
  });

  it('encodes special characters in the message', () => {
    const link = whatsappLink('¿Cómo estás? & todo bien');
    expect(link).not.toContain(' ');
    expect(link).toContain(encodeURIComponent('¿Cómo estás? & todo bien'));
  });

  it('includes the phone number from env or fallback', () => {
    const link = whatsappLink('test');
    expect(link).toMatch(/wa\.me\/\d+/);
  });
});
