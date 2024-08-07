import React, { useState } from 'react';

const StockInfo = ({ data }) => {
  const [expandedMetrics, setExpandedMetrics] = useState({});

  if (!data) return <div className="loading loading-spinner loading-lg"></div>;

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // This will format the date as YYYY-MM-DD
  };

  const formatEmployeeCount = (count) => {
    if (count == null) return 'N/A';
    const numericCount = typeof count === 'string' ? parseInt(count.replace(/,/g, ''), 10) : count;
    if (isNaN(numericCount)) return count; // Return original value if it's not a valid number
    return numericCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const companyInformation = [
    { 
      label: 'Employees', 
      value: formatEmployeeCount(data.fullTimeEmployees),
      description: `Number of full-time employees. Can indicate the company's size, operational scale, and potential for future growth or cost-cutting.`
    },
    { 
      label: 'Sector', 
      value: data.sector,
      description: `The broad category of the economy in which the company operates. Useful for understanding the company's market environment and comparing it to similar businesses.`
    },
    { 
      label: 'Industry', 
      value: data.industry,
      description: `A more specific classification of the company's business activities. Helps in comparing the company's performance to its direct competitors.`
    },
    { 
      label: 'Stock Price', 
      value: `$${data.price?.toFixed(2) || 'N/A'}`,
      description: `The current market price of one share. This reflects the market's current valuation of the company and is a key factor in investment decisions.`
    },
    { 
      label: 'Market Cap', 
      value: formatMarketCap(data.mktCap),
      description: `Total market value of the company's outstanding shares. Indicates the company's size and can affect its risk profile and potential for growth.`
    },
    { 
      label: 'P/E Ratio', 
      value: data.pe ? data.pe.toFixed(2) : 'N/A',
      description: `Price-to-Earnings ratio. A higher P/E suggests higher growth expectations, while a lower P/E might indicate undervaluation or slower growth prospects.`
    },
    { 
      label: 'Shares Outstanding', 
      value: data.sharesOutstanding ? data.sharesOutstanding.toLocaleString() : 'N/A',
      description: `Total number of shares held by all shareholders. Important for calculating market cap and understanding the ownership structure of the company.`
    },
    { 
      label: 'Next Earnings Report', 
      value: formatDate(data.earningsAnnouncement),
      description: `Date of the next scheduled earnings report. Earnings reports can significantly impact stock price and are crucial events for investors to monitor.`
    },
    { 
      label: 'Exchange', 
      value: data.exchange,
      description: `The stock exchange where the company's shares are traded. Different exchanges have varying regulations and can affect the stock's liquidity and visibility.`
    },
    { 
      label: 'Country', 
      value: data.country,
      description: `The country where the company is headquartered. Can affect the company's regulatory environment, market access, and exposure to geopolitical risks.`
    },
    { 
      label: 'CEO', 
      value: data.ceo,
      description: `The Chief Executive Officer of the company. Leadership can significantly impact a company's strategy, culture, and performance.`
    },
    { 
      label: 'IPO Date', 
      value: data.ipoDate,
      description: `Date of the company's Initial Public Offering. Provides context on how long the company has been publicly traded and can indicate its maturity in the market.`
    },
  ];

  const toggleMetric = (index) => {
    setExpandedMetrics(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">{data.companyName} Overview</h2>
        <p className="mb-6">{data.description || 'No description available.'}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {companyInformation.map((item, index) => (
            <div 
              key={item.label} 
              className="cursor-pointer p-2 rounded hover:bg-base-200" 
              onClick={() => toggleMetric(index)}
            >
              <div className="text-lg font-bold">{item.value}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
              {expandedMetrics[index] && (
                <div className="mt-2 text-sm text-gray-700">{item.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockInfo;