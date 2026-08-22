const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentifikacija korisnika
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registracija novog korisnika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: marko
 *               password:
 *                 type: string
 *                 example: sifra123
 *     responses:
 *       200:
 *         description: Korisnik uspešno registrovan
 *       400:
 *         description: Pogrešan zahtev / nedostaju podaci
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Prijava korisnika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: marko
 *               password:
 *                 type: string
 *                 example: sifra123
 *     responses:
 *       200:
 *         description: Uspesna prijava sa JWT tokenom
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *       401:
 *         description: Pogrešni kredencijali
 */

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
