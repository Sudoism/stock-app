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

  const formatCurrency = (value) => {
    return value != null ? `$${value.toFixed(2)}` : 'N/A';
  };

  const formatPercentage = (value) => {
    return value != null ? `${value.toFixed(2)}%` : 'N/A';
  };

  const getChangeInValueColor = () => {
    if (changeInValue > 0) return 'text-success';
    if (changeInValue < 0) return 'text-error';
    return '';
  };

  const summaryData = [
    { 
      label: 'Shares Owned', 
      value: Math.floor(totalShares).toString(),
      details: null
    },
    { 
      label: 'Current Holdings Value', 
      value: formatCurrency(currentValue),
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
          <div className="stat-title">{item.label}</div>
          <div className="flex items-center justify-between">
            <div className={`stat-value ${item.valueClass || ''} mr-4`}>{item.value}</div>
            {item.details && (
              <div className="stat-desc text-base text-right">{item.details}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionSummary;