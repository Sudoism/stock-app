import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionSummary = ({ notes, ticker }) => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestPrice = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/yahoo-stock-data', {
          params: {
            symbol: ticker,
            period1: Math.floor(Date.now() / 1000) - 864000, // 10 days ago
            period2: Math.floor(Date.now() / 1000),
            interval: '1d'
          }
        });

        const lines = response.data.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) throw new Error('No data available');

        const lastLine = lines[lines.length - 1];
        const columns = lastLine.split(',');
        if (columns.length < 5) throw new Error('Invalid data format');

        const closePrice = parseFloat(columns[4]);
        if (isNaN(closePrice)) throw new Error('Invalid price data');

        setCurrentPrice(closePrice);
        setError(null);
      } catch (error) {
        console.error('Error fetching latest price:', error);
        setCurrentPrice(null);
        setError('Failed to fetch latest price');
      }
    };

    if (ticker) {
      fetchLatestPrice();
    }
  }, [ticker]);

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

  const currentValue = totalShares * (currentPrice || 0);
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
      details: currentPrice ? `${Math.floor(totalShares)} shares × ${formatCurrency(currentPrice)} (latest quote)` : null
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

  return (
    <>
      {error && <p className="text-error mb-2">{error}</p>}
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
    </>
  );
};

export default TransactionSummary;