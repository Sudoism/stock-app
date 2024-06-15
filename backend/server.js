const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

const Stock = require('./models/stock')(sequelize, DataTypes);
const Note = require('./models/note')(sequelize, DataTypes);

sequelize.sync();

const stockRoutes = require('./routes/stocks');
const noteRoutes = require('./routes/notes');

app.use('/api/stocks', stockRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.send('Stock App Backend');
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});

module.exports = app;
