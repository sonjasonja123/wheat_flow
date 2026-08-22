module.exports = (sequelize, DataTypes) => {
  const Crop = sequelize.define('Crop', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'crops',
    timestamps: true,
  });

  return Crop;
};
