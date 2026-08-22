const { Notification, Production } = require('../models');
const { Op } = require('sequelize');

// 1. Dohvati sve notifikacije
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['date', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot load notifications' });
  }
};

// 2. Označi notifikaciju kao pročitanu
exports.markAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { id: req.params.id } }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot mark as read' });
  }
};

// 3. Generiši notifikacije iz Production (samo nove)
exports.generateNotifications = async (req, res) => {
  try {
    const productions = await Production.findAll();

    const notificationsToCreate = [];

    productions.forEach(prod => {
      // Setva
      if (prod.sowingDate) {
        notificationsToCreate.push({
          title: `Setva na parceli ${prod.fieldId}`,
          message: `Seti ${prod.seedQuantity} kg ${prod.hybrid}`,
          date: prod.sowingDate,
          isRead: false
        });
      }
      // Đubrenje
      if (prod.fertilizationDate) {
        notificationsToCreate.push({
          title: `Đubrenje na parceli ${prod.fieldId}`,
          message: `${prod.fertilizationType} - ${prod.fertilizationQuantity}`,
          date: prod.fertilizationDate,
          isRead: false
        });
      }
      // Zaštita (ako postoji)
      if (prod.protectionType && prod.protectionDate) {
        notificationsToCreate.push({
          title: `Zaštita na parceli ${prod.fieldId}`,
          message: `${prod.protectionType}`,
          date: prod.protectionDate,
          isRead: false
        });
      }
      // Žetva
      if (prod.harvestDate) {
        notificationsToCreate.push({
          title: `Žetva na parceli ${prod.fieldId}`,
          message: `Očekivani prinos: ${prod.yieldKg} kg`,
          date: prod.harvestDate,
          isRead: false
        });
      }
    });

    // Ubaci nove notifikacije samo ako ne postoje
    for (const n of notificationsToCreate) {
      const exists = await Notification.findOne({
        where: { date: n.date, message: n.message }
      });
      if (!exists) {
        await Notification.create(n);
      }
    }

    res.json({ message: 'Notifications generated', count: notificationsToCreate.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot generate notifications' });
  }
};

// 4. Obrisati sve notifikacije (opciono)
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.destroy({ where: {} });
    res.json({ message: 'All notifications deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot delete notifications' });
  }
};
