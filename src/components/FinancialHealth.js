import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FinancialHealth = ({ ticker }) => {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        { label: 'Revenue', key: 'revenuefromcontractwithcustomerexcludingassessedtax' },
        { label: 'Cost of Goods Sold', key: 'costofgoodsandservicessold' },
        { label: 'Gross Profit', key: 'grossprofit' },
        { label: 'Operating Expenses', key: 'operatingexpenses' },
        { label: 'Net Income', key: 'netincomeloss' },
      ]
    },
    {
      section: "Balance Sheet",
      metrics: [
        { label: 'Current Assets', key: 'assetscurrent' },
        { label: 'Long-Term Assets', key: 'longTermAssets', calculate: calculateLongTermAssets },
        { label: 'Current Liabilities', key: 'liabilitiescurrent' },
        { label: 'Long-Term Liabilities', key: 'longTermLiabilities', calculate: calculateLongTermLiabilities },
      ]
    },
    {
      section: "Cash Flow",
      metrics: [
        { label: 'Operating Cash Flow', key: 'netcashprovidedbyusedinoperatingactivities' },
        { label: 'Investing Cash Flow', key: 'netcashprovidedbyusedininvestingactivities' },
        { label: 'Financing Cash Flow', key: 'netcashprovidedbyusedinfinancingactivities' },
        { label: 'Free Cash Flow', key: 'freeCashFlow', calculate: calculateFreeCashFlow },
      ]
    }
  ];

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body">
        <h2 className="card-title">Financial Health</h2>
        <table className="table w-full">
          <thead>
            <tr>
              <th className="bg-base-100">Metric</th>
              {financialData.map(data => (
                <th key={data.date} className="bg-base-100">{new Date(data.date).getFullYear()}</th>
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
                  <tr key={metric.key} className={metricIndex % 2 === 0 ? '' : 'bg-base-200'}>
                    <td>{metric.label}</td>
                    {financialData.map(data => (
                      <td key={data.date}>
                        {metric.calculate
                          ? formatNumber(metric.calculate(data))
                          : formatNumber(data[metric.key])}
                      </td>
                    ))}
                  </tr>
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