const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Korisnici sistema poljoprivredne proizvodnje
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registracija novog korisnika (zahteva autentifikaciju)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - roleId
 *             properties:
 *               username:
 *                 type: string
 *                 example: marko
 *               password:
 *                 type: string
 *                 example: sifra123
 *               roleId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Korisnik uspešno registrovan
 *       403:
 *         description: Niste ovlašćeni
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Prijava korisnika
 *     tags: [Users]
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
 *       401:
 *         description: Pogrešni kredencijali
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Dohvatanje informacija o trenutno ulogovanom korisniku
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informacije o korisniku
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Neautorizovan
 */

router.post('/register', auth, userController.register);
router.post('/login', userController.login);
router.get('/me', auth, async (req, res) => {
  res.json({ userId: req.user.id });
});

module.exports = router;
