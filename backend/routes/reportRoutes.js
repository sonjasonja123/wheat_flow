const express = require('express');
const { query, validationResult } = require('express-validator');
const { getReport } = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');
const allowRoles = require('../middleware/role');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Analitika proizvodnje, troškova i profitabilnosti
 */

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Generisanje analitičkog izveštaja
 *     tags: [Reports]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema: { type: integer, minimum: 2000, maximum: 2100 }
 *         description: Godina setve i troškova
 *       - in: query
 *         name: fieldId
 *         required: false
 *         schema: { type: integer, minimum: 1 }
 *         description: ID parcele
 *     responses:
 *       200:
 *         description: Proizvodnje, troškovi, zbirni rezultati i poređenje sezona
 *       400: { description: Neispravan filter }
 *       401: { description: Neautorizovan zahtev }
 *       403: { description: Nedozvoljena uloga }
 */

const validateReportQuery = [
  query('year').optional({ checkFalsy: true }).isInt({ min: 2000, max: 2100 }).withMessage('Godina mora biti između 2000. i 2100.'),
  query('fieldId').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Parcela nije ispravna.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    next();
  }
];

router.get('/', authMiddleware, allowRoles(1, 2, 3, 4), validateReportQuery, getReport);

module.exports = router;
