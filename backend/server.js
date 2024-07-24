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
const bullBearCaseRoutes = require('./routes/bullBearCase');

sequelize.sync({alter: true})
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

const stockRoutes = require('./routes/stocks');
const noteRoutes = require('./routes/notes');
const caseRoutes = require('./routes/cases');
const financialRatiosRoutes = require('./routes/financialRatios');
const newsSentimentRoutes = require('./routes/newsSentiment');

app.use('/api/stocks', stockRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/financial-ratios', financialRatiosRoutes);
app.use('/api/news-sentiment', newsSentimentRoutes);
app.use('/api/bull-bear-case', bullBearCaseRoutes);

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

// New endpoint for getting the latest stock price
app.get('/api/latest-stock-price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const latestPrice = await financialApiService.getLatestStockPrice(symbol);
    res.json({ price: latestPrice });
  } catch (error) {
    console.error('Error fetching latest stock price:', error);
    res.status(500).json({ error: 'Failed to fetch latest stock price' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;