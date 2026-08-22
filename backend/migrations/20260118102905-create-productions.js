'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      quantity: { type: Sequelize.FLOAT, allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      cropId: {
        type: Sequelize.INTEGER,
        references: { model: 'crops', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('productions');
  }
};
