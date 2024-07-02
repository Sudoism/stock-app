require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config/config.json')[process.env.NODE_ENV || 'development'];
const financialApiService = require('./services/financialApiService');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

const Stock = require('./models/stock')(sequelize, DataTypes);
const Note = require('./models/note')(sequelize, DataTypes);
const Case = require('./models/case')(sequelize, DataTypes);

sequelize.sync({force: true})
//sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

const stockRoutes = require('./routes/stocks');
const noteRoutes = require('./routes/notes');
const caseRoutes = require('./routes/cases');

app.use('/api/stocks', stockRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/cases', caseRoutes);

app.get('/', (req, res) => {
  res.send('Stock App Backend');
});

app.get('/api/yahoo-stock-data', async (req, res) => {
  try {
    const { symbol, period1, period2, interval } = req.query;
    const data = await financialApiService.getYahooStockData(symbol, period1, period2, interval);
    res.send(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).send('Error fetching stock data');
  }
});

app.get('/api/stock-details', async (req, res) => {
  try {
    const { symbol } = req.query;
    const data = await financialApiService.getStockDetails(symbol);
    res.send(data);
  } catch (error) {
    console.error('Error fetching stock details:', error);
    res.status(500).send('Error fetching stock details');
  }
});

app.get('/api/financial-statement', async (req, res) => {
  try {
    const { symbol } = req.query;
    const data = await financialApiService.getFinancialStatement(symbol);
    res.send(data);
  } catch (error) {
    console.error('Error fetching financial statement:', error);
    res.status(500).send('Error fetching financial statement');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;