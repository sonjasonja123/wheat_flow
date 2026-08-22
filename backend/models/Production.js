module.exports = (sequelize, DataTypes) => {
  const Production = sequelize.define('Production', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    fieldId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: 'fieldId'   // eksplicitno mapiranje na kolonu u bazi
    },
    sowingDate: { 
      type: DataTypes.DATE, 
      allowNull: true,
      field: 'sowingDate'
    },
    seedQuantity: { 
      type: DataTypes.FLOAT, 
      allowNull: true,
      field: 'seedQuantity'
    },
    hybrid: { 
      type: DataTypes.STRING, 
      allowNull: true,
      field: 'hybrid'
    },
    fertilizationType: { 
      type: DataTypes.STRING, 
      allowNull: true,
      field: 'fertilizationType'
    },
    fertilizationQuantity: { 
      type: DataTypes.FLOAT, 
      allowNull: true,
      field: 'fertilizationQuantity'
    },
    fertilizationDate: { 
      type: DataTypes.DATE, 
      allowNull: true,
      field: 'fertilizationDate'
    },
    protectionType: { 
      type: DataTypes.STRING, 
      allowNull: true,
      field: 'protectionType'
    },
    irrigationSystem: { 
      type: DataTypes.STRING, 
      allowNull: true,
      field: 'irrigationSystem'
    },
    waterUsed: { 
      type: DataTypes.FLOAT, 
      allowNull: true,
      field: 'waterUsed'
    },
    harvestDate: { 
      type: DataTypes.DATE, 
      allowNull: true,
      field: 'harvestDate'
    },
    yieldKg: { 
      type: DataTypes.FLOAT, 
      allowNull: true,
      field: 'yieldKg'
    }
  }, {
    tableName: 'productions', // ime tabele u bazi
    timestamps: true           // ostavi ako tabela ima createdAt/updatedAt
  });

  Production.associate = (models) => {
    Production.belongsTo(models.Field, { foreignKey: 'fieldId' });
  };

  return Production;
};
