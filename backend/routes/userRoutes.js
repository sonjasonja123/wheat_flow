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

router.get('/', auth, userController.getAll);
router.get('/me', auth, async (req, res) => {
  res.json({ userId: req.user.id });
});

module.exports = router;
