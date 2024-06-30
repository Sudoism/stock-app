import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockInfo = ({ ticker }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchStockInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/stock-details', {
          params: { symbol: ticker }
        });
        setInfo(response.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stock info:', error);
        setError('Stock information not available.');
        setLoading(false);
      }
    };

    fetchStockInfo();
  }, [ticker]);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl p-4">
        <div className="flex items-center justify-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="card bg-base-100 shadow-xl p-4">
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>{error || 'No stock information available.'}</p>
        </div>
      </div>
    );
  }

  const formatMarketCap = (value) => {
    if (typeof value !== 'number') return 'N/A';
    const billion = 1000000000;
    const million = 1000000;
    if (value >= billion) {
      return `$${(value / billion).toFixed(2)}B`;
    } else if (value >= million) {
      return `$${(value / million).toFixed(2)}M`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{ticker} Stock Information</h2>
        <div className="space-y-2">
          <p><strong>Sector:</strong> {info.sector || 'N/A'}</p>
          <p><strong>Industry:</strong> {info.industry || 'N/A'}</p>
          <p><strong>Country:</strong> {info.country || 'N/A'}</p>
          <p><strong>IPO Date:</strong> {info.ipoDate || 'N/A'}</p>
          <p><strong>Exchange:</strong> {info.exchangeShortName || 'N/A'}</p>
          <p><strong>Market Cap:</strong> {formatMarketCap(info.mktCap)}</p>
          <p><strong>CEO:</strong> {info.ceo || 'N/A'}</p>
          <p><strong>Employees:</strong> {info.fullTimeEmployees ? info.fullTimeEmployees.toLocaleString() : 'N/A'}</p>
          <p>
            <strong>Description: </strong>
            {info.description ? (
              <>
                {isExpanded ? info.description : `${info.description.substring(0, 100)}...`}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="btn btn-link btn-xs ml-2"
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
              </>
            ) : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;