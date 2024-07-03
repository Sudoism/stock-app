import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FinancialHealth = ({ ticker }) => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMetric, setExpandedMetric] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/financial-statement?symbol=${ticker}`);
        setFinancialData(response.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError('Financial data not available for this stock.');
        setLoading(false);
      }
    };

    fetchFinancialData();
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

  if (error || financialData.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl p-4">
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>{error || 'No financial data available for this stock.'}</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num === undefined || isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', compactDisplay: 'short' }).format(num);
  };

  const calculateFreeCashFlow = (data) => {
    const operatingCashFlow = data.netcashprovidedbyusedinoperatingactivities;
    const capex = data.paymentstoacquirepropertyplantandequipment;
    if (operatingCashFlow === undefined || capex === undefined) return undefined;
    return operatingCashFlow - capex;
  };

  const calculateLongTermAssets = (data) => {
    return data.assets - data.assetscurrent;
  };

  const calculateLongTermLiabilities = (data) => {
    return data.liabilities - data.liabilitiescurrent;
  };

  const financialMetrics = [
    {
      section: "Income Statement",
      metrics: [
        { label: 'Revenue', key: 'revenuefromcontractwithcustomerexcludingassessedtax', description: 'Total amount of money earned from selling goods or services. Increasing revenue year-over-year is generally positive, but consider the growth rate in context of the industry and company size. Stable or accelerating growth is ideal.' },
        { label: 'Cost of Goods Sold', key: 'costofgoodsandservicessold', description: 'Direct costs attributable to the production of goods sold. A decreasing COGS relative to revenue indicates improving efficiency, but this varies by industry. Look for a downward trend in COGS as a percentage of revenue.' },
        { label: 'Gross Profit', key: 'grossprofit', description: 'Revenue minus COGS. A higher gross profit margin (gross profit / revenue) is generally better. Industry averages vary, but margins above 50% are often considered good for many industries. Look for stable or increasing margins over time.' },
        { label: 'Operating Expenses', key: 'operatingexpenses', description: 'Expenses incurred in normal business operations. Lower is generally better, but not at the expense of growth or quality. Look for stable or decreasing OpEx as a percentage of revenue over time. Sudden increases should be investigated.' },
        { label: 'Net Income', key: 'netincomeloss', description: 'Total earnings after all expenses and taxes. Positive and growing net income is generally good. For mature companies, consistent growth is ideal. For high-growth companies, increasing losses might be acceptable if paired with strong revenue growth.' },
      ]
    },
    {
      section: "Balance Sheet",
      metrics: [
        { label: 'Current Assets', key: 'assetscurrent', description: 'Assets expected to be converted to cash within one year. Higher current assets can indicate better liquidity, but too high might suggest inefficient use of resources. A current ratio (current assets / current liabilities) between 1.5 and 3 is often considered healthy.' },
        { label: 'Long-Term Assets', key: 'longTermAssets', calculate: calculateLongTermAssets, description: 'Assets not expected to be converted to cash within a year. The importance varies by industry. For capital-intensive industries, look for efficient use of these assets in generating revenue. Calculate the asset turnover ratio (revenue / total assets) and compare it to industry peers.' },
        { label: 'Current Liabilities', key: 'liabilitiescurrent', description: 'Obligations due within one year. Lower is generally better, but compare with current assets. A current ratio above 1 is good, but too high might indicate inefficient use of capital. Look for stability or improvement in this ratio over time.' },
        { label: 'Long-Term Liabilities', key: 'longTermLiabilities', calculate: calculateLongTermLiabilities, description: 'Obligations not due within a year. While some debt can be beneficial, too much can be risky. Compare with equity (debt-to-equity ratio) and cash flows. A debt-to-equity ratio below 2 is often considered good, but this varies by industry.' },
      ]
    },
    {
      section: "Cash Flow",
      metrics: [
        { label: 'Operating Cash Flow', key: 'netcashprovidedbyusedinoperatingactivities', description: 'Cash generated from normal business operations. Positive and growing OCF is generally good. Compare with net income to assess earnings quality. OCF consistently higher than net income often indicates high-quality earnings. Look for a stable or increasing OCF to net income ratio.' },
        { label: 'Investing Cash Flow', key: 'netcashprovidedbyusedininvestingactivities', description: 'Cash used in investing activities. Negative values are common and can indicate investment in growth. However, consistently large negative values should be investigated. Compare with OCF to ensure investments are sustainable.' },
        { label: 'Financing Cash Flow', key: 'netcashprovidedbyusedinfinancingactivities', description: 'Cash from financing activities. For growing companies, positive values (indicating cash raised) can be good. For mature companies, negative values (indicating dividends or buybacks) might be preferred. Look for consistency with the company\'s stated capital allocation strategy.' },
        { label: 'Free Cash Flow', key: 'freeCashFlow', calculate: calculateFreeCashFlow, description: 'Cash left after capital expenditures. Positive and growing FCF is generally good, indicating the company can fund operations and growth. However, negative FCF isn\'t always bad if due to investments in future growth. Compare FCF to net income; FCF should ideally be close to or higher than net income.' },
      ]
    }
  ];

  const toggleExpand = (sectionIndex, metricIndex) => {
    const key = `${sectionIndex}-${metricIndex}`;
    setExpandedMetric(expandedMetric === key ? null : key);
  };

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body">
        <h2 className="card-title">Financial Statements</h2>
        <table className="table w-full">
          <thead>
            <tr>
              <th className="bg-base-100 text-left w-1/4">Metric</th>
              {financialData.map((data, index) => (
                <th key={data.date} className="bg-base-100 text-right" style={{width: `${75 / financialData.length}%`}}>
                  {new Date(data.date).getFullYear()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {financialMetrics.map((section, sectionIndex) => (
              <React.Fragment key={section.section}>
                <tr>
                  <td colSpan={financialData.length + 1} className="font-bold bg-base-100 pt-4">
                    {section.section}
                  </td>
                </tr>
                {section.metrics.map((metric, metricIndex) => (
                  <React.Fragment key={metric.key}>
                    <tr 
                      className={`hover:bg-base-200 cursor-pointer transition-colors duration-200 ease-in-out ${expandedMetric === `${sectionIndex}-${metricIndex}` ? 'bg-base-200' : ''}`}
                      onClick={() => toggleExpand(sectionIndex, metricIndex)}
                    >
                      <td className="w-1/4">{metric.label}</td>
                      {financialData.map((data, index) => (
                        <td key={data.date} className="text-right" style={{width: `${75 / financialData.length}%`}}>
                          {metric.calculate
                            ? formatNumber(metric.calculate(data))
                            : formatNumber(data[metric.key])}
                        </td>
                      ))}
                    </tr>
                    {expandedMetric === `${sectionIndex}-${metricIndex}` && (
                      <tr className="bg-base-200">
                        <td colSpan={financialData.length + 1}>
                          <p className="text-sm px-4 py-2">{metric.description}</p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialHealth;