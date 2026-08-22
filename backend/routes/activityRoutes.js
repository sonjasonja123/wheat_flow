const router = require('express').Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/activityController');

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Lista planiranih aktivnosti
 *     tags: [Activities]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista aktivnosti }
 *   post:
 *     summary: Dodavanje aktivnosti i obaveštavanje zaposlenog
 *     tags: [Activities]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Aktivnost je kreirana }
 */

router.get('/', auth, controller.getAll);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
