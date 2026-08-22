-- Test podaci za agriculture_db
-- PAZNJA: skripta brise postojece podatke iz aplikacionih tabela.
-- Svi test korisnici imaju lozinku: Test123!

CREATE DATABASE IF NOT EXISTS agriculture_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE agriculture_db;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM notifications;
DELETE FROM Expenses;
DELETE FROM crops;
DELETE FROM productions;
DELETE FROM fields;
DELETE FROM users;
SET FOREIGN_KEY_CHECKS = 1;

-- Uloge koje aplikacija koristi: 1 Admin, 2 Manager, 3 Agronom,
-- 4 Owner/Vlasnik, 5 Radnik. Trenutna sema cuva samo roleId u users.
-- Hash ispod predstavlja lozinku Test123! za sve test naloge.
INSERT INTO users (id, name, email, password, roleId, createdAt, updatedAt) VALUES
  (1, 'Ana Administrator', 'admin@test.rs', '$2b$10$3MWzp25OMAuD86IDJtosw.4DswPepkIZf1BJtCt696QOjraMeNaYS', 1, NOW(), NOW()),
  (2, 'Milan Menadzer',    'manager@test.rs', '$2b$10$3MWzp25OMAuD86IDJtosw.4DswPepkIZf1BJtCt696QOjraMeNaYS', 2, NOW(), NOW()),
  (3, 'Jelena Agronom',    'agronom@test.rs', '$2b$10$3MWzp25OMAuD86IDJtosw.4DswPepkIZf1BJtCt696QOjraMeNaYS', 3, NOW(), NOW()),
  (4, 'Petar Vlasnik',     'owner@test.rs', '$2b$10$3MWzp25OMAuD86IDJtosw.4DswPepkIZf1BJtCt696QOjraMeNaYS', 4, NOW(), NOW()),
  (5, 'Marko Radnik',      'radnik@test.rs', '$2b$10$3MWzp25OMAuD86IDJtosw.4DswPepkIZf1BJtCt696QOjraMeNaYS', 5, NOW(), NOW());

INSERT INTO fields (id, name, area, soilType, location, season, lat, lng, createdAt, updatedAt) VALUES
  (1, 'Severna njiva', 12.5, 'Cernozem', 'Novi Sad', 2026, 45.2671, 19.8335, NOW(), NOW()),
  (2, 'Juzni vocnjak',  6.8, 'Ilovaca',  'Sremska Mitrovica', 2026, 44.9795, 19.6209, NOW(), NOW()),
  (3, 'Parcela Dunav', 18.2, 'Aluvijalno', 'Backa Palanka', 2026, 45.2508, 19.3916, NOW(), NOW()),
  (4, 'Mala parcela',   4.3, 'Peskovito', 'Subotica', 2026, 46.1005, 19.6676, NOW(), NOW());

INSERT INTO crops (id, name, fieldId, createdAt, updatedAt) VALUES
  (1, 'Pšenica', 1, NOW(), NOW()),
  (2, 'Jabuka', 2, NOW(), NOW()),
  (3, 'Psenica', 3, NOW(), NOW()),
  (4, 'Suncokret', 4, NOW(), NOW());

INSERT INTO productions
  (id, fieldId, sowingDate, seedQuantity, hybrid, fertilizationType,
   fertilizationQuantity, fertilizationDate, protectionType,
   irrigationSystem, waterUsed, harvestDate, yieldKg, createdAt, updatedAt)
VALUES
  (1, 1, '2025-10-15', 250, 'Pobeda', 'NPK 15:15:15', 450, '2026-03-10', 'Herbicid', 'Kap po kap', 1250, '2026-07-05', 9850, NOW(), NOW()),
  (2, 2, '2026-02-15',  80, 'Ajdared', 'KAN', 180, '2026-03-05', 'Fungicid', 'Kap po kap', 780, '2026-10-05', 12400, NOW(), NOW()),
  (3, 3, '2025-10-18', 320, 'Simonida', 'UREA', 520, '2026-02-25', 'Herbicid', 'Prskalice', 2100, '2026-07-10', 14150, NOW(), NOW()),
  (4, 4, '2026-04-02',  95, 'NS H 111', 'NPK 16:16:16', 210, '2026-03-25', 'Insekticid', 'Bez navodnjavanja', 0, NULL, NULL, NOW(), NOW());

INSERT INTO Expenses (id, fieldId, productionId, TYPE, description, amount, DATE) VALUES
  (1, 1, 1, 'Seme', 'Kupovina semena sorte Pobeda', 78500, '2025-10-01'),
  (2, 1, 1, 'Gorivo', 'Priprema i setva parcele', 32400, '2026-03-20'),
  (3, 2, 2, 'Zastita', 'Prolecno tretiranje vocnjaka', 45900, '2026-04-12'),
  (4, 3, 3, 'Djubrivo', 'UREA za prihranu psenice', 112000, '2026-02-25'),
  (5, 3, 3, 'Navodnjavanje', 'Potrosnja vode i elektricne energije', 28600, '2026-05-15'),
  (6, 4, 4, 'Seme', 'Seme suncokreta NS H 111', 39900, '2026-03-22');

INSERT INTO notifications (id, title, message, date, isRead, userId, createdAt, updatedAt) VALUES
  (1, 'Predstojeca setva', 'Planirana je setva pšenice na Severnoj njivi.', '2025-10-10', 1, 1, NOW(), NOW()),
  (2, 'Prihrana useva', 'Potrebno je proveriti stanje psenice nakon prihrane.', '2026-03-01', 0, 3, NOW(), NOW()),
  (3, 'Trosak evidentiran', 'Dodat je trosak zastite Juznog vocnjaka.', '2026-04-12', 0, 4, NOW(), NOW()),
  (4, 'Plan navodnjavanja', 'Proveriti sistem kap po kap pre sledeceg ciklusa.', '2026-05-20', 0, 5, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE users AUTO_INCREMENT = 6;
ALTER TABLE fields AUTO_INCREMENT = 5;
ALTER TABLE crops AUTO_INCREMENT = 5;
ALTER TABLE productions AUTO_INCREMENT = 5;
ALTER TABLE Expenses AUTO_INCREMENT = 7;
ALTER TABLE notifications AUTO_INCREMENT = 5;
SET FOREIGN_KEY_CHECKS = 1;

SELECT email, roleId, 'Test123!' AS testPassword FROM users ORDER BY roleId;
