module.exports = (sequelize, DataTypes) => {
    const Case = sequelize.define('Case', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ticker: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
  
    Case.associate = (models) => {
      Case.belongsTo(models.Stock, { foreignKey: 'ticker', targetKey: 'ticker' });
    };
  
    return Case;
  };