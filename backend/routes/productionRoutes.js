const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Productions
 *   description: Evidencija proizvodnje
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Production:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         fieldId:
 *           type: integer
 *           example: 3
 *         cropId:
 *           type: integer
 *           example: 5
 *         date:
 *           type: string
 *           format: date
 *           example: 2026-01-31
 *         quantity:
 *           type: number
 *           example: 1200
 */

/**
 * @swagger
 * /api/productions:
 *   get:
 *     summary: Dohvatanje svih produkcija
 *     tags: [Productions]
 *     responses:
 *       200:
 *         description: Lista svih produkcija
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Production'
 */
router.get('/', authMiddleware, productionController.getAll);

/**
 * @swagger
 * /api/productions:
 *   post:
 *     summary: Kreiranje nove produkcije
 *     tags: [Productions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Production'
 *     responses:
 *       200:
 *         description: Produkcija uspešno kreirana
 */
router.post('/', authMiddleware, productionController.create);

/**
 * @swagger
 * /api/productions/{id}:
 *   put:
 *     summary: Ažuriranje postojeće produkcije
 *     tags: [Productions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Production'
 *     responses:
 *       200:
 *         description: Produkcija uspešno ažurirana
 */
router.put('/:id', authMiddleware, productionController.update);

module.exports = router;
