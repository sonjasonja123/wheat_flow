const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const fileConfig = require('../config/config.js')[process.env.NODE_ENV || 'development'];
const config = {
  database: process.env.DB_NAME || fileConfig.database,
  username: process.env.DB_USER || fileConfig.username,
  password: process.env.DB_PASSWORD ?? fileConfig.password,
  host: process.env.DB_HOST || fileConfig.host,
  port: Number(process.env.DB_PORT || 3306),
  dialect: fileConfig.dialect
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
  }
);

const db = {};

// Import modela (malim slovom – ime fajla)
db.Role = require('./Role')(sequelize, DataTypes);
db.User = require('./User')(sequelize, DataTypes);
db.Field = require('./Field')(sequelize, DataTypes);
db.Crop = require('./Crop')(sequelize, DataTypes);
db.Production = require('./Production')(sequelize, DataTypes);
db.Expense = require('./Expense')(sequelize, DataTypes);
db.Notification = require('./Notification')(sequelize, DataTypes);
db.Activity = require('./Activity')(sequelize, DataTypes);
db.Contract = require('./Contract')(sequelize, DataTypes);

// Definisanje veza

// User - Role (M:1)
db.Role.hasMany(db.User, { foreignKey: 'roleId', constraints: false });
db.User.belongsTo(db.Role, { foreignKey: 'roleId', constraints: false });

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

db.Field.hasMany(db.Activity, { foreignKey: 'fieldId', onDelete: 'SET NULL' });
db.Activity.belongsTo(db.Field, { foreignKey: 'fieldId' });
db.Production.hasMany(db.Activity, { foreignKey: 'productionId', onDelete: 'SET NULL' });
db.Activity.belongsTo(db.Production, { foreignKey: 'productionId' });
db.User.hasMany(db.Activity, { foreignKey: 'assignedUserId', as: 'assignedActivities', onDelete: 'SET NULL' });
db.Activity.belongsTo(db.User, { foreignKey: 'assignedUserId', as: 'assignee' });
db.User.hasMany(db.Activity, { foreignKey: 'createdBy', as: 'createdActivities' });

db.Contract.belongsTo(db.User, { foreignKey: 'employeeId', as: 'employee' });
db.Contract.belongsTo(db.User, { foreignKey: 'ownerId', as: 'owner' });

// Dodaj sequelize i Sequelize objekat
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
