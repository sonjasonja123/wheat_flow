const router = require('express').Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Upravljanje troškovima
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - name
 *         - amount
 *         - date
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Gorivo
 *         amount:
 *           type: number
 *           example: 12500
 *         date:
 *           type: string
 *           format: date
 *           example: 2025-03-01
 *         description:
 *           type: string
 *           example: Dizel za traktor
 */

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Lista svih troškova
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista troškova
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 */
router.get('/', authMiddleware, expenseController.getAll);

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Kreiranje novog troška
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       200:
 *         description: Trošak uspešno dodat
 */
router.post('/', authMiddleware, expenseController.create);

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Izmena postojećeg troška
 *     tags: [Expenses]
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
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       200:
 *         description: Trošak uspešno izmenjen
 */
router.put('/:id', authMiddleware, expenseController.update);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Brisanje troška
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trošak obrisan
 */
router.delete('/:id', authMiddleware, expenseController.remove);

module.exports = router;
