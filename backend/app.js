const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import modela i baza
const db = require("./models"); // tvoja Sequelize konfiguracija

// Import ruta
const authRoutes = require("./routes/authRoutes");
const productionRoutes = require("./routes/productionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const cropRoutes = require("./routes/cropRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const reportRoutes = require("./routes/reportRoutes");

// Middleware rute
app.use("/api/auth", authRoutes);
app.use("/api/productions", productionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/reports", reportRoutes);

// Test ruta
app.get("/", (req, res) => {
  res.send("API je ziv!");
});

// Sinhronizacija sa bazom i start servera
if (require.main === module) {
  db.sequelize.sync({ alter: true })
    .then(() => {
      console.log("Database synced");
      app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch((err) => console.error("Error syncing DB:", err));
}

module.exports = app;
