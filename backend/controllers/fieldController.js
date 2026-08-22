const { Field } = require('../models');

// GET all fields
exports.getAll = async (req, res) => {
  try {
    const fields = await Field.findAll({ raw: true });
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new field
exports.create = async (req, res) => {
  try {
    // Samo Admin i Owner mogu da dodaju
    if (![1, 4].includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Niste ovlašćeni da dodate parcelu' });
    }

    const { name, area, soilType, location, season, lat, lng } = req.body;
    const field = await Field.create({ name, area, soilType, location, season, lat, lng });
    res.json(field);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE field
exports.update = async (req, res) => {
  try {
    // Samo Admin i Owner mogu da menjaju
    if (![1, 4].includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Niste ovlašćeni da menjate parcelu' });
    }

    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: 'Parcela nije pronađena' });

    const { name, area, soilType, location, season, lat, lng } = req.body;
    await field.update({ name, area, soilType, location, season, lat, lng });

    res.json(field);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE field
exports.remove = async (req, res) => {
  try {
    // Samo Admin i Owner mogu da brišu
    if (![1, 4].includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Niste ovlašćeni da obrišete parcelu' });
    }

    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: 'Parcela nije pronađena' });

    await field.destroy();
    res.json({ message: 'Parcela obrisana' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
