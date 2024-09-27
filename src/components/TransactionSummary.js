import React from 'react';

const TransactionSummary = ({ notes, ticker, latestPrice }) => {
  const { totalShares, totalInvested, totalSold } = notes.reduce((acc, note) => {
    const quantity = Number(note.quantity) || 0;
    const price = Number(note.price) || 0;
    if (note.transactionType === 'buy') {
      acc.totalShares += quantity;
      acc.totalInvested += quantity * price;
    } else if (note.transactionType === 'sell') {
      acc.totalShares -= quantity;
      acc.totalSold += quantity * price;
    }
    return acc;
  }, { totalShares: 0, totalInvested: 0, totalSold: 0 });

  const currentValue = totalShares * (latestPrice || 0);
  const totalValue = currentValue + totalSold;
  const changeInValue = totalValue - totalInvested;
  const changeInValuePercentage = totalInvested !== 0 ? (changeInValue / totalInvested) * 100 : 0;

  const getCurrencyPrefix = (ticker) => {
    if (ticker.endsWith('.ST')) return 'SEK ';
    if (ticker.endsWith('.OL')) return 'NOK ';
    return '$';
  };

  const formatCurrency = (value) => {
    if (value == null) return 'N/A';
    return new Intl.NumberFormat('en-US', { 
      style: 'decimal', 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value);
  };

  const formatPercentage = (value) => {
    return value != null ? `${value.toFixed(2)}%` : 'N/A';
  };

  const getChangeInValueColor = () => {
    if (changeInValue > 0) return 'text-success';
    if (changeInValue < 0) return 'text-error';
    return '';
  };

  const currencyPrefix = getCurrencyPrefix(ticker);

  const summaryData = [
    { 
      label: 'Shares Owned', 
      value: Math.floor(totalShares).toString(),
      details: null
    },
    { 
      label: 'Current Holdings Value', 
      value: `${currencyPrefix}${formatCurrency(currentValue)}`,
      details: latestPrice ? `${Math.floor(totalShares)} shares × ${formatCurrency(latestPrice)} (latest quote)` : null
    },
    { 
      label: 'Change in Value', 
      value: formatPercentage(changeInValuePercentage),
      details: `Total Invested: ${formatCurrency(totalInvested)}
Current Holdings: ${formatCurrency(currentValue)}
Cash from Sold Shares: ${formatCurrency(totalSold)}
Total Value: ${formatCurrency(totalValue)}
Change: ${formatCurrency(changeInValue)}`,
      valueClass: getChangeInValueColor()
    }
  ];

  if (latestPrice === null) {
    return (
      <div className="w-full bg-base-100 shadow-lg animate-pulse">
        <div className="h-32"></div>
      </div>
    );
  }

  return (
    <div className="stats w-full bg-base-100 shadow-lg">
      {summaryData.map((item, index) => (
        <div key={index} className="stat px-4 py-2">
          <div className="flex justify-between items-end">
            <div className="flex flex-col items-start">
              <div className={`stat-value ${item.valueClass || ''}`}>{item.value}</div>
              <div className="stat-title text-sm text-gray-500">{item.label}</div>
            </div>
            {item.details && (
              <div className="stat-desc text-xs text-right">{item.details}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionSummary;