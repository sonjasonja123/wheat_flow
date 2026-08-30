'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activities', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      type: {
        type: Sequelize.ENUM('Setva', 'Đubrenje', 'Zaštita', 'Navodnjavanje', 'Žetva', 'Ostalo'),
        allowNull: false,
        defaultValue: 'Ostalo'
      },
      plannedDate: { type: Sequelize.DATEONLY, allowNull: false },
      completed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      notes: { type: Sequelize.TEXT, allowNull: true },
      productionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'productions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fieldId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'fields', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      assignedUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('activities');
  }
};
