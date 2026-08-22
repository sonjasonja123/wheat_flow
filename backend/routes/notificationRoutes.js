const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  markAsRead,
  generateNotifications,
  deleteAllNotifications
} = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Sistem obaveštenja
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         message:
 *           type: string
 *           example: Ističe rok za setvu pšenice
 *         isRead:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Dohvatanje svih obaveštenja
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista obaveštenja
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
router.get('/', authMiddleware, getAllNotifications);

/**
 * @swagger
 * /api/notifications/generate:
 *   post:
 *     summary: Generisanje obaveštenja na osnovu proizvodnje
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Obaveštenja uspešno generisana
 */
router.post('/generate', authMiddleware, generateNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Označi obaveštenje kao pročitano
 *     tags: [Notifications]
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
 *         description: Obaveštenje označeno kao pročitano
 */
router.put('/:id/read', authMiddleware, markAsRead);

/**
 * @swagger
 * /api/notifications:
 *   delete:
 *     summary: Brisanje svih obaveštenja
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sva obaveštenja obrisana
 */
router.delete('/', authMiddleware, deleteAllNotifications);

module.exports = router;
