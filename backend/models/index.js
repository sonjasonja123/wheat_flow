const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json')['development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  }
);

const db = {};

// Import modela (malim slovom – ime fajla)
db.Role = require('./role')(sequelize, DataTypes);
db.User = require('./user')(sequelize, DataTypes);
db.Field = require('./field')(sequelize, DataTypes);
db.Crop = require('./crop')(sequelize, DataTypes);
db.Production = require('./production')(sequelize, DataTypes);
db.Expense = require('./expense')(sequelize, DataTypes);
db.Notification = require('./Notification')(sequelize, DataTypes); // ispravljeno

// Definisanje veza

// User - Role (M:1)
db.Role.hasMany(db.User, { foreignKey: 'roleId' });
db.User.belongsTo(db.Role, { foreignKey: 'roleId' });

// Field - Crop (1:M)
db.Field.hasMany(db.Crop, { foreignKey: 'fieldId', onDelete: 'CASCADE' });
db.Crop.belongsTo(db.Field, { foreignKey: 'fieldId' });

// Field - Production (1:M)
db.Field.hasMany(db.Production, { foreignKey: 'fieldId', onDelete: 'CASCADE' });
db.Production.belongsTo(db.Field, { foreignKey: 'fieldId' });

// Production - Expense (1:M)
db.Production.hasMany(db.Expense, { foreignKey: 'productionId', onDelete: 'CASCADE' });
db.Expense.belongsTo(db.Production, { foreignKey: 'productionId' });

// Notification - User (M:1) (opciono)
db.User.hasMany(db.Notification, { foreignKey: 'userId', onDelete: 'SET NULL' });
db.Notification.belongsTo(db.User, { foreignKey: 'userId' });

// Dodaj sequelize i Sequelize objekat
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
