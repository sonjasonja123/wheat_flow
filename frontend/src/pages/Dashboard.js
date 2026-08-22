import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const fields = (await api.get('/fields')).data;
        const field = fields.find(item => Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng)));
        if (!field) return;
        const params = new URLSearchParams({
          latitude: field.lat,
          longitude: field.lng,
          current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m',
          timezone: 'Europe/Belgrade'
        });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        if (!response.ok) return;
        setWeather({ field: field.name, ...(await response.json()).current });
      } catch {
        setWeather(null);
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
        </section>
      )}
      <section className="dashboard-intro">
        <span className="section-label">O platformi</span>
        <h2>Vaš pouzdan partner u poljoprivrednoj proizvodnji</h2>
        <p>Proizvodnja pšenice zahteva znanje, iskustvo i pravovremene odluke. AgroPanel pomaže da organizujete podatke i pratite svaki važan korak — od jesenje setve i prihrane do zaštite useva i žetve.</p>
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
