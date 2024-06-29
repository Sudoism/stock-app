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
    <div className="stock-info">
      <h2 className="text-2xl font-bold mb-4">{ticker} Stock Information</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-sm">
          {isExpanded ? info.description : `${info.description.substring(0, 100)}...`}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-link btn-xs ml-2"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Industry</h3>
          <p className="text-sm">{info.industry}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Sector</h3>
          <p className="text-sm">{info.sector}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Employees</h3>
          <p className="text-sm">{info.fullTimeEmployees.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;