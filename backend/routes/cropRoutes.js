const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/role');

router.get('/', auth, cropController.getAllCrops);
router.get('/:id', auth, cropController.getCropById);
router.post('/', auth, allowRoles(1, 2, 4), cropController.createCrop);
router.put('/:id', auth, allowRoles(1, 2, 4), cropController.updateCrop);
router.delete('/:id', auth, allowRoles(1, 2, 4), cropController.deleteCrop);

module.exports = router;
