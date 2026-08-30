const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

/**
 * @swagger
 * tags:
 *   name: Crops
 *   description: Evidencija biljnih kultura po parcelama
 * components:
 *   schemas:
 *     CropInput:
 *       type: object
 *       required: [name, fieldId]
 *       properties:
 *         name: { type: string, example: Pšenica }
 *         type: { type: string, example: Ozima }
 *         fieldId: { type: integer, example: 1 }
 */

/**
 * @swagger
 * /api/crops:
 *   get:
 *     summary: Lista svih kultura
 *     tags: [Crops]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista kultura }
 *   post:
 *     summary: Kreiranje kulture
 *     tags: [Crops]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CropInput' }
 *     responses:
 *       200: { description: Kultura je kreirana }
 *       403: { description: Nedozvoljena uloga }
 */

/**
 * @swagger
 * /api/crops/{id}:
 *   get:
 *     summary: Dohvatanje kulture po ID-u
 *     tags: [Crops]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Podaci kulture }
 *       404: { description: Kultura nije pronađena }
 *   put:
 *     summary: Izmena kulture
 *     tags: [Crops]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CropInput' }
 *     responses:
 *       200: { description: Kultura je izmenjena }
 *       403: { description: Nedozvoljena uloga }
 *       404: { description: Kultura nije pronađena }
 *   delete:
 *     summary: Brisanje kulture
 *     tags: [Crops]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Kultura je obrisana }
 *       403: { description: Nedozvoljena uloga }
 *       404: { description: Kultura nije pronađena }
 */

router.get('/', auth, cropController.getAllCrops);
router.get('/:id', auth, cropController.getCropById);
router.post('/', auth, allowRoles(1, 2, 4), cropController.createCrop);
router.put('/:id', auth, allowRoles(1, 2, 4), cropController.updateCrop);
router.delete('/:id', auth, allowRoles(1, 2, 4), cropController.deleteCrop);

module.exports = router;
