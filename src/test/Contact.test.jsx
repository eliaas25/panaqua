import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../components/Contact';

describe('Contact', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders contact info with WhatsApp, email and Instagram', () => {
    render(<Contact />);
    expect(screen.getByText(/\+54/)).toBeInTheDocument();
    expect(screen.getByText(/panaqua3@gmail\.com/)).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
  });

  it('does not render Facebook link', () => {
    render(<Contact />);
    expect(screen.queryByLabelText('Facebook')).not.toBeInTheDocument();
  });

  it('renders form with name, email and message fields', () => {
    render(<Contact />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument();
  });

  it('does not submit when fields are empty (required)', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Contact />);
    await user.click(screen.getByRole('button', { name: /enviar/i }));
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('opens WhatsApp with form data on submit', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText('Nombre'), 'Juan');
    await user.type(screen.getByLabelText('Email'), 'juan@test.com');
    await user.type(screen.getByLabelText('Mensaje'), 'Quiero comprar una Bag Tini');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const url = openSpy.mock.calls[0][0];
    expect(url).toContain('wa.me');
    expect(url).toContain(encodeURIComponent('Juan'));
    expect(url).toContain(encodeURIComponent('juan@test.com'));
  });

  it('clears form fields after successful submit', async () => {
    vi.spyOn(window, 'open').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText('Nombre');
    await user.type(nameInput, 'María');
    await user.type(screen.getByLabelText('Email'), 'maria@test.com');
    await user.type(screen.getByLabelText('Mensaje'), 'Hola');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(nameInput).toHaveValue('');
  });
});
