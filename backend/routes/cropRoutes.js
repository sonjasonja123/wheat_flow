const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const auth = require('../middleware/auth');

router.get('/', cropController.getAllCrops);
router.get('/:id', cropController.getCropById);
router.post('/', auth, cropController.createCrop);
router.put('/:id', auth, cropController.updateCrop);
router.delete('/:id', auth, cropController.deleteCrop);

module.exports = router;
