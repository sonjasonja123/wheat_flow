const { Contract, User } = require('../models');
const { sanitizeText } = require('../utils/sanitize');

const include = [
  { model: User, as: 'employee', attributes: ['id', 'name', 'email', 'roleId'] },
  { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
];

exports.getAll = async (req, res) => {
  try {
    const rows = await Contract.findAll({ include, order: [['startDate', 'DESC']] });
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const employee = await User.findByPk(req.body.employeeId);
    if (!employee) return res.status(400).json({ message: 'Izabrani zaposleni ne postoji.' });
    if (req.body.endDate && req.body.endDate < req.body.startDate) {
      return res.status(400).json({ message: 'Datum završetka mora biti posle datuma početka.' });
    }
    const contract = await Contract.create({
      ...req.body,
      notes: sanitizeText(req.body.notes),
      ownerId: req.user.id
    });
    return res.status(201).json(contract);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Ugovor nije pronađen.' });
    await contract.update({
      ...req.body,
      ...(req.body.notes !== undefined && { notes: sanitizeText(req.body.notes) })
    });
    return res.json(contract);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Contract.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Ugovor nije pronađen.' });
    return res.json({ message: 'Ugovor je obrisan.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
