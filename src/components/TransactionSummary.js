import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Calculate total shares owned and average purchase price
  const { totalShares, totalInvested, totalSold, liquidAmount } = notes.reduce((acc, note) => {
    if (note.transactionType === 'buy') {
      acc.totalShares += note.quantity;
      acc.totalInvested += note.quantity * note.price;
    } else if (note.transactionType === 'sell') {
      acc.totalShares -= note.quantity;
      acc.totalSold += note.quantity * note.price;
      acc.liquidAmount += note.quantity * note.price;
    }
    return acc;
  }, { totalShares: 0, totalInvested: 0, totalSold: 0, liquidAmount: 0 });

  const averagePurchasePrice = totalShares !== 0 ? totalInvested / totalShares : 0;

  // Calculate current value and gain/loss
  const currentValue = totalShares * (currentPrice || 0);
  const unrealizedGainLoss = currentValue - totalInvested + totalSold;
  const realizedGainLoss = liquidAmount - (totalInvested - (averagePurchasePrice * totalShares));

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Investment Summary for {ticker}</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>Shares Owned: {totalShares}</p>
            <p>Average Purchase Price: ${averagePurchasePrice.toFixed(2)}</p>
            <p>Current Price: ${currentPrice ? currentPrice.toFixed(2) : 'Loading...'}</p>
          </div>
          <div>
            <p>Total Invested: ${totalInvested.toFixed(2)}</p>
            <p>Current Value: ${currentValue.toFixed(2)}</p>
            <p>Unrealized Gain/Loss: ${unrealizedGainLoss.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4">
          <p>Liquid Amount: ${liquidAmount.toFixed(2)}</p>
          <p>Realized Gain/Loss: ${realizedGainLoss.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;