const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const axios = require('axios');  // Import Axios
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

sequelize.sync()
  .then(() => {
   console.log('Database synced successfully.');
 })
   .catch(err => {
    console.error('Error syncing database:', err);
});

const stockRoutes = require('./routes/stocks');
const noteRoutes = require('./routes/notes');

app.use('/api/stocks', stockRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.send('Stock App Backend');
});

// New route for fetching stock data from Yahoo Finance
app.get('/api/yahoo-stock-data', async (req, res) => {
  try {
    const { symbol, period1, period2, interval } = req.query;
    const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/download/${symbol}`, {
      params: {
        period1: period1,
        period2: period2,
        interval: interval,
        events: 'history',
        includeAdjustedClose: 'true'
      }
    });

    res.send(response.data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).send('Error fetching stock data');
  }
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});

module.exports = app;
