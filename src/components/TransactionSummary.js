import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionSummary = ({ notes, ticker }) => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [error, setError] = useState(null);
  const [expandedField, setExpandedField] = useState(null);

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
    if (changeInValue > 0) return 'text-green-600';
    if (changeInValue < 0) return 'text-red-600';
    return '';
  };

  const summaryData = [
    { label: 'Shares Owned', value: Math.floor(totalShares).toString() },
    { 
      label: 'Current Holdings Value', 
      value: formatCurrency(currentValue),
      details: currentPrice ? `${Math.floor(totalShares)} shares × ${formatCurrency(currentPrice)} (latest quote) = ${formatCurrency(currentValue)}` : null
    },
    { 
      label: 'Change in Value', 
      value: formatPercentage(changeInValuePercentage),
      details: `Total Invested: ${formatCurrency(totalInvested)}
                Current Holdings: ${formatCurrency(currentValue)}
                Cash from Sold Shares: ${formatCurrency(totalSold)}
                Total Value: ${formatCurrency(totalValue)}
                Change: ${formatCurrency(changeInValue)} (${formatPercentage(changeInValuePercentage)})`,
      valueClass: getChangeInValueColor()
    }
  ];

  const toggleExpand = (index) => {
    setExpandedField(expandedField === index ? null : index);
  };

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body">
        <h2 className="card-title">Investment Summary for {ticker}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <table className="table w-full">
          <tbody>
            {summaryData.map((item, index) => (
              <React.Fragment key={index}>
                <tr 
                  className={`hover:bg-base-200 cursor-pointer transition-colors duration-100 ease-in-out ${expandedField === index ? 'bg-base-200' : ''}`}
                  onClick={() => toggleExpand(index)}
                >
                  <td className="w-1/2">{item.label}</td>
                  <td className={`w-1/2 text-right ${item.valueClass || ''}`}>{item.value}</td>
                </tr>
                {expandedField === index && item.details && (
                  <tr className="bg-base-200">
                    <td colSpan="2" className="text-sm px-4 py-2 whitespace-pre-line">
                      {item.details}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionSummary;