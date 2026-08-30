import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard, { getWeatherSuggestion } from './pages/Dashboard';

jest.mock('./services/api', () => ({
  api: { get: jest.fn(() => Promise.resolve({ data: [] })) }
}));

describe('Wheat Flow početna strana', () => {
  test('prikazuje temu proizvodnje pšenice', async () => {
    render(<Dashboard />);
    expect(screen.getByText(/Pametnije odluke/i)).toBeInTheDocument();
    expect(screen.getByText(/Proizvodnja pšenice zahteva/i)).toBeInTheDocument();
    expect(await screen.findByText(/Dodajte koordinate parcele|Vremenski podaci trenutno nisu dostupni|Prijava je istekla/i)).toBeInTheDocument();
  });

  test('daje preporuku na osnovu vremenskih uslova', () => {
    expect(getWeatherSuggestion({ precipitation: 1, wind_speed_10m: 5, temperature_2m: 20, relative_humidity_2m: 60 }))
      .toMatch(/odložite zaštitu useva/i);
    expect(getWeatherSuggestion({ precipitation: 0, wind_speed_10m: 30, temperature_2m: 20, relative_humidity_2m: 60 }))
      .toMatch(/odložite prskanje/i);
  });
});
