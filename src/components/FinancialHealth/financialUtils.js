export const formatters = {
    number: (num) => {
      if (num === undefined || isNaN(num)) return 'N/A';
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', compactDisplay: 'short' }).format(num);
    },
    percentage: (num) => {
      if (num === undefined || isNaN(num)) return 'N/A';
      return `${(num * 100).toFixed(2)}%`;
    },
    decimal: (num) => {
      if (num === undefined || isNaN(num)) return 'N/A';
      return num.toFixed(2);
    },
    fScore: (num) => {
        if (num === 'N/A' || num === undefined || isNaN(num)) return 'N/A';
        return num.toString();
      },
    date: (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    },
    absolute: (num) => {
        if (num === undefined || isNaN(num)) return 'N/A';
        return new Intl.NumberFormat('en-US', { 
          maximumFractionDigits: 0 
        }).format(num);
    },
  };
  
  export const calculators = {
    freeCashFlow: (data) => {
      return data.freeCashFlow;
    },
    returnOnEquity: (data) => {
      return data.netIncome / data.totalStockholdersEquity;
    },
    returnOnAssets: (data) => {
      return data.netIncome / data.totalAssets;
    },
    debtToEquity: (data) => {
      return data.totalLiabilities / data.totalStockholdersEquity;
    },
    currentRatio: (data) => {
      return data.totalCurrentAssets / data.totalCurrentLiabilities;
    },
    piotroskiScore: (data, prevYearData) => {
        if (!prevYearData) return 'N/A';
        let score = 0;
        score += calculators.netIncomePositivity(data);
        score += calculators.roaPositivity(data);
        score += calculators.operatingCashFlowPositivity(data);
        score += calculators.cashFlowVsNetIncome(data);
        score += calculators.longTermDebtRatioDecrease(data, prevYearData);
        score += calculators.currentRatioImprovement(data, prevYearData);
        score += calculators.noNewSharesIssued(data, prevYearData);
        score += calculators.grossMarginImprovement(data, prevYearData);
        score += calculators.assetTurnoverImprovement(data, prevYearData);
        return score;
      },
    
      netIncomePositivity: (data) => {
        return data.netIncome > 0 ? 1 : 0;
      },
    
      roaPositivity: (data) => {
        return (data.netIncome / data.totalAssets) > 0 ? 1 : 0;
      },
    
      operatingCashFlowPositivity: (data) => {
        return data.operatingCashFlow > 0 ? 1 : 0;
      },
    
      cashFlowVsNetIncome: (data) => {
        return data.operatingCashFlow > data.netIncome ? 1 : 0;
      },
    
      longTermDebtRatioDecrease: (data, prevYearData) => {
        if (!prevYearData) return 'N/A';
        const currentRatio = data.totalLiabilities / data.totalAssets;
        const prevRatio = prevYearData.totalLiabilities / prevYearData.totalAssets;
        return currentRatio < prevRatio ? 1 : 0;
      },
    
      currentRatioImprovement: (data, prevYearData) => {
        if (!prevYearData) return 'N/A';
        const currentRatio = data.totalCurrentAssets / data.totalCurrentLiabilities;
        const prevRatio = prevYearData.totalCurrentAssets / prevYearData.totalCurrentLiabilities;
        return currentRatio > prevRatio ? 1 : 0;
      },
    
      noNewSharesIssued: (data, prevYearData) => {
        if (!prevYearData) return 'N/A';
        return data.weightedAverageShsOut <= prevYearData.weightedAverageShsOut ? 1 : 0;
      },
    
      grossMarginImprovement: (data, prevYearData) => {
        if (!prevYearData) return 'N/A';
        const grossMargin = (data.revenue - data.costOfRevenue) / data.revenue;
        const prevGrossMargin = (prevYearData.revenue - prevYearData.costOfRevenue) / prevYearData.revenue;
        return grossMargin > prevGrossMargin ? 1 : 0;
      },
    
      assetTurnoverImprovement: (data, prevYearData) => {
        if (!prevYearData) return 'N/A';
        const assetTurnover = data.revenue / data.totalAssets;
        const prevAssetTurnover = prevYearData.revenue / prevYearData.totalAssets;
        return assetTurnover > prevAssetTurnover ? 1 : 0;
      }
  };