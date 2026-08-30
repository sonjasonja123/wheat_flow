const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require("dotenv").config();

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '200kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

// Import modela i baza
const db = require("./models");

// Import ruta
const authRoutes = require("./routes/authRoutes");
const productionRoutes = require("./routes/productionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const cropRoutes = require("./routes/cropRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const reportRoutes = require("./routes/reportRoutes");
const activityRoutes = require("./routes/activityRoutes");
const contractRoutes = require("./routes/contractRoutes");
const { swaggerUi, swaggerSpec } = require('./swagger');

// Middleware rute
app.use("/api/auth", authRoutes);
app.use("/api/productions", productionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/contracts", contractRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test ruta
app.get("/", (req, res) => {
  res.send("API je ziv!");
});
app.get('/api/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    return res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    return res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

// Sinhronizacija sa bazom i start servera
if (require.main === module) {
  const syncOptions = process.env.DB_SCHEMA_ALTER === 'true' ? { alter: true } : {};
  const prepareDatabase = process.env.NODE_ENV === 'production' && process.env.DB_SYNC !== 'true'
    ? db.sequelize.authenticate()
    : db.sequelize.sync(syncOptions);
  prepareDatabase
    .then(async () => {
      try {
        await db.Role.bulkCreate([
          { id: 1, name: 'Administrator' },
          { id: 2, name: 'Menadžer' },
          { id: 3, name: 'Agronom' },
          { id: 4, name: 'Vlasnik' },
          { id: 5, name: 'Radnik' }
        ], { updateOnDuplicate: ['name'] });
      } catch (seedErr) {
        console.error('Role seed preskočen (verovatno migracije još nisu pokrenute):', seedErr.message);
      }
      console.log(process.env.NODE_ENV === 'production' ? "Database connected" : "Database ready");
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("Error syncing DB:", err));
}

module.exports = app;
