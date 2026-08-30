'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      isRead: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notifications');
  }
};
