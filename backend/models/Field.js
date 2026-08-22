module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('Field', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    area: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    soilType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING, // i dalje može biti opisna lokacija
      allowNull: true
    },
    season: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lat: {              // dodato za mapu
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    },
    lng: {              // dodato za mapu
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true
    }
  });

  Field.associate = (models) => {
    Field.hasMany(models.Production, { foreignKey: 'fieldId' });
  };

  return Field;
};
