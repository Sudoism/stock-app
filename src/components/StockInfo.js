import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockInfo = ({ ticker }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedField, setExpandedField] = useState(null);

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

  const stockData = [
    { label: 'Sector', value: info.sector },
    { label: 'Industry', value: info.industry },
    { label: 'Country', value: info.country },
    { label: 'IPO Date', value: info.ipoDate },
    { label: 'Exchange', value: info.exchangeShortName },
    { label: 'Market Cap', value: formatMarketCap(info.mktCap) },
    { label: 'CEO', value: info.ceo },
    { label: 'Employees', value: info.fullTimeEmployees ? info.fullTimeEmployees.toLocaleString() : 'N/A' },
    { label: 'Description', value: info.description, isLong: true },
  ];

  const toggleExpand = (index) => {
    setExpandedField(expandedField === index ? null : index);
  };

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body">
        <h2 className="card-title">{ticker} Stock Information</h2>
        <table className="table w-full">
          <tbody>
            {stockData.map((item, index) => (
              <tr 
                key={index}
                className={`hover:bg-base-200 cursor-pointer transition-colors duration-200 ease-in-out ${expandedField === index ? 'bg-base-200' : ''}`}
                onClick={() => toggleExpand(index)}
              >
                <td className="w-1/4">{item.label}</td>
                <td className="w-3/4">
                  {item.isLong 
                    ? (expandedField === index ? item.value : `${item.value.substring(0, 100)}...`) 
                    : (item.value || 'N/A')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockInfo;