const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

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
 *             required: [name, email, password, roleId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Marko Marković
 *               email:
 *                 type: string
 *                 format: email
 *                 example: marko@example.com
 *               password:
 *                 type: string
 *                 example: SigurnaSifra123!
 *               roleId:
 *                 type: integer
 *                 example: 5
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
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: marko@example.com
 *               password:
 *                 type: string
 *                 example: SigurnaSifra123!
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

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Odjava prijavljenog korisnika
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token se uklanja na klijentu i odjava je potvrđena
 *       401:
 *         description: Neautorizovan zahtev
 */

router.post('/register', auth, allowRoles(1, 4), authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);

module.exports = router;
