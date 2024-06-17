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

  return Stock;
};
