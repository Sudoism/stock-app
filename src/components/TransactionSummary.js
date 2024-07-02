import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const TransactionSummary = ({ notes, ticker }) => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestPrice = async () => {
      try {
        const now = new Date();
        const tenDaysAgo = new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000));
        const response = await axios.get('http://localhost:5001/api/yahoo-stock-data', {
          params: {
            symbol: ticker,
            period1: Math.floor(tenDaysAgo.getTime() / 1000),
            period2: Math.floor(now.getTime() / 1000),
            interval: '1d'
          }
        });

        const lines = response.data.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
          throw new Error('No data available');
        }

        const dataLines = lines.slice(1); // Remove header line
        const lastLine = dataLines[dataLines.length - 1];
        const columns = lastLine.split(',');
        
        if (columns.length < 5) {
          throw new Error('Invalid data format');
        }

        const closePrice = parseFloat(columns[4]); // Use index 4 for Close price

        if (isNaN(closePrice)) {
          throw new Error('Invalid price data');
        }

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
    if (note.transactionType === 'buy') {
      acc.totalShares += note.quantity;
      acc.totalInvested += note.quantity * note.price;
    } else if (note.transactionType === 'sell') {
      acc.totalShares -= note.quantity;
      acc.totalSold += note.quantity * note.price;
    }
    return acc;
  }, { totalShares: 0, totalInvested: 0, totalSold: 0 });

  const currentValue = totalShares * (currentPrice || 0);
  const changeInValue = currentValue - totalInvested;
  const changeInValuePercentage = ((changeInValue / totalInvested) * 100) || 0;

  const renderChangeInValue = () => {
    const isGain = changeInValue >= 0;
    const color = isGain ? 'text-green-500' : 'text-red-500';
    const icon = isGain ? faArrowUp : faArrowDown;
    return (
      <span className={`inline-flex items-center ${color}`}>
        {changeInValuePercentage.toFixed(2)}% (${Math.abs(changeInValue).toFixed(2)})
        <FontAwesomeIcon icon={icon} className="ml-1" />
      </span>
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">Investment Summary for {ticker}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-2">
          <p><strong>Shares Owned:</strong> {totalShares}</p>
          <p><strong>Current Value:</strong> ${currentValue.toFixed(2)} (Quote: ${currentPrice ? currentPrice.toFixed(2) : 'N/A'})</p>
          <p><strong>Change in Value:</strong> {renderChangeInValue()}</p>
          <p><strong>Cash from Sold Shares:</strong> ${totalSold.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;