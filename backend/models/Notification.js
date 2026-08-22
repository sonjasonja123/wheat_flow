module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    userId: { type: DataTypes.INTEGER, allowNull: true } // dodano
  });

  return Notification;
};
