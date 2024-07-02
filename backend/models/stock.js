module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owned: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Stock.associate = (models) => {
    Stock.hasMany(models.Note, { foreignKey: 'stockId' });
    Stock.hasOne(models.Case, { foreignKey: 'ticker', sourceKey: 'ticker' });
  };

  return Stock;
};