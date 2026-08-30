const request = require("supertest");
const app = require("./app");
const jwt = require("jsonwebtoken");
const { swaggerSpec } = require('./swagger');
const { sanitizeText } = require('./utils/sanitize');

// Isti fallback secret koji koriste auth middleware i kontroleri
const SECRET = process.env.JWT_SECRET || "tajni_kljuc";

// Uloge (backend/constants/roles.js)
const ADMIN = 1;
const MANAGER = 2;
const AGRONOM = 3;
const OWNER = 4;
const WORKER = 5;

// Pomocna funkcija - pravi validan JWT za zadatu ulogu, bez potrebe za bazom
function tokenFor(roleId) {
  return jwt.sign({ id: 1, roleId }, SECRET, { expiresIn: "1h" });
}

describe("API Endpoints", () => {

  // Test osnovne rute
  test("GET / should return API je live!", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("API je ziv!");
  });

  // Test auth rute (primer GET, ako postoji protected ruta)
  test("GET /api/auth (unauthorized) should return 401 or redirect", async () => {
    const res = await request(app).get("/api/auth");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  // Test production ruta (primer GET)
  test("GET /api/productions (should return array)", async () => {
    const res = await request(app).get("/api/productions");
    expect([200, 401, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  // Test notifications ruta (primer POST)
  test("POST /api/notifications (send data)", async () => {
    const data = { title: "Test notification", message: "Hello" };
    const res = await request(app).post("/api/notifications").send(data);
    expect([200, 201, 400, 401, 404]).toContain(res.statusCode);
    if (res.statusCode === 200 || res.statusCode === 201) {
      expect(res.body).toHaveProperty("title");
      expect(res.body).toHaveProperty("message");
    }
  });

  test("POST /api/auth/logout potvrđuje odjavu za validan JWT", async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${tokenFor(ADMIN)}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/odjavili/i);
  });

  test("duplirane login i register rute pod /api/users ne postoje", async () => {
    const login = await request(app).post('/api/users/login').send({});
    const register = await request(app).post('/api/users/register').send({});
    expect(login.statusCode).toBe(404);
    expect(register.statusCode).toBe(404);
  });

  test("Swagger sadrži auth, crops i reports rute", () => {
    expect(swaggerSpec.paths).toHaveProperty('/api/auth/logout');
    expect(swaggerSpec.paths).toHaveProperty('/api/crops');
    expect(swaggerSpec.paths).toHaveProperty('/api/crops/{id}');
    expect(swaggerSpec.paths).toHaveProperty('/api/reports');
  });

  test("XSS sanitizacija uklanja HTML i script sadržaj", () => {
    expect(sanitizeText('<script>alert(1)</script>Bezbedna beleška')).toBe('Bezbedna beleška');
  });

});

describe("Kontrola pristupa po ulozi (RBAC)", () => {

  // ---------- TROSKOVI: Radnik nema pristup uopste ----------

  test("Radnik ne moze da vidi troskove (GET /api/expenses -> 403)", async () => {
    const res = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${tokenFor(WORKER)}`);
    expect(res.statusCode).toBe(403);
  });

  test("Radnik ne moze da kreira trosak (POST /api/expenses -> 403)", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${tokenFor(WORKER)}`)
      .send({ type: "Gorivo", amount: 100, date: "2026-01-01" });
    expect(res.statusCode).toBe(403);
  });

  test("Agronom ne moze da vidi troskove (GET /api/expenses -> 403)", async () => {
    const res = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${tokenFor(AGRONOM)}`);
    expect(res.statusCode).toBe(403);
  });

  test("Menadzer sme da pristupi troskovima (nije 401/403)", async () => {
    const res = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${tokenFor(MANAGER)}`);
    expect(res.statusCode).not.toBe(401);
    expect(res.statusCode).not.toBe(403);
  });

  // ---------- PARCELE: kreira/menja Admin, Menadzer, Vlasnik ----------

  test("Radnik ne moze da kreira parcelu (POST /api/fields -> 403)", async () => {
    const res = await request(app)
      .post("/api/fields")
      .set("Authorization", `Bearer ${tokenFor(WORKER)}`)
      .send({ name: "Parcela test", area: 1, soilType: "Ilovaca", season: 2026 });
    expect(res.statusCode).toBe(403);
  });

  test("Agronom ne moze da kreira parcelu (POST /api/fields -> 403)", async () => {
    const res = await request(app)
      .post("/api/fields")
      .set("Authorization", `Bearer ${tokenFor(AGRONOM)}`)
      .send({ name: "Parcela test", area: 1, soilType: "Ilovaca", season: 2026 });
    expect(res.statusCode).toBe(403);
  });

  test("Vlasnik sme da kreira parcelu (nije 401/403)", async () => {
    const res = await request(app)
      .post("/api/fields")
      .set("Authorization", `Bearer ${tokenFor(OWNER)}`)
      .send({ name: "Parcela test", area: 1, soilType: "Ilovaca", season: 2026 });
    expect(res.statusCode).not.toBe(401);
    expect(res.statusCode).not.toBe(403);
  });

  test("Svako prijavljeno lice sme da vidi parcele (GET /api/fields, nije 401/403)", async () => {
    const res = await request(app)
      .get("/api/fields")
      .set("Authorization", `Bearer ${tokenFor(WORKER)}`);
    expect(res.statusCode).not.toBe(401);
    expect(res.statusCode).not.toBe(403);
  });

  // ---------- USEVI: GET sada trazi token, mutacije ogranicene ----------

  test("GET /api/crops bez tokena vraca 401", async () => {
    const res = await request(app).get("/api/crops");
    expect(res.statusCode).toBe(401);
  });

  test("Radnik ne moze da kreira usev (POST /api/crops -> 403)", async () => {
    const res = await request(app)
      .post("/api/crops")
      .set("Authorization", `Bearer ${tokenFor(WORKER)}`)
      .send({ name: "Psenica", fieldId: 1 });
    expect(res.statusCode).toBe(403);
  });

  test("Menadzer sme da kreira usev (nije 401/403)", async () => {
    const res = await request(app)
      .post("/api/crops")
      .set("Authorization", `Bearer ${tokenFor(MANAGER)}`)
      .send({ name: "Psenica", fieldId: 1 });
    expect(res.statusCode).not.toBe(401);
    expect(res.statusCode).not.toBe(403);
  });

  // ---------- PROIZVODNJA: mutacije ogranicene na Admin/Menadzer/Vlasnik ----------

  test("Radnik ne moze da kreira proizvodnju (POST /api/productions -> 403)", async () => {
    const res = await request(app)
      .post("/api/productions")
      .set("Authorization", `Bearer ${tokenFor(WORKER)}`)
      .send({ fieldId: 1, sowingDate: "2026-01-01" });
    expect(res.statusCode).toBe(403);
  });

  test("Agronom sme samo da gleda proizvodnju, ne i da je kreira (403)", async () => {
    const res = await request(app)
      .post("/api/productions")
      .set("Authorization", `Bearer ${tokenFor(AGRONOM)}`)
      .send({ fieldId: 1, sowingDate: "2026-01-01" });
    expect(res.statusCode).toBe(403);
  });

  test("Admin sme da kreira proizvodnju (nije 401/403)", async () => {
    const res = await request(app)
      .post("/api/productions")
      .set("Authorization", `Bearer ${tokenFor(ADMIN)}`)
      .send({ fieldId: 1, sowingDate: "2026-01-01" });
    expect(res.statusCode).not.toBe(401);
    expect(res.statusCode).not.toBe(403);
  });

  test("Menadzer ne moze da vidi ugovore (GET /api/contracts -> 403)", async () => {
    const res = await request(app)
      .get("/api/contracts")
      .set("Authorization", `Bearer ${tokenFor(MANAGER)}`);
    expect(res.statusCode).toBe(403);
  });

});
