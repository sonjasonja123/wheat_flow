const { Activity, Field, Production, User, Notification } = require('../models');

const productionDateFields = {
  Setva: 'sowingDate',
  'Đubrenje': 'fertilizationDate',
  'Zaštita': 'protectionDate',
  'Žetva': 'harvestDate'
};

const toDateOnly = value => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
};

const include = [
  { model: Field, attributes: ['id', 'name'] },
  { model: Production, attributes: ['id'] },
  { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
];

exports.getAll = async (req, res) => {
  try {
    const where = req.user.roleId === 5 ? { assignedUserId: req.user.id } : {};
    const rows = await Activity.findAll({ where, include, order: [['plannedDate', 'ASC']] });
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (![1, 2, 3, 4].includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Radnik ne može da raspoređuje nove aktivnosti.' });
    }
    const activityData = { ...req.body, createdBy: req.user.id };
    if (activityData.productionId && activityData.type !== 'Ostalo') {
      const production = await Production.findByPk(activityData.productionId, { include: [{ model: Field, attributes: ['name'] }] });
      if (!production) return res.status(404).json({ message: 'Proizvodnja nije pronađena.' });
      const dateField = productionDateFields[activityData.type];
      if (!dateField || !production[dateField]) {
        return res.status(400).json({ message: `Datum za aktivnost „${activityData.type}“ nije unet u proizvodnji.` });
      }
      activityData.fieldId = production.fieldId;
      activityData.plannedDate = toDateOnly(production[dateField]);
      activityData.title = `${activityData.type} — ${production.Field?.name || `parcela #${production.fieldId}`}`;
    }
    const activity = await Activity.create(activityData);
    if (activity.assignedUserId) {
      await Notification.create({
        title: 'Nova radna aktivnost',
        message: `${activity.title} — planirano za ${activity.plannedDate}`,
        date: activity.plannedDate,
        userId: activity.assignedUserId
      });
    }
    return res.status(201).json(activity);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Aktivnost nije pronađena.' });
    const workerOwnTask = req.user.roleId === 5 && Number(activity.assignedUserId) === Number(req.user.id);
    if (req.user.roleId === 5 && !workerOwnTask) {
      return res.status(403).json({ message: 'Možete menjati samo svoje aktivnosti.' });
    }
    const allowedBody = req.user.roleId === 5
      ? { completed: req.body.completed, notes: req.body.notes }
      : req.body;
    await activity.update(allowedBody);
    return res.json(activity);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (![1, 2, 4].includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Nemate dozvolu za brisanje aktivnosti.' });
    }
    const deleted = await Activity.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Aktivnost nije pronađena.' });
    return res.json({ message: 'Aktivnost je obrisana.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
