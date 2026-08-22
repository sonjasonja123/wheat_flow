
# Sistem za upravljanje poljoprivrednom proizvodnjom


Ova aplikacija predstavlja informacioni sistem za evidenciju i upravljanje poljoprivrednom proizvodnjom. Namenjena je proizvođačima i administratorima radi praćenja parcela, proizvodnje, prinosa i statistike.

Aplikacija je razvijena kao full-stack web rešenje sa REST API-jem, Docker podrškom i automatizovanim procesima.

---


## Funkcionalnosti


- Upravljanje poljoprivrednim parcelama
- Evidencija proizvodnje i prinosa
- Pregled statistike i izveštaja
- Autentifikacija i autorizacija korisnika
- Vizualizacija podataka (grafici / mapa)
- Integracija sa eksternim API-jima

---


## Tehnologije


### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL 
- Swagger (OpenAPI)

### Frontend
- React
- Axios
- Chart.js / Google Charts *(ili Google Maps API)*

### DevOps
- Docker
- Docker Compose
- GitHub Actions (CI/CD)

---


## Pokretanje aplikacije lokalno
-bash koji je otvoren u backendu
-npm start

-bash koji je otvoren u frontendu
-npm start

---

## Pokretanje aplikacije (Docker)


### Preduslovi
- Docker
- Docker Compose

### Pokretanje
```bash
docker-compose up --build
