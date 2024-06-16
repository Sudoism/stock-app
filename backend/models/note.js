// models/note.js
module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('Note', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      stockId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      noteDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    return Note;
  };
  