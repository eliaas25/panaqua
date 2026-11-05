import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';

const signInWithPassword = vi.fn();

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args) => signInWithPassword(...args),
    },
  },
}));

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/admin/login']}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<p>PANEL</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AdminLogin', () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
  });

  it('muestra el formulario de email y contraseña', () => {
    renderLogin();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('muestra error con credenciales inválidas', async () => {
    signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    renderLogin();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'mala@test.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'x' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Email o contraseña incorrectos');
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'mala@test.com',
      password: 'x',
    });
  });

  it('navega al panel al iniciar sesión correctamente', async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    renderLogin();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@panaqua.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secreta' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    await waitFor(() => expect(screen.getByText('PANEL')).toBeInTheDocument());
  });
});
