import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockInfo = ({ ticker }) => {
  const [info, setInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchStockInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/stock-details', {
          params: { symbol: ticker }
        });
        setInfo(response.data[0]);
      } catch (error) {
        console.error('Failed to fetch stock info:', error);
      }
    };

    fetchStockInfo();
  }, [ticker]);

  if (!info) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{ticker} Stock Information</h2>
        <div className="space-y-2">
          <p><strong>Sector:</strong> {info.sector}</p>
          <p><strong>Industry:</strong> {info.industry}</p>
          <p><strong>Country:</strong> {info.country}</p>
          <p><strong>IPO Date:</strong> {info.ipoDate}</p>
          <p><strong>Exchange:</strong> {info.exchangeShortName}</p>
          <p><strong>Market Cap:</strong> {info.mktCap}</p>
          <p><strong>CEO:</strong> {info.ceo}</p>
          <p><strong>Employees:</strong> {info.fullTimeEmployees.toLocaleString()}</p>
          <p>
            <strong>Description: </strong>
            {isExpanded ? info.description : `${info.description.substring(0, 100)}...`}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-link btn-xs ml-2"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;