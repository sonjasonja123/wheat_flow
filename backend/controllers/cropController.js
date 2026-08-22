const { Crop } = require('../models');

// Svi usevi
exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.findAll();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCrop = async (req, res) => {
  try {
    const { name, type, fieldId } = req.body;
    const crop = await Crop.create({ name, type, fieldId });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    await crop.update(req.body);
    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    await crop.destroy();
    res.json({ message: 'Crop deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
