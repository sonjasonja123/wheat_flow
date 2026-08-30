const router = require('express').Router();
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');
const controller = require('../controllers/contractController');

/**
 * @swagger
 * /api/contracts:
 *   get:
 *     summary: Lista ugovora zaposlenih
 *     tags: [Contracts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista ugovora }
 *   post:
 *     summary: Kreiranje ugovora
 *     tags: [Contracts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Ugovor je kreiran }
 */

router.use(auth, allowRoles(1, 4));
router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
