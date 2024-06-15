module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('Note', {
      stockId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      date: DataTypes.DATE,
    });
    return Note;
  };
  