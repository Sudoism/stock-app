import React, { useEffect, useState } from 'react';
import { getFinancialRatios } from '../api';

const FinancialRatiosComponent = ({ ticker }) => {
  const [ratios, setRatios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRatio, setExpandedRatio] = useState(null);

  useEffect(() => {
    const fetchRatios = async () => {
      try {
        setLoading(true);
        const response = await getFinancialRatios(ticker);
        setRatios(response.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching financial ratios:', error);
        setError('Failed to fetch financial ratios');
        setLoading(false);
      }
    };

    fetchRatios();
  }, [ticker]);

  if (loading) return <div className="loading loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!ratios) return <div className="alert alert-info">No financial ratios available</div>;

  const ratioData = [
    {
      label: 'Per Share Metrics',
      ratios: [
        {
          label: 'Revenue Per Share',
          value: ratios.revenuePerShareTTM,
          description: 'Revenue Per Share TTM shows the company\'s total revenue divided by the number of outstanding shares. It indicates how much revenue the company generates for each share. Higher values generally indicate stronger sales performance, but should be compared to industry peers and historical trends.'
        },
        { 
          label: 'Net Income Per Share', 
          value: ratios.netIncomePerShareTTM, 
          description: 'Net Income Per Share TTM provides insight into the company\'s profitability per share. Higher values indicate better profitability. Generally, a positive and growing value is good. However, compare with industry averages for context. A value above $1 is often considered good for established companies, but this can vary by industry and company size.' 
        },
        { 
          label: 'Operating Cash Flow Per Share', 
          value: ratios.operatingCashFlowPerShareTTM, 
          description: 'Operating Cash Flow Per Share TTM highlights the cash generated from regular business operations. Positive and increasing values are generally good, showing the company can sustain its operations and potentially grow. Compare with net income to assess earnings quality. Significantly higher OCF than net income is often a positive sign.' 
        },
        { 
          label: 'Free Cash Flow Per Share', 
          value: ratios.freeCashFlowPerShareTTM, 
          description: 'Free Cash Flow Per Share TTM indicates the cash available after operational expenses and capital expenditures. Positive values are generally good, showing the company can generate cash beyond its needs. A growing FCF per share over time is ideal. However, temporary negative values aren\'t always bad if due to large investments for future growth.' 
        },
        { 
          label: 'Cash Per Share', 
          value: ratios.cashPerShareTTM, 
          description: 'Cash Per Share TTM indicates the amount of cash available per outstanding share. A higher value suggests better liquidity and financial flexibility. However, too much cash might indicate inefficient use of capital. Compare with industry averages and the company\'s historical trends.' 
        },
        {
          label: 'CapEx Per Share',
          value: ratios.capexPerShareTTM,
          description: 'Capital Expenditure (CapEx) Per Share TTM shows the company\'s investment in long-term assets on a per-share basis. Higher values might indicate significant investments in growth, but could also suggest high capital intensity. Compare with industry averages and consider alongside revenue and cash flow metrics.'
        },
      ]
    },
    {
      label: 'Profitability Ratios',
      ratios: [
        { 
          label: 'Return on Equity (ROE)', 
          value: ratios.roeTTM, 
          description: 'ROE TTM shows how efficiently the company uses equity to generate profits. Higher ROE values indicate better efficiency. An ROE between 15-20% is generally considered good, but this varies by industry. Very high ROEs (>30%) should be investigated for sustainability. Consistent ROE over time is often more valuable than a single high year.' 
        },
      ]
    },
    {
      label: 'Liquidity Ratios',
      ratios: [
        { 
          label: 'Current Ratio', 
          value: ratios.currentRatioTTM, 
          description: 'The Current Ratio TTM measures a company\'s ability to pay short-term obligations. A ratio between 1.5 and 3 is generally considered good. A higher ratio indicates better short-term liquidity, but an excessively high ratio might suggest inefficient use of assets.' 
        },
      ]
    },
    {
        label: 'Solvency Ratios',
        ratios: [
          { 
            label: 'Debt to Equity', 
            value: ratios.debtToEquityTTM, 
            description: 'The Debt to Equity TTM measures financial leverage. Lower ratios are generally preferred, but the "right" level varies by industry. A ratio below 1 is often considered good, meaning more equity than debt. However, some industries (like utilities) typically have higher ratios. Very low ratios might indicate missed growth opportunities.' 
          },
        ]
      },
    {
      label: 'Valuation Ratios',
      ratios: [
        { 
          label: 'P/E Ratio', 
          value: ratios.peRatioTTM, 
          description: 'The P/E Ratio TTM helps assess the stock\'s valuation relative to its earnings. A "good" P/E ratio depends on the industry and growth prospects. Generally, a P/E between 15-25 is considered normal. Lower might indicate undervaluation or slow growth, while higher could suggest overvaluation or high growth expectations. Always compare with industry peers.' 
        },
        { 
          label: 'Price to Sales Ratio', 
          value: ratios.priceToSalesRatioTTM, 
          description: 'The Price to Sales Ratio TTM compares the company\'s market cap to its revenue. A lower ratio might indicate undervaluation, while a higher ratio could suggest overvaluation or high growth expectations. This ratio is particularly useful for comparing companies within the same industry.' 
        },
      ]
    },
  ];

  const toggleExpand = (index) => {
    setExpandedRatio(expandedRatio === index ? null : index);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Financial Ratios</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="w-1/2 text-left">Ratio</th>
                <th className="w-1/2 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {ratioData.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  <tr>
                    <td colSpan="2" className="font-bold pt-4">{category.label}</td>
                  </tr>
                  {category.ratios.map((ratio, index) => (
                    <React.Fragment key={index}>
                      <tr 
                        className={`hover:bg-base-200 cursor-pointer transition-colors duration-100 ease-in-out ${expandedRatio === `${categoryIndex}-${index}` ? 'bg-base-200' : ''}`}
                        onClick={() => toggleExpand(`${categoryIndex}-${index}`)}
                      >
                        <td className="w-1/2">{ratio.label}</td>
                        <td className="w-1/2 text-right">{ratio.value ? ratio.value.toFixed(2) : 'N/A'}</td>
                      </tr>
                      {expandedRatio === `${categoryIndex}-${index}` && (
                        <tr className="bg-base-200">
                          <td colSpan="2">
                            <p className="text-sm px-4 py-2">{ratio.description}</p>
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
    </div>
  );
};

export default FinancialRatiosComponent;