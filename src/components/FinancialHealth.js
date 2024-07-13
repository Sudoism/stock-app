import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FinancialHealth = ({ ticker }) => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedMetrics, setExpandedMetrics] = useState({});

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
  //  if (Number.isInteger(num)) return num.toString(); // For F-Score components
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', compactDisplay: 'short' }).format(num);
  };

    // New formatting function for F-Score metrics
    const formatFScore = (num) => {
      if (num === undefined || isNaN(num)) return 'N/A';
      return num.toString();
    };

  const formatPercentage = (num) => {
    if (num === undefined || isNaN(num)) return 'N/A';
    return `${(num * 100).toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const calculateFreeCashFlow = (data) => {
    return data.freeCashFlow;
  };

  const calculatePiotroskiScore = (data, prevYearData) => {
    let score = 0;
    
    // 1. Net Income
    if (data.netIncome > 0) score++;
    
    // 2. Return on Assets (ROA)
    const currentROA = data.netIncome / data.totalAssets;
    if (currentROA > 0) score++;
    
    // 3. Operating Cash Flow
    if (data.operatingCashFlow > 0) score++;
    
    // 4. Cash Flow from Operations greater than Net Income
    if (data.operatingCashFlow > data.netIncome) score++;
    
    // 5. Long Term Debt ratio decrease
    const currentDebtRatio = data.totalLiabilities / data.totalAssets;
    const prevDebtRatio = prevYearData ? prevYearData.totalLiabilities / prevYearData.totalAssets : 0;
    if (currentDebtRatio < prevDebtRatio) score++;
    
    // 6. Current Ratio improvement
    const currentRatio = data.totalCurrentAssets / data.totalCurrentLiabilities;
    const prevCurrentRatio = prevYearData ? prevYearData.totalCurrentAssets / prevYearData.totalCurrentLiabilities : 0;
    if (currentRatio > prevCurrentRatio) score++;
    
    // 7. No new shares issued
    if (data.sharesOutstanding <= (prevYearData ? prevYearData.sharesOutstanding : data.sharesOutstanding)) score++;
    
    // 8. Gross Margin improvement
    const grossMargin = (data.revenue - data.costOfRevenue) / data.revenue;
    const prevGrossMargin = prevYearData ? (prevYearData.revenue - prevYearData.costOfRevenue) / prevYearData.revenue : 0;
    if (grossMargin > prevGrossMargin) score++;
    
    // 9. Asset Turnover improvement
    const assetTurnover = data.revenue / data.totalAssets;
    const prevAssetTurnover = prevYearData ? prevYearData.revenue / prevYearData.totalAssets : 0;
    if (assetTurnover > prevAssetTurnover) score++;

    return score;
  };

  const financialMetrics = [
    {
      section: "Income Statement",
      metrics: [
        { 
          label: 'Revenue', 
          key: 'revenue',
          description: `Total amount of money earned from selling goods or services. Look for consistent growth over the years. Sudden changes may indicate new product launches, market expansion, or potential challenges. Compare growth rates to industry averages.`
        },
        { 
          label: 'Cost of Revenue', 
          key: 'costOfRevenue',
          description: `Direct costs attributable to the production of goods sold. A decreasing trend relative to revenue indicates improving efficiency. However, drastic reductions might signal quality issues. Consider industry norms and company-specific factors.`
        },
        { 
          label: 'Gross Profit', 
          key: 'grossProfit', 
          description: `Revenue minus Cost of Goods Sold. Should generally increase with revenue. If gross profit growth outpaces revenue growth, it suggests improving efficiency or pricing power.`
        },
        { 
          label: 'Gross Margin', 
          key: 'grossProfitRatio', 
          format: formatPercentage, 
          description: `Gross Profit as a percentage of Revenue. Higher margins indicate better efficiency in production and pricing power. Look for stability or upward trends. Sudden drops may signal pricing pressures or rising costs. Compare with industry peers as ideal margins vary by sector.`
        },
        { 
          label: 'Operating Expenses', 
          key: 'operatingExpenses', 
          description: `Expenses incurred in normal business operations. Should grow more slowly than revenue for improving profitability. Rapid increases might indicate expansion efforts or potential inefficiencies. Consider the nature of the business and growth stage.`
        },
        { 
          label: 'Operating Income', 
          key: 'operatingIncome', 
          description: `Profit from business operations before interest and taxes. Should grow faster than revenue for improving operational efficiency. Consistent growth indicates strong core business performance.`
        },
        { 
          label: 'Operating Margin', 
          key: 'operatingIncomeRatio', 
          format: formatPercentage, 
          description: `Operating Income as a percentage of Revenue. Reflects operational efficiency and pricing power. Higher margins are generally better, but compare with industry norms. Increasing margins over time suggest improving operations or scalability.`
        },
        { 
          label: 'Net Income', 
          key: 'netIncome', 
          description: `Company's total earnings or profit. Should show consistent growth over time. Volatile or declining net income might indicate business challenges or heavy investments. Consider alongside revenue trends and industry conditions.`
        },
        { 
          label: 'Net Profit Margin', 
          key: 'netIncomeRatio', 
          format: formatPercentage, 
          description: `Net Income as a percentage of Revenue. Higher margins indicate better overall profitability. Increasing margins suggest improving efficiency or scalability. Declining margins might signal rising costs or competitive pressures. Compare trends with industry peers.`
        },
      ]
    },
    {
      section: "Balance Sheet",
      metrics: [
        { 
          label: 'Current Assets', 
          key: 'totalCurrentAssets', 
          description: `Assets expected to be converted to cash within one year. Should generally increase with business growth. A significant decrease might indicate cash flow issues or strategic changes. Compare with current liabilities for liquidity assessment.`
        },
        { 
          label: 'Total Assets', 
          key: 'totalAssets', 
          description: `Total of all assets owned by the company. Should grow over time with the business. Rapid increases might indicate acquisitions or major investments. Decreases could signal asset sales or write-downs. Consider alongside revenue and profitability trends.`
        },
        { 
          label: 'Current Liabilities', 
          key: 'totalCurrentLiabilities', 
          description: `Obligations due within one year. Should be manageable relative to current assets. Rapid increases might indicate cash flow challenges or aggressive short-term financing. Compare growth rate to current assets and revenue.`
        },
        { 
          label: 'Total Liabilities', 
          key: 'totalLiabilities', 
          description: `Total of all liabilities owed by the company. Monitor the growth rate relative to assets and equity. Excessive liability growth might indicate overleveraging. Consider industry norms and company's growth stage.`
        },
        { 
          label: 'Stockholders\' Equity', 
          key: 'totalStockholdersEquity', 
          description: `Total assets minus total liabilities; represents the book value of the company. Should generally increase over time through retained earnings. Decreases might indicate losses, dividends, or share buybacks. Consider alongside market capitalization for valuation insights.`
        },
      ]
    },
    {
      section: "Cash Flow",
      metrics: [
        { 
          label: 'Operating Cash Flow', 
          key: 'operatingCashFlow', 
          description: `Cash generated from normal business operations. Should be consistently positive and growing. Negative or declining OCF might indicate profitability issues or working capital challenges. Compare with net income for earnings quality assessment.`
        },
        { 
          label: 'Capital Expenditures', 
          key: 'capitalExpenditure', 
          description: `Funds used to acquire or upgrade physical assets. Reflects investment in future growth. High CapEx might indicate expansion but could pressure short-term cash flows. Evaluate in context of industry and growth strategy.`
        },
        { 
          label: 'Free Cash Flow', 
          calculate: calculateFreeCashFlow, 
          description: `Operating Cash Flow minus Capital Expenditures. Represents cash available for dividends, debt repayment, or reinvestment. Consistent positive FCF is generally favorable. Negative FCF might be acceptable for growth companies but warrants scrutiny for mature firms.`
        },
      ]
    },
    {
      section: "Investment Ratios",
      metrics: [
        {
          label: 'Return on Equity (ROE)',
          calculate: (data) => data.netIncome / data.totalStockholdersEquity,
          format: formatPercentage,
          description: `Measures profitability relative to shareholders' equity. Higher ROE indicates more efficient use of equity capital. Compare to industry averages and the company's own historical trend. Calculation: Net Income / Total Shareholders' Equity.`
        },
        {
          label: 'Return on Assets (ROA)',
          calculate: (data) => data.netIncome / data.totalAssets,
          format: formatPercentage,
          description: `Indicates how efficiently a company is using its assets to generate profit. Higher ROA suggests better asset utilization. Compare across similar companies and look for improving trends. Calculation: Net Income / Total Assets.`
        },
        {
          label: 'Debt to Equity Ratio',
          calculate: (data) => data.totalLiabilities / data.totalStockholdersEquity,
          format: (num) => num.toFixed(2),
          description: `Measures the company's financial leverage. A higher ratio indicates more reliance on debt financing, which can increase financial risk but also potentially increase returns. Consider industry norms and the company's growth stage. Calculation: Total Liabilities / Total Shareholders' Equity.`
        },
        {
          label: 'Current Ratio',
          calculate: (data) => data.totalCurrentAssets / data.totalCurrentLiabilities,
          format: (num) => num.toFixed(2),
          description: `Measures the company's ability to pay short-term obligations. A ratio above 1 indicates good short-term liquidity, but too high might suggest inefficient use of assets. Industry comparisons are crucial. Calculation: Total Current Assets / Total Current Liabilities.`
        },
        {
          label: 'Price to Book Ratio',
          calculate: (data) => data.price / (data.totalStockholdersEquity / data.sharesOutstanding),
          format: (num) => num.toFixed(2),
          description: `Compares the market's valuation of a company to its book value. A lower P/B might indicate undervaluation, but could also suggest fundamental problems. Consider along with ROE and industry standards. Calculation: Market Price per Share / Book Value per Share, where Book Value per Share = Total Shareholders' Equity / Shares Outstanding.`
        }
      ]
    },
    {
      section: "Piotroski F-Score",
      metrics: [
        {
          label: 'Total Piotroski F-Score',
          calculate: (data, prevYearData) => calculatePiotroskiScore(data, prevYearData),
          format: formatFScore,
          description: `The Piotroski F-Score is a comprehensive measure of a company's financial health, ranging from 0 to 9. A higher score (7-9) indicates stronger financial position and potential for good stock performance. Scores of 0-3 suggest weak financials. This metric is valuable for investors as it combines multiple aspects of financial health into a single, easy-to-interpret number, helping to identify potentially undervalued stocks with improving financials.`
        },
        {
          label: 'Net Income Positivity',
          calculate: (data) => data.netIncome > 0 ? 1 : 0,
          format: formatFScore,
          description: `Positive net income (score 1) indicates profitability, a fundamental aspect of a healthy company. For investors, consistent profitability suggests the company can sustain operations, reinvest in growth, and potentially provide returns to shareholders.`
        },
        {
          label: 'Return on Assets (ROA) Positivity',
          calculate: (data) => (data.netIncome / data.totalAssets) > 0 ? 1 : 0,
          format: formatFScore,
          description: `Positive ROA (score 1) shows the company is effectively using its assets to generate profit. This is crucial for investors as it indicates management's efficiency in utilizing the company's resources, which is especially important when comparing companies within the same industry.`
        },
        {
          label: 'Operating Cash Flow Positivity',
          calculate: (data) => data.operatingCashFlow > 0 ? 1 : 0,
          format: formatFScore,
          description: `Positive operating cash flow (score 1) is vital as it shows the company can generate cash from its core business operations. For investors, this indicates the company's ability to fund its operations without relying on external financing, which is crucial for long-term sustainability.`
        },
        {
          label: 'Cash Flow vs Net Income',
          calculate: (data) => data.operatingCashFlow > data.netIncome ? 1 : 0,
          format: formatFScore,
          description: `Operating cash flow exceeding net income (score 1) suggests high earnings quality. This is important for investors as it indicates that the company's profitability is backed by actual cash generation, reducing the risk of accounting manipulations and providing a more reliable picture of financial health.`
        },
        {
          label: 'Long Term Debt Ratio Decrease',
          calculate: (data, prevYearData) => {
            const currentRatio = data.totalLiabilities / data.totalAssets;
            const prevRatio = prevYearData ? prevYearData.totalLiabilities / prevYearData.totalAssets : Infinity;
            return currentRatio < prevRatio ? 1 : 0;
          },
          format: formatFScore,
          description: `A decrease in long-term debt ratio (score 1) indicates improving financial health. For investors, this suggests reduced financial risk, improved solvency, and potentially more flexibility for the company to invest in growth opportunities or weather economic downturns.`
        },
        {
          label: 'Current Ratio Improvement',
          calculate: (data, prevYearData) => {
            const currentRatio = data.totalCurrentAssets / data.totalCurrentLiabilities;
            const prevRatio = prevYearData ? prevYearData.totalCurrentAssets / prevYearData.totalCurrentLiabilities : 0;
            return currentRatio > prevRatio ? 1 : 0;
          },
          format: formatFScore,
          description: `An improving current ratio (score 1) suggests better short-term liquidity. This is valuable for investors as it indicates the company's enhanced ability to meet short-term obligations, reducing the risk of financial distress and potentially indicating more efficient working capital management.`
        },
        {
          label: 'No New Shares Issued',
          calculate: (data, prevYearData) => {
            return data.sharesOutstanding <= (prevYearData ? prevYearData.sharesOutstanding : data.sharesOutstanding) ? 1 : 0;
          },
          format: formatFScore,
          description: `No increase in shares outstanding (score 1) suggests the company didn't dilute existing shareholders. For investors, this is positive as it indicates the company can fund its operations and growth without resorting to equity issuance, preserving shareholder value and potentially signaling management's confidence in the company's financial position.`
        },
        {
          label: 'Gross Margin Improvement',
          calculate: (data, prevYearData) => {
            const grossMargin = (data.revenue - data.costOfRevenue) / data.revenue;
            const prevGrossMargin = prevYearData ? (prevYearData.revenue - prevYearData.costOfRevenue) / prevYearData.revenue : 0;
            return grossMargin > prevGrossMargin ? 1 : 0;
          },
          format: formatFScore,
          description: `Improving gross margin (score 1) indicates better operational efficiency or pricing power. This is valuable for investors as it suggests the company's ability to manage costs effectively or command higher prices, which can lead to improved profitability and competitive advantage in the long run.`
        },
        {
          label: 'Asset Turnover Improvement',
          calculate: (data, prevYearData) => {
            const assetTurnover = data.revenue / data.totalAssets;
            const prevAssetTurnover = prevYearData ? prevYearData.revenue / prevYearData.totalAssets : 0;
            return assetTurnover > prevAssetTurnover ? 1 : 0;
          },
          format: formatFScore,
          description: `Improving asset turnover (score 1) shows more efficient use of assets to generate sales. For investors, this is important as it indicates the company's ability to generate more revenue from its asset base, potentially leading to better returns on investment and suggesting effective management of resources.`
        }
      ]
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

  const getValue = (metric, data, prevYearData) => {
    if (metric.calculate) {
      return metric.calculate(data, prevYearData);
    }
    return data[metric.key];
  };

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body">
        <h2 className="card-title">Financials</h2>
        {financialMetrics.map((section, sectionIndex) => (
          <div key={section.section} className="mb-4">
            <h3 
              className="font-bold bg-base-100 p-2 cursor-pointer hover:bg-base-200"
              onClick={() => toggleSection(sectionIndex)}
            >
              {section.section}
            </h3>
            {expandedSections[sectionIndex] && (
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
                  {section.metrics.map((metric, metricIndex) => (
                    <React.Fragment key={metric.label}>
                      <tr 
                        className="hover:bg-base-200 cursor-pointer"
                        onClick={() => toggleMetric(sectionIndex, metricIndex)}
                      >
                        <td className="w-1/4">{metric.label}</td>
                        {financialData.map((data, index) => (
                          <td key={data.date} className="text-right" style={{width: `${75 / financialData.length}%`}}>
                            {(metric.format || formatNumber)(getValue(metric, data, financialData[index - 1]))}
                          </td>
                        ))}
                      </tr>
                      {expandedMetrics[`${sectionIndex}-${metricIndex}`] && (
                        <tr className="bg-base-200">
                          <td colSpan={financialData.length + 1}>
                            <p className="text-sm px-4 py-2">{metric.description}</p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialHealth;