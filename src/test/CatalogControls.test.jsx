import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CatalogControls from '../components/CatalogControls';

describe('CatalogControls', () => {
  it('renders search input and sort select', () => {
    render(
      <CatalogControls
        searchQuery=""
        onSearchChange={() => {}}
        sortBy="default"
        onSortChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText('Buscar productos...')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing', async () => {
    const onSearchChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CatalogControls
        searchQuery=""
        onSearchChange={onSearchChange}
        sortBy="default"
        onSortChange={() => {}}
      />
    );
    await user.type(screen.getByPlaceholderText('Buscar productos...'), 'karen');
    expect(onSearchChange).toHaveBeenCalled();
  });

  it('calls onSortChange when selecting an option', async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CatalogControls
        searchQuery=""
        onSearchChange={() => {}}
        sortBy="default"
        onSortChange={onSortChange}
      />
    );
    await user.selectOptions(screen.getByRole('combobox'), 'price-asc');
    expect(onSortChange).toHaveBeenCalledWith('price-asc');
  });

  it('displays current search query value', () => {
    render(
      <CatalogControls
        searchQuery="bolso"
        onSearchChange={() => {}}
        sortBy="default"
        onSortChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText('Buscar productos...')).toHaveValue('bolso');
  });
});
