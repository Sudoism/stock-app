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

  if (loading) return <div className="loading loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (financialData.length === 0) return <div className="alert alert-info">No financial data available</div>;

  const formatNumber = (num) => {
    if (num === undefined || isNaN(num)) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', compactDisplay: 'short' }).format(num);
  };

  const formatPercentage = (num) => {
    if (num === undefined || isNaN(num)) return 'N/A';
    return `${(num * 100).toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const getRevenue = (data) => {
    return data.revenuefromcontractwithcustomerexcludingassessedtax || data.revenues;
  };

  const calculateFreeCashFlow = (data) => {
    const operatingCashFlow = data.netcashprovidedbyusedinoperatingactivities;
    const capex = data.paymentstoacquirepropertyplantandequipment;
    if (operatingCashFlow === undefined || capex === undefined) return undefined;
    return operatingCashFlow - capex;
  };

  const calculateGrossMargin = (data) => {
    const revenue = getRevenue(data);
    const cogs = data.costofgoodsandservicessold || data.costofrevenue;
    if (revenue === undefined || cogs === undefined) return undefined;
    return (revenue - cogs) / revenue;
  };

  const calculateOperatingMargin = (data) => {
    const operatingIncome = data.operatingincomeloss;
    const revenue = getRevenue(data);
    if (operatingIncome === undefined || revenue === undefined) return undefined;
    return operatingIncome / revenue;
  };

  const calculateNetProfitMargin = (data) => {
    const netIncome = data.netincomeloss;
    const revenue = getRevenue(data);
    if (netIncome === undefined || revenue === undefined) return undefined;
    return netIncome / revenue;
  };

  const financialMetrics = [
    {
      section: "Income Statement",
      metrics: [
        { 
          label: 'Revenue', 
          getValue: getRevenue,
          description: 'Total amount of money earned from selling goods or services. Look for consistent growth over the years. Sudden changes may indicate new product launches, market expansion, or potential challenges. Compare growth rates to industry averages.' 
        },
        { 
          label: 'Cost of Goods Sold', 
          key: ['costofgoodsandservicessold', 'costofrevenue'],
          description: 'Direct costs attributable to the production of goods sold. A decreasing trend relative to revenue indicates improving efficiency. However, drastic reductions might signal quality issues. Consider industry norms and company-specific factors.' 
        },
        { 
          label: 'Gross Profit', 
          key: 'grossprofit', 
          description: 'Revenue minus Cost of Goods Sold. Should generally increase with revenue. If gross profit growth outpaces revenue growth, it suggests improving efficiency or pricing power.' 
        },
        { 
          label: 'Gross Margin', 
          calculate: calculateGrossMargin, 
          format: formatPercentage, 
          description: 'Gross Profit as a percentage of Revenue. Higher margins indicate better efficiency in production and pricing power. Look for stability or upward trends. Sudden drops may signal pricing pressures or rising costs. Compare with industry peers as ideal margins vary by sector.' 
        },
        { 
          label: 'Operating Expenses', 
          key: 'operatingexpenses', 
          description: 'Expenses incurred in normal business operations. Should grow more slowly than revenue for improving profitability. Rapid increases might indicate expansion efforts or potential inefficiencies. Consider the nature of the business and growth stage.' 
        },
        { 
          label: 'Operating Income', 
          key: 'operatingincomeloss', 
          description: 'Profit from business operations before interest and taxes. Should grow faster than revenue for improving operational efficiency. Consistent growth indicates strong core business performance.' 
        },
        { 
          label: 'Operating Margin', 
          calculate: calculateOperatingMargin, 
          format: formatPercentage, 
          description: 'Operating Income as a percentage of Revenue. Reflects operational efficiency and pricing power. Higher margins are generally better, but compare with industry norms. Increasing margins over time suggest improving operations or scalability.' 
        },
        { 
          label: 'Net Income', 
          key: 'netincomeloss', 
          description: 'Company\'s total earnings or profit. Should show consistent growth over time. Volatile or declining net income might indicate business challenges or heavy investments. Consider alongside revenue trends and industry conditions.' 
        },
        { 
          label: 'Net Profit Margin', 
          calculate: calculateNetProfitMargin, 
          format: formatPercentage, 
          description: 'Net Income as a percentage of Revenue. Higher margins indicate better overall profitability. Increasing margins suggest improving efficiency or scalability. Declining margins might signal rising costs or competitive pressures. Compare trends with industry peers.' 
        },
      ]
    },
    {
      section: "Balance Sheet",
      metrics: [
        { 
          label: 'Current Assets', 
          key: 'assetscurrent', 
          description: 'Assets expected to be converted to cash within one year. Should generally increase with business growth. A significant decrease might indicate cash flow issues or strategic changes. Compare with current liabilities for liquidity assessment.' 
        },
        { 
          label: 'Total Assets', 
          key: 'assets', 
          description: 'Total of all assets owned by the company. Should grow over time with the business. Rapid increases might indicate acquisitions or major investments. Decreases could signal asset sales or write-downs. Consider alongside revenue and profitability trends.' 
        },
        { 
          label: 'Current Liabilities', 
          key: 'liabilitiescurrent', 
          description: 'Obligations due within one year. Should be manageable relative to current assets. Rapid increases might indicate cash flow challenges or aggressive short-term financing. Compare growth rate to current assets and revenue.' 
        },
        { 
          label: 'Total Liabilities', 
          key: 'liabilities', 
          description: 'Total of all liabilities owed by the company. Monitor the growth rate relative to assets and equity. Excessive liability growth might indicate overleveraging. Consider industry norms and companys growth stage.' 
        },
        { 
          label: 'Stockholders\' Equity', 
          key: 'stockholdersequity', 
          description: 'Total assets minus total liabilities; represents the book value of the company. Should generally increase over time through retained earnings. Decreases might indicate losses, dividends, or share buybacks. Consider alongside market capitalization for valuation insights.' 
        },
      ]
    },
    {
      section: "Cash Flow",
      metrics: [
        { 
          label: 'Operating Cash Flow', 
          key: 'netcashprovidedbyusedinoperatingactivities', 
          description: 'Cash generated from normal business operations. Should be consistently positive and growing. Negative or declining OCF might indicate profitability issues or working capital challenges. Compare with net income for earnings quality assessment.' 
        },
        { 
          label: 'Capital Expenditures', 
          key: 'paymentstoacquirepropertyplantandequipment', 
          description: 'Funds used to acquire or upgrade physical assets. Reflects investment in future growth. High CapEx might indicate expansion but could pressure short-term cash flows. Evaluate in context of industry and growth strategy.' 
        },
        { 
          label: 'Free Cash Flow', 
          calculate: calculateFreeCashFlow, 
          description: 'Operating Cash Flow minus Capital Expenditures. Represents cash available for dividends, debt repayment, or reinvestment. Consistent positive FCF is generally favorable. Negative FCF might be acceptable for growth companies but warrants scrutiny for mature firms.' 
        },
      ]
    }
  ];

  const toggleExpand = (sectionIndex, metricIndex) => {
    const key = `${sectionIndex}-${metricIndex}`;
    setExpandedMetric(expandedMetric === key ? null : key);
  };

  const getValue = (metric, data) => {
    if (metric.getValue) {
      return metric.getValue(data);
    }
    if (Array.isArray(metric.key)) {
      for (let key of metric.key) {
        if (data[key] !== undefined) {
          return data[key];
        }
      }
    }
    return data[metric.key];
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
                  {formatDate(data.date)}
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
                  <React.Fragment key={metric.label}>
                    <tr 
                      className={`hover:bg-base-200 cursor-pointer transition-colors duration-100 ease-in-out ${expandedMetric === `${sectionIndex}-${metricIndex}` ? 'bg-base-200' : ''}`}
                      onClick={() => toggleExpand(sectionIndex, metricIndex)}
                    >
                      <td className="w-1/4">{metric.label}</td>
                      {financialData.map((data, index) => (
                        <td key={data.date} className="text-right" style={{width: `${75 / financialData.length}%`}}>
                          {metric.calculate
                            ? (metric.format || formatNumber)(metric.calculate(data))
                            : formatNumber(getValue(metric, data))}
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