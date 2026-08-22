module.exports = (sequelize, DataTypes) => sequelize.define('Contract', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employeeId: { type: DataTypes.INTEGER, allowNull: false },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY, allowNull: true },
  salary: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
  status: {
    type: DataTypes.ENUM('Aktivan', 'Istekao', 'Raskinut'),
    allowNull: false,
    defaultValue: 'Aktivan'
  },
  notes: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'contracts', timestamps: true });
