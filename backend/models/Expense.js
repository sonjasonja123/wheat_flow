module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'fieldId' // ovo mora da se poklapa sa bazom
    },
    productionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'productionId'
    },
    type: {
      type: DataTypes.STRING,
      field: 'TYPE'  // po bazi je veliko slovo
    },
    description: {
      type: DataTypes.STRING,
      field: 'description'
    },
    amount: {
      type: DataTypes.FLOAT,
      field: 'amount'
    },
    date: {
      type: DataTypes.DATE,
      field: 'DATE' // po bazi je veliko slovo
    }
  }, {
    tableName: 'Expenses', // eksplicitno ime tabele
    timestamps: false      // ako tabela nema createdAt/updatedAt
  });

  Expense.associate = (models) => {
    Expense.belongsTo(models.Field, { foreignKey: 'fieldId' });
    Expense.belongsTo(models.Production, { foreignKey: 'productionId' });
  };

  return Expense;
};
