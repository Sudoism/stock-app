const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 24 * 60 * 60 }); // 24 hours cache

const cachedAxiosGet = async (url, params) => {
  const cacheKey = `${url}?${new URLSearchParams(params).toString()}`;
  const cachedResponse = cache.get(cacheKey);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await axios.get(url, { params });
  cache.set(cacheKey, response.data);
  return response.data;
};

const getYahooStockData = async (symbol, period1, period2, interval) => {
  return cachedAxiosGet(`https://query1.finance.yahoo.com/v7/finance/download/${symbol}`, {
    period1,
    period2,
    interval,
    events: 'history',
    includeAdjustedClose: 'true'
  });
};

const getStockDetails = async (symbol) => {
  try {
    const [profileData, quoteData] = await Promise.all([
      cachedAxiosGet(`https://financialmodelingprep.com/api/v3/profile/${symbol}`, {
        apikey: process.env.FMP_API_KEY
      }),
      cachedAxiosGet(`https://financialmodelingprep.com/api/v3/quote/${symbol}`, {
        apikey: process.env.FMP_API_KEY
      })
    ]);

    // Combine the data from both endpoints
    const combinedData = {
      ...profileData[0],
      ...quoteData[0],
      // Ensure we don't overwrite any existing fields unintentionally
      pe: quoteData[0].pe,
      sharesOutstanding: quoteData[0].sharesOutstanding,
      earningsAnnouncement: quoteData[0].earningsAnnouncement
    };

    return [combinedData]; // Return as an array to maintain compatibility with existing frontend
  } catch (error) {
    console.error('Error fetching stock details:', error);
    throw error;
  }
};

const getFinancialStatement = async (symbol) => {
  try {
    const [incomeStatement, balanceSheet, cashFlow] = await Promise.all([
      cachedAxiosGet(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}`, {
        period: 'annual',
        apikey: process.env.FMP_API_KEY
      }),
      cachedAxiosGet(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}`, {
        period: 'annual',
        apikey: process.env.FMP_API_KEY
      }),
      cachedAxiosGet(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}`, {
        period: 'annual',
        apikey: process.env.FMP_API_KEY
      })
    ]);

    // Combine the data from all three API calls
    const combinedData = incomeStatement.map((incomeItem, index) => {
      const balanceSheetItem = balanceSheet[index] || {};
      const cashFlowItem = cashFlow[index] || {};

      return {
        // Common fields
        date: incomeItem.date,
        symbol: incomeItem.symbol,
        reportedCurrency: incomeItem.reportedCurrency,
        cik: incomeItem.cik,
        fillingDate: incomeItem.fillingDate,
        acceptedDate: incomeItem.acceptedDate,
        calendarYear: incomeItem.calendarYear,
        period: incomeItem.period,
        link: incomeItem.link,
        finalLink: incomeItem.finalLink,

        // Income Statement items
        revenue: incomeItem.revenue,
        costOfRevenue: incomeItem.costOfRevenue,
        grossProfit: incomeItem.grossProfit,
        grossProfitRatio: incomeItem.grossProfitRatio,
        researchAndDevelopmentExpenses: incomeItem.researchAndDevelopmentExpenses,
        generalAndAdministrativeExpenses: incomeItem.generalAndAdministrativeExpenses,
        sellingAndMarketingExpenses: incomeItem.sellingAndMarketingExpenses,
        sellingGeneralAndAdministrativeExpenses: incomeItem.sellingGeneralAndAdministrativeExpenses,
        otherExpenses: incomeItem.otherExpenses,
        operatingExpenses: incomeItem.operatingExpenses,
        costAndExpenses: incomeItem.costAndExpenses,
        interestIncome: incomeItem.interestIncome,
        interestExpense: incomeItem.interestExpense,
        depreciationAndAmortization: incomeItem.depreciationAndAmortization,
        ebitda: incomeItem.ebitda,
        ebitdaratio: incomeItem.ebitdaratio,
        operatingIncome: incomeItem.operatingIncome,
        operatingIncomeRatio: incomeItem.operatingIncomeRatio,
        totalOtherIncomeExpensesNet: incomeItem.totalOtherIncomeExpensesNet,
        incomeBeforeTax: incomeItem.incomeBeforeTax,
        incomeBeforeTaxRatio: incomeItem.incomeBeforeTaxRatio,
        incomeTaxExpense: incomeItem.incomeTaxExpense,
        netIncome: incomeItem.netIncome,
        netIncomeRatio: incomeItem.netIncomeRatio,
        eps: incomeItem.eps,
        epsdiluted: incomeItem.epsdiluted,
        weightedAverageShsOut: incomeItem.weightedAverageShsOut,
        weightedAverageShsOutDil: incomeItem.weightedAverageShsOutDil,

        // Balance Sheet items
        cashAndCashEquivalents: balanceSheetItem.cashAndCashEquivalents,
        shortTermInvestments: balanceSheetItem.shortTermInvestments,
        cashAndShortTermInvestments: balanceSheetItem.cashAndShortTermInvestments,
        netReceivables: balanceSheetItem.netReceivables,
        inventory: balanceSheetItem.inventory,
        otherCurrentAssets: balanceSheetItem.otherCurrentAssets,
        totalCurrentAssets: balanceSheetItem.totalCurrentAssets,
        propertyPlantEquipmentNet: balanceSheetItem.propertyPlantEquipmentNet,
        goodwill: balanceSheetItem.goodwill,
        intangibleAssets: balanceSheetItem.intangibleAssets,
        goodwillAndIntangibleAssets: balanceSheetItem.goodwillAndIntangibleAssets,
        longTermInvestments: balanceSheetItem.longTermInvestments,
        taxAssets: balanceSheetItem.taxAssets,
        otherNonCurrentAssets: balanceSheetItem.otherNonCurrentAssets,
        totalNonCurrentAssets: balanceSheetItem.totalNonCurrentAssets,
        otherAssets: balanceSheetItem.otherAssets,
        totalAssets: balanceSheetItem.totalAssets,
        accountPayables: balanceSheetItem.accountPayables,
        shortTermDebt: balanceSheetItem.shortTermDebt,
        taxPayables: balanceSheetItem.taxPayables,
        deferredRevenue: balanceSheetItem.deferredRevenue,
        otherCurrentLiabilities: balanceSheetItem.otherCurrentLiabilities,
        totalCurrentLiabilities: balanceSheetItem.totalCurrentLiabilities,
        longTermDebt: balanceSheetItem.longTermDebt,
        deferredRevenueNonCurrent: balanceSheetItem.deferredRevenueNonCurrent,
        deferredTaxLiabilitiesNonCurrent: balanceSheetItem.deferredTaxLiabilitiesNonCurrent,
        otherNonCurrentLiabilities: balanceSheetItem.otherNonCurrentLiabilities,
        totalNonCurrentLiabilities: balanceSheetItem.totalNonCurrentLiabilities,
        otherLiabilities: balanceSheetItem.otherLiabilities,
        capitalLeaseObligations: balanceSheetItem.capitalLeaseObligations,
        totalLiabilities: balanceSheetItem.totalLiabilities,
        preferredStock: balanceSheetItem.preferredStock,
        commonStock: balanceSheetItem.commonStock,
        retainedEarnings: balanceSheetItem.retainedEarnings,
        accumulatedOtherComprehensiveIncomeLoss: balanceSheetItem.accumulatedOtherComprehensiveIncomeLoss,
        othertotalStockholdersEquity: balanceSheetItem.othertotalStockholdersEquity,
        totalStockholdersEquity: balanceSheetItem.totalStockholdersEquity,
        totalEquity: balanceSheetItem.totalEquity,
        totalLiabilitiesAndStockholdersEquity: balanceSheetItem.totalLiabilitiesAndStockholdersEquity,
        minorityInterest: balanceSheetItem.minorityInterest,
        totalLiabilitiesAndTotalEquity: balanceSheetItem.totalLiabilitiesAndTotalEquity,
        totalInvestments: balanceSheetItem.totalInvestments,
        totalDebt: balanceSheetItem.totalDebt,
        netDebt: balanceSheetItem.netDebt,

        // Cash Flow items
        netIncome: cashFlowItem.netIncome,
        depreciationAndAmortization: cashFlowItem.depreciationAndAmortization,
        deferredIncomeTax: cashFlowItem.deferredIncomeTax,
        stockBasedCompensation: cashFlowItem.stockBasedCompensation,
        changeInWorkingCapital: cashFlowItem.changeInWorkingCapital,
        accountsReceivables: cashFlowItem.accountsReceivables,
        inventory: cashFlowItem.inventory,
        accountsPayables: cashFlowItem.accountsPayables,
        otherWorkingCapital: cashFlowItem.otherWorkingCapital,
        otherNonCashItems: cashFlowItem.otherNonCashItems,
        netCashProvidedByOperatingActivities: cashFlowItem.netCashProvidedByOperatingActivities,
        investmentsInPropertyPlantAndEquipment: cashFlowItem.investmentsInPropertyPlantAndEquipment,
        acquisitionsNet: cashFlowItem.acquisitionsNet,
        purchasesOfInvestments: cashFlowItem.purchasesOfInvestments,
        salesMaturitiesOfInvestments: cashFlowItem.salesMaturitiesOfInvestments,
        otherInvestingActivites: cashFlowItem.otherInvestingActivites,
        netCashUsedForInvestingActivites: cashFlowItem.netCashUsedForInvestingActivites,
        debtRepayment: cashFlowItem.debtRepayment,
        commonStockIssued: cashFlowItem.commonStockIssued,
        commonStockRepurchased: cashFlowItem.commonStockRepurchased,
        dividendsPaid: cashFlowItem.dividendsPaid,
        otherFinancingActivites: cashFlowItem.otherFinancingActivites,
        netCashUsedProvidedByFinancingActivities: cashFlowItem.netCashUsedProvidedByFinancingActivities,
        effectOfForexChangesOnCash: cashFlowItem.effectOfForexChangesOnCash,
        netChangeInCash: cashFlowItem.netChangeInCash,
        cashAtEndOfPeriod: cashFlowItem.cashAtEndOfPeriod,
        cashAtBeginningOfPeriod: cashFlowItem.cashAtBeginningOfPeriod,
        operatingCashFlow: cashFlowItem.operatingCashFlow,
        capitalExpenditure: cashFlowItem.capitalExpenditure,
        freeCashFlow: cashFlowItem.freeCashFlow,
      };
    });

    return combinedData;
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw error;
  }
};

const getFinancialRatios = async (symbol) => {
  return cachedAxiosGet(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}`, {
    apikey: process.env.FMP_API_KEY
  });
};

const getLatestStockPrice = async (symbol) => {
  try {
    const data = await cachedAxiosGet('http://localhost:5001/api/yahoo-stock-data', {
      symbol: symbol,
      period1: Math.floor(Date.now() / 1000) - 864000, // 10 days ago
      period2: Math.floor(Date.now() / 1000),
      interval: '1d'
    });

    const lines = data.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) throw new Error('No data available');

    const lastLine = lines[lines.length - 1];
    const columns = lastLine.split(',');
    if (columns.length < 5) throw new Error('Invalid data format');

    const closePrice = parseFloat(columns[4]);
    if (isNaN(closePrice)) throw new Error('Invalid price data');

    return closePrice;
  } catch (error) {
    console.error('Error fetching latest price:', error);
    throw error;
  }
};

module.exports = {
  getYahooStockData,
  getStockDetails,
  getFinancialStatement,
  getFinancialRatios,
  getLatestStockPrice
};