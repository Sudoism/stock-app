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
    return <div>Loading stock information...</div>;
  }

  return (
    <div className="stock-info p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">{ticker} Stock Information</h2>
      <p>
        <strong>Description:</strong>
        {isExpanded ? (
          info.description
        ) : (
          <>
            {info.description.substring(0, 100)}...
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-500 ml-2"
            >
              Show more
            </button>
          </>
        )}
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-blue-500 ml-2"
          >
            Show less
          </button>
        )}
      </p>
      <p><strong>Industry:</strong> {info.industry}</p>
      <p><strong>Sector:</strong> {info.sector}</p>
      <p><strong>Employees:</strong> {info.fullTimeEmployees}</p>
    </div>
  );
};

export default StockInfo;
