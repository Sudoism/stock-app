module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
      name: DataTypes.STRING,
      ticker: DataTypes.STRING,
      price: DataTypes.FLOAT,
      owned: DataTypes.BOOLEAN,
    });
    return Stock;
  };
  