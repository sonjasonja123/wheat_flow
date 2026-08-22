const { Production } = require('../models');

const validateDates = ({ sowingDate, fertilizationDate, harvestDate }) => {
  if (fertilizationDate && !sowingDate) return 'Pre datuma đubrenja morate uneti datum setve.';
  if (harvestDate && !fertilizationDate) return 'Pre datuma žetve morate uneti datum đubrenja.';
  if (sowingDate && fertilizationDate && new Date(sowingDate) >= new Date(fertilizationDate)) {
    return 'Datum setve mora biti pre datuma đubrenja.';
  }
  if (fertilizationDate && harvestDate && new Date(fertilizationDate) >= new Date(harvestDate)) {
    return 'Datum đubrenja mora biti pre datuma žetve.';
  }
  return null;
};

exports.getAll = async (req, res) => {
  try {
    const list = await Production.findAll({ raw: true });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


exports.create = async (req, res) => {
  try {
    // req.user.id dolazi iz JWT middleware-a
    if ([3, 5].includes(req.user.roleId)) {
      return res.status(403).json({ message: 'You are not allowed to create a production' });
    }

    const dateError = validateDates(req.body);
    if (dateError) return res.status(400).json({ message: dateError });
    const production = await Production.create(req.body);
    res.json(production);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


exports.update = async (req, res) => {
  try {
    // Provera da li je korisnik zabranjen
    if ([3, 5].includes(req.user.roleId)) {
      return res.status(403).json({ message: 'You are not allowed to update a production' });
    }

    const production = await Production.findByPk(req.params.id);
    if (!production) return res.status(404).json({ message: 'Production not found' });

    const dateError = validateDates({ ...production.toJSON(), ...req.body });
    if (dateError) return res.status(400).json({ message: dateError });

    await production.update(req.body);
    res.json(production);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
