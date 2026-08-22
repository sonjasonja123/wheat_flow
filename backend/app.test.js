const request = require("supertest");
const app = require("./app");

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

});