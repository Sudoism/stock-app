import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockInfo = ({ ticker }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedMetrics, setExpandedMetrics] = useState({});

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // This will format the date as YYYY-MM-DD
  };

  const companyInformation = [
    {
      section: "Stock Info",
      metrics: [
        { 
          label: 'Company Name', 
          value: info.companyName,
          description: `The official name of the company. Important for identifying the business and its brand recognition in the market.`
        },
        { 
          label: 'Stock Price', 
          value: `$${info.price?.toFixed(2) || 'N/A'}`,
          description: `The current market price of one share. This reflects the market's current valuation of the company and is a key factor in investment decisions.`
        },
        { 
          label: 'Market Cap', 
          value: formatMarketCap(info.mktCap),
          description: `Total market value of the company's outstanding shares. Indicates the company's size and can affect its risk profile and potential for growth.`
        },
        { 
          label: 'P/E Ratio', 
          value: info.pe ? info.pe.toFixed(2) : 'N/A',
          description: `Price-to-Earnings ratio. A higher P/E suggests higher growth expectations, while a lower P/E might indicate undervaluation or slower growth prospects.`
        },
        { 
          label: 'Shares Outstanding', 
          value: info.sharesOutstanding ? info.sharesOutstanding.toLocaleString() : 'N/A',
          description: `Total number of shares held by all shareholders. Important for calculating market cap and understanding the ownership structure of the company.`
        },
        { 
          label: 'Next Earnings Report', 
          value: formatDate(info.earningsAnnouncement),
          description: `Date of the next scheduled earnings report. Earnings reports can significantly impact stock price and are crucial events for investors to monitor.`
        },
        { 
          label: 'Exchange', 
          value: info.exchange,
          description: `The stock exchange where the company's shares are traded. Different exchanges have varying regulations and can affect the stock's liquidity and visibility.`
        },
        { 
          label: 'Sector', 
          value: info.sector,
          description: `The broad category of the economy in which the company operates. Useful for understanding the company's market environment and comparing it to similar businesses.`
        },
        { 
          label: 'Industry', 
          value: info.industry,
          description: `A more specific classification of the company's business activities. Helps in comparing the company's performance to its direct competitors.`
        },
        { 
          label: 'Country', 
          value: info.country,
          description: `The country where the company is headquartered. Can affect the company's regulatory environment, market access, and exposure to geopolitical risks.`
        },
        { 
          label: 'CEO', 
          value: info.ceo,
          description: `The Chief Executive Officer of the company. Leadership can significantly impact a company's strategy, culture, and performance.`
        },
        { 
          label: 'Employees', 
          value: info.fullTimeEmployees ? info.fullTimeEmployees.toLocaleString() : 'N/A',
          description: `Number of full-time employees. Can indicate the company's size, operational scale, and potential for future growth or cost-cutting.`
        },
        { 
          label: 'IPO Date', 
          value: info.ipoDate,
          description: `Date of the company's Initial Public Offering. Provides context on how long the company has been publicly traded and can indicate its maturity in the market.`
        },
      ]
    },
    {
      section: "Company Description",
      content: info.description || 'No description available.'
    }
  ];

  const toggleSection = (sectionIndex) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };

  const toggleMetric = (sectionIndex, metricIndex) => {
    const key = `${sectionIndex}-${metricIndex}`;
    setExpandedMetrics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body">
        <h2 className="card-title">Company Information</h2>
        {companyInformation.map((section, sectionIndex) => (
          <div key={section.section} className="mb-4">
            <h3 
              className="font-bold bg-base-100 p-2 cursor-pointer hover:bg-base-200"
              onClick={() => toggleSection(sectionIndex)}
            >
              {section.section}
            </h3>
            {expandedSections[sectionIndex] && (
              section.section === "Company Description" ? (
                <div className="p-4 bg-base-200">
                  <p>{section.content}</p>
                </div>
              ) : (
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="bg-base-100 text-left w-1/4">Metric</th>
                      <th className="bg-base-100 text-left w-3/4">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.metrics.map((item, metricIndex) => (
                      <React.Fragment key={item.label}>
                        <tr 
                          className="hover:bg-base-200 cursor-pointer"
                          onClick={() => toggleMetric(sectionIndex, metricIndex)}
                        >
                          <td className="w-1/4">{item.label}</td>
                          <td className="w-3/4">{item.value}</td>
                        </tr>
                        {expandedMetrics[`${sectionIndex}-${metricIndex}`] && (
                          <tr className="bg-base-200">
                            <td colSpan="2">
                              <p className="text-sm px-4 py-2">{item.description}</p>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockInfo;