-- Test podaci za agriculture_db
-- PAZNJA: skripta brise postojece podatke iz aplikacionih tabela.
-- Svi test korisnici imaju lozinku: Test123!

CREATE DATABASE IF NOT EXISTS agriculture_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE agriculture_db;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM notifications;
DELETE FROM activities;
DELETE FROM Expenses;
DELETE FROM crops;
DELETE FROM productions;
DELETE FROM fields;
DELETE FROM users;
DELETE FROM roles;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO roles (id, name, createdAt, updatedAt) VALUES
  (1, 'Administrator', NOW(), NOW()),
  (2, 'Menadžer', NOW(), NOW()),
  (3, 'Agronom', NOW(), NOW()),
  (4, 'Vlasnik', NOW(), NOW()),
  (5, 'Radnik', NOW(), NOW());

-- Uloge koje aplikacija koristi: 1 Administrator, 2 Menadžer,
-- 3 Agronom, 4 Vlasnik, 5 Radnik.
-- Hash ispod predstavlja lozinku Test123! za sve test naloge.
INSERT INTO users (id, name, email, password, roleId, createdAt, updatedAt) VALUES
  (1, 'Ana Administrator', 'admin@test.rs', '$2b$10$3MWzp25OMAuD86IDJtosw.4DswPepkIZf1BJtCt696QOjraMeNaYS', 1, NOW(), NOW()),
  (2, 'Milan Menadzer',    'manager@test.rs', '$2b$10$3MWzp25OMAuD86IDJtosw.4DswPepkIZf1BJtCt696QOjraMeNaYS', 2, NOW(), NOW()),
  (3, 'Jelena Agronom',    'agronom@test.rs', '$2b$10$3MWzp25OMAuD86IDJtosw.4DswPepkIZf1BJtCt696QOjraMeNaYS', 3, NOW(), NOW()),
  (4, 'Petar Vlasnik',     'owner@test.rs', '$2b$10$3MWzp25OMAuD86IDJtosw.4DswPepkIZf1BJtCt696QOjraMeNaYS', 4, NOW(), NOW()),
  (5, 'Marko Radnik',      'radnik@test.rs', '$2b$10$3MWzp25OMAuD86IDJtosw.4DswPepkIZf1BJtCt696QOjraMeNaYS', 5, NOW(), NOW());

INSERT INTO fields (id, name, area, soilType, location, season, lat, lng, createdAt, updatedAt) VALUES
  (1, 'Severna njiva', 12.5, 'Cernozem', 'Novi Sad', 2026, 45.2671, 19.8335, NOW(), NOW()),
  (2, 'Južna njiva',  6.8, 'Ilovača',  'Sremska Mitrovica', 2026, 44.9795, 19.6209, NOW(), NOW()),
  (3, 'Parcela Dunav', 18.2, 'Aluvijalno', 'Backa Palanka', 2026, 45.2508, 19.3916, NOW(), NOW()),
  (4, 'Mala parcela',   4.3, 'Peskovito', 'Subotica', 2026, 46.1005, 19.6676, NOW(), NOW());

INSERT INTO crops (id, name, fieldId, createdAt, updatedAt) VALUES
  (1, 'Pšenica', 1, NOW(), NOW()),
  (2, 'Pšenica', 2, NOW(), NOW()),
  (3, 'Pšenica', 3, NOW(), NOW()),
  (4, 'Pšenica', 4, NOW(), NOW());

INSERT INTO productions
  (id, fieldId, sowingDate, seedQuantity, hybrid, fertilizationType,
   fertilizationQuantity, fertilizationDate, protectionType, protectionDate,
   irrigationSystem, waterUsed, harvestDate, yieldKg, salePricePerKg, createdAt, updatedAt)
VALUES
  (1, 1, '2025-10-15', 250, 'Pobeda', 'NPK 15:15:15', 450, '2026-03-10', 'Herbicid', '2026-04-12', 'Kap po kap', 1250, '2026-07-05', 9850, 27.50, NOW(), NOW()),
  (2, 2, '2025-10-12', 180, 'Renesansa', 'KAN', 180, '2026-03-05', 'Fungicid', '2026-04-10', 'Kap po kap', 780, '2026-07-03', 7400, 28.00, NOW(), NOW()),
  (3, 3, '2025-10-18', 320, 'Simonida', 'UREA', 520, '2026-02-25', 'Herbicid', '2026-04-15', 'Prskalice', 2100, '2026-07-10', 14150, 27.80, NOW(), NOW()),
  (4, 4, '2025-10-22', 95, 'NS 40S', 'NPK 16:16:16', 210, '2026-03-25', 'Insekticid', '2026-04-20', 'Bez navodnjavanja', 0, '2026-07-12', 3550, 28.20, NOW(), NOW());

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

INSERT INTO activities
  (id, title, type, plannedDate, completed, notes, fieldId, assignedUserId, createdBy, createdAt, updatedAt)
VALUES
  (1, 'Kontrola korova', 'Zaštita', '2026-04-12', 0, 'Proveriti vlagu pre tretmana.', 1, 5, 3, NOW(), NOW()),
  (2, 'Priprema sistema za zalivanje', 'Navodnjavanje', '2026-05-18', 0, 'Pregledati filtere i creva.', 3, 5, 2, NOW(), NOW()),
  (3, 'Merenje prinosa', 'Žetva', '2026-07-04', 0, 'Upisati izmerenu količinu.', 2, 5, 4, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 0;
ALTER TABLE users AUTO_INCREMENT = 6;
ALTER TABLE fields AUTO_INCREMENT = 5;
ALTER TABLE crops AUTO_INCREMENT = 5;
ALTER TABLE productions AUTO_INCREMENT = 5;
ALTER TABLE Expenses AUTO_INCREMENT = 7;
ALTER TABLE notifications AUTO_INCREMENT = 5;
ALTER TABLE activities AUTO_INCREMENT = 4;
SET FOREIGN_KEY_CHECKS = 1;

SELECT email, roleId, 'Test123!' AS testPassword FROM users ORDER BY roleId;
