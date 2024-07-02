// services/caseService.js
const { Case, Stock } = require('../models');

const getCaseByTicker = async (ticker) => {
  const stock = await Stock.findOne({ where: { ticker } });
  if (!stock) {
    throw new Error('Stock not found');
  }

  let caseInstance = await Case.findOne({ where: { ticker } });
  if (!caseInstance) {
    // Return a default empty case object
    return { ticker, content: '', id: null };
  }
  return caseInstance;
};

const createOrUpdateCase = async (ticker, content) => {
  const stock = await Stock.findOne({ where: { ticker } });
  if (!stock) {
    throw new Error('Stock not found');
  }

  const [caseInstance, created] = await Case.findOrCreate({
    where: { ticker },
    defaults: { content }
  });

  if (!created) {
    await caseInstance.update({ content });
  }

  return caseInstance;
};

module.exports = {
  getCaseByTicker,
  createOrUpdateCase,
};