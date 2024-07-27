import React, { useState } from 'react';
import { financialMetrics } from './financialMetrics';
import { formatters, calculators } from './financialUtils';

const FinancialHealth = ({ data }) => {
  const [expandedMetrics, setExpandedMetrics] = useState({});

  if (!data) return <div className="loading loading-lg"></div>;
  if (data.length === 0) return <div className="alert alert-info">No financial data available</div>;

  const financialData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

  const toggleMetric = (sectionIndex, metricIndex) => {
    const key = `${sectionIndex}-${metricIndex}`;
    setExpandedMetrics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getValue = (metric, data, prevYearData) => {
    if (metric.calculate) {
      return calculators[metric.calculate](data, prevYearData);
    }
    return data[metric.key];
  };

  const renderMetricRow = (metric, sectionIndex, metricIndex) => {
    const isExpanded = expandedMetrics[`${sectionIndex}-${metricIndex}`];
    return (
      <React.Fragment key={metric.label}>
        <tr 
          className={`cursor-pointer ${isExpanded ? 'bg-base-200' : 'hover:bg-base-200'}`}
          onClick={() => toggleMetric(sectionIndex, metricIndex)}
        >
          <td className="w-1/4 pl-2">{metric.label}</td>
          {financialData.map((data, index) => (
            <td key={data.date} className="text-right pr-2" style={{width: `${75 / financialData.length}%`}}>
              {formatters[metric.format || 'number'](getValue(metric, data, financialData[index - 1]))}
            </td>
          ))}
        </tr>
        {isExpanded && (
          <tr className={`${isExpanded ? 'bg-base-200' : 'hover:bg-base-200'}`}>
            <td colSpan={financialData.length + 1} className="px-2">
              <p className="text-sm py-2">{metric.description}</p>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  const renderSection = (section, sectionIndex) => (
    <div key={section.section} className="collapse collapse-arrow bg-base-100 mb-4">
      <input type="checkbox" /> 
      <div className="collapse-title text-xl font-bold hover:bg-base-200 cursor-pointer px-2">
        {section.section}
      </div>
      <div className="collapse-content px-0">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="bg-base-100 text-left w-1/4 pl-2">Metric</th>
              {financialData.map((data) => (
                <th key={data.date} className="bg-base-100 text-right pr-2" style={{width: `${75 / financialData.length}%`}}>
                  {formatters.date(data.date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.metrics.map((metric, metricIndex) => renderMetricRow(metric, sectionIndex, metricIndex))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body p-0">
        <h2 className="card-title text-2xl mb-4 px-6 pt-6">Financials</h2>
        <div className="px-6 pb-6">
          {financialMetrics.map((section, sectionIndex) => renderSection(section, sectionIndex))}
        </div>
      </div>
    </div>
  );
};

export default FinancialHealth;