module.exports = (sequelize, DataTypes) => sequelize.define('Activity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  type: {
    type: DataTypes.ENUM('Setva', 'Đubrenje', 'Zaštita', 'Navodnjavanje', 'Žetva', 'Ostalo'),
    allowNull: false,
    defaultValue: 'Ostalo'
  },
  plannedDate: { type: DataTypes.DATEONLY, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  notes: { type: DataTypes.TEXT, allowNull: true },
  fieldId: { type: DataTypes.INTEGER, allowNull: true },
  assignedUserId: { type: DataTypes.INTEGER, allowNull: true },
  createdBy: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'activities', timestamps: true });
