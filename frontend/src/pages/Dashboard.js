import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export const getWeatherSuggestion = ({ temperature_2m, relative_humidity_2m, precipitation, wind_speed_10m }) => {
  if (Number(precipitation) > 0.2) return 'Padavine su u toku — odložite zaštitu useva i proverite stanje zemljišta.';
  if (Number(wind_speed_10m) >= 25) return 'Jak vetar — odložite prskanje i druge radove osetljive na vetar.';
  if (Number(temperature_2m) >= 30) return 'Visoka temperatura — proverite vlagu zemljišta i planirajte navodnjavanje rano ujutru.';
  if (Number(temperature_2m) <= 3) return 'Niska temperatura — pratite mogućnost mraza i stanje mladih biljaka.';
  if (Number(relative_humidity_2m) < 40) return 'Vazduh je suv — proverite vlagu zemljišta pre narednih radova.';
  return 'Vremenski uslovi su trenutno povoljni za redovan obilazak parcele.';
};

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [weatherMessage, setWeatherMessage] = useState('Učitavanje vremenskih podataka...');

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const fields = (await api.get('/fields')).data;
        const field = fields.find(item => Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng)));
        if (!field) {
          setWeatherMessage('Dodajte koordinate parcele da biste dobili vremensku prognozu i sugestiju.');
          return;
        }
        const params = new URLSearchParams({
          latitude: field.lat,
          longitude: field.lng,
          current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m',
          timezone: 'Europe/Belgrade'
        });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        if (!response.ok) throw new Error('Weather request failed');
        setWeather({ field: field.name, ...(await response.json()).current });
        setWeatherMessage('');
      } catch (error) {
        setWeather(null);
        if (error.response?.status === 401) {
          setWeatherMessage('Prijava je istekla. Prijavite se ponovo da biste učitali podatke parcele i prognozu.');
        } else {
          setWeatherMessage('Vremenski podaci trenutno nisu dostupni. Pokušajte ponovo kasnije.');
        }
      }
    };
    loadWeather();
  }, []);

  return (
    <div className="dash">
      <section className="bg">
        <div className="hero-content">
          <span className="hero-kicker">Digitalno upravljanje gazdinstvom</span>
          <h1>Pametnije odluke.<br />Bolji prinos.</h1>
          <p>Sve što vam je potrebno za pregled proizvodnje pšenice na jednom mestu.</p>
        </div>
      </section>
      {weather && (
        <section className="weather-strip" aria-label="Trenutni vremenski uslovi">
          <div><span>Vreme za parcelu</span><strong>{weather.field}</strong></div>
          <div><span>Temperatura</span><strong>{weather.temperature_2m} °C</strong></div>
          <div><span>Vlažnost</span><strong>{weather.relative_humidity_2m} %</strong></div>
          <div><span>Padavine</span><strong>{weather.precipitation} mm</strong></div>
          <div><span>Vetar</span><strong>{weather.wind_speed_10m} km/h</strong></div>
          <div className="weather-suggestion"><span>Preporuka za radove</span><strong>{getWeatherSuggestion(weather)}</strong></div>
        </section>
      )}
      {!weather && weatherMessage && <p className="weather-message">{weatherMessage}</p>}
      <section className="dashboard-intro">
        <span className="section-label">O platformi</span>
        <h2>Vaš pouzdan partner u poljoprivrednoj proizvodnji</h2>
        <p>Proizvodnja pšenice zahteva znanje, iskustvo i pravovremene odluke. Wheat Flow pomaže da organizujete podatke i pratite svaki važan korak — od jesenje setve i prihrane do zaštite useva i žetve.</p>
      </section>
      <section className="dashboard-features">
        <div className="features-heading"><span className="section-label">Mogućnosti</span><h2>Sve što vam treba na jednom mestu</h2></div>
        <article><span>01</span><h3>Pregled parcela</h3><p>Evidentirajte površinu, tip zemljišta, lokaciju i sezonu za svaku parcelu.</p></article>
        <article><span>02</span><h3>Praćenje pšenice</h3><p>Pratite setvu, prihranu, zaštitu useva, navodnjavanje, žetvu i ostvareni prinos.</p></article>
        <article><span>03</span><h3>Kontrola troškova</h3><p>Vodite preciznu evidenciju ulaganja i analizirajte raspodelu troškova.</p></article>
        <article><span>04</span><h3>Plan i izveštaji</h3><p>Rasporedite aktivnosti, pratite obaveštenja, profitabilnost i poređenje sezona.</p></article>
      </section>
      <section className="dashboard-end">
        <span className="section-label">Jednostavno i pregledno</span>
        <h2>Bolja organizacija počinje dobrim podacima.</h2>
      </section>
    </div>
  );
}
