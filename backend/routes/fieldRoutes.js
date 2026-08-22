const express = require('express');
const router = express.Router();
const controller = require('../controllers/fieldController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Fields
 *   description: Upravljanje parcelama
 */

// Svi zahtevi prolaze kroz JWT autentifikaciju
router.use(authMiddleware);

/**
 * @swagger
 * /api/fields:
 *   get:
 *     summary: Vraća sve parcele
 *     tags: [Fields]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista parcela
 *       401:
 *         description: Neautorizovan pristup
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/fields:
 *   post:
 *     summary: Kreira novu parcelu
 *     tags: [Fields]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - area
 *               - soilType
 *               - season
 *             properties:
 *               name:
 *                 type: string
 *                 example: Parcela A
 *               area:
 *                 type: number
 *                 example: 2.5
 *               soilType:
 *                 type: string
 *                 example: Ilovača
 *               location:
 *                 type: string
 *                 example: "44.8176,20.4569"
 *               season:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       201:
 *         description: Parcela uspešno kreirana
 *       400:
 *         description: Neispravan zahtev
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/fields/{id}:
 *   put:
 *     summary: Izmena postojeće parcele
 *     tags: [Fields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Parcela uspešno izmenjena
 *       404:
 *         description: Parcela nije pronađena
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/fields/{id}:
 *   delete:
 *     summary: Brisanje parcele
 *     tags: [Fields]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Parcela uspešno obrisana
 *       404:
 *         description: Parcela nije pronađena
 */
router.delete('/:id', controller.remove);

module.exports = router;
