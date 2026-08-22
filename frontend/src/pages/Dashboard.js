import React from 'react';

export default function Dashboard() {
  return (
    <div className="dash">
      <section className="bg">
        <div className="hero-content">
          <span className="hero-kicker">Digitalno upravljanje gazdinstvom</span>
          <h1>Pametnije odluke.<br />Bolji prinos.</h1>
          <p>Sve što ti je potrebno za pregled proizvodnje na jednom mestu.</p>
        </div>
      </section>
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
        <article><span>04</span><h3>Izveštaji i obaveštenja</h3><p>Dobijte jasan zbir rezultata i ne propustite važne aktivnosti na imanju.</p></article>
      </section>
      <section className="dashboard-end">
        <span className="section-label">Jednostavno i pregledno</span>
        <h2>Bolja organizacija počinje dobrim podacima.</h2>
        <p>Prijavite se i nastavite sa upravljanjem proizvodnjom svog gazdinstva.</p>
      </section>
    </div>
  );
}
