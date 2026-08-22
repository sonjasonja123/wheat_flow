import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './pages/Dashboard';

describe('AgroPanel početna strana', () => {
  test('prikazuje temu proizvodnje pšenice', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Pametnije odluke/i)).toBeInTheDocument();
    expect(screen.getByText(/Proizvodnja pšenice zahteva/i)).toBeInTheDocument();
  });
});
