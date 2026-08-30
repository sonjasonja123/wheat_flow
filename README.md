# Wheat Flow — upravljanje proizvodnjom pšenice

Wheat Flow je full-stack informacioni sistem za parcele, proizvodnju pšenice, troškove, aktivnosti zaposlenih, ugovore, obaveštenja i analitičke izveštaje.

## Glavne mogućnosti

- JWT prijava i autorizacija za administratora, menadžera, agronoma, vlasnika i radnika
- CRUD parcela, izbor tipa zemljišta i odabir koordinata na Google mapi
- proizvodnja pšenice: setva, sorta, đubrenje, zaštita, navodnjavanje, žetva, prinos i prodajna cena
- izbor sorti pšenice Avenue, Simonida, Solindo CS i LG Asterion
- kontrola redosleda datuma: setva → đubrenje → žetva
- troškovi povezani sa parcelom i proizvodnjom
- aktivnosti povezane sa proizvodnjom: izbor faze automatski popunjava naziv, parcelu i datum
- mesečni kalendar aktivnosti sa navigacijom kroz mesece i označavanjem završenih zadataka
- dodela aktivnosti zaposlenom, datumirani komentari/beleške i automatska obaveštenja
- evidencija ugovora zaposlenih dostupna administratoru i vlasniku
- prinos, prihodi, troškovi, profitabilnost i poređenje sezona
- grafikoni i izvoz izveštaja u Excel/štampu odnosno PDF
- Google Maps prikaz i izbor lokacija parcela
- Open-Meteo vremenski podaci i sugestije za radove prema temperaturi, padavinama, vlažnosti i vetru
- Swagger, Docker Compose i GitHub Actions

## Tok planiranja aktivnosti

Korisnik bira proizvodnju i jednu od faza za koju je datum unet: setvu, đubrenje, zaštitu ili žetvu. Sistem iz proizvodnje automatski preuzima parcelu, naziv i planirani datum. Korisnik zatim bira zaposlenog i dodaje komentar. Sačuvana aktivnost pojavljuje se u mesečnom kalendaru i listi zadataka, a dodeljeni zaposleni dobija obaveštenje.

## Izveštaji i izvoz

Izveštaji se filtriraju po godini i parceli i prikazuju seme, prinos, troškove, prihod, dobit/gubitak i poređenje sezona. Podaci se mogu izvesti u Excel ili sačuvati kao PDF korišćenjem opcije za štampanje u pregledaču. Komentari aktivnosti čuvaju se u bazi, ali trenutno nisu deo posebnog PDF izvoza.

## Lokalno pokretanje

Preduslovi su Node.js 18+, MySQL 8 i dve terminalske sesije.

1. Napravite bazu `agriculture_db`.
2. Kopirajte `backend/.env.example` u `backend/.env` i unesite svoje vrednosti.
3. Kopirajte `frontend/.env.example` u `frontend/.env` i unesite Google Maps ključ.
4. Pokrenite backend:

```powershell
cd backend
npm install
npm start
```

5. U drugom terminalu pokrenite frontend:

```powershell
cd frontend
npm install
npm start
```

Aplikacija je na http://localhost:3000, API na http://localhost:5000, a Swagger na http://localhost:5000/api-docs.

Za testne podatke prvo jednom pokrenite backend da Sequelize napravi tabele, zatim izvršite `backend/seed-test-data.sql`. Svi testni nalozi koriste lozinku `Test123!`; email adrese su navedene na kraju SQL skripte.

## Docker

```powershell
docker compose up --build
```

MySQL podaci se čuvaju u Docker volumenu `mysql_data`. Vrednost `JWT_SECRET` iz Compose datoteke služi samo za lokalni razvoj i mora se zameniti u produkciji.

## Provera

```powershell
cd backend
npm test -- --runInBand

cd ..\frontend
npm run build
```

Opcioni k6 test u `scripts/load-test.js` postepeno simulira do 500 korisnika. PowerShell skripta `scripts/backup-db.ps1` pravi MySQL rezervnu kopiju; za dnevno izvršavanje može se povezati sa Windows Task Scheduler-om.

## Bezbednost i produkcija

Lozinke se čuvaju kao bcrypt hash, API koristi JWT, provera uloga postoji i na serveru, ograničena je učestalost pokušaja prijave, a Helmet postavlja sigurnosna HTTP zaglavlja. Tajne i lokalne `.env` datoteke se ne čuvaju u Gitu. HTTPS i automatizovan dnevni raspored rezervnih kopija podešavaju se na izabranoj cloud platformi.
