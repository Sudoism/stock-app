import React, { useState } from 'react';
import { financialMetrics } from './financialMetrics';
import { formatters, calculators } from './financialUtils';

const FinancialHealth = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedMetrics, setExpandedMetrics] = useState({});

  if (!data) return <div className="loading loading-lg"></div>;
  if (data.length === 0) return <div className="alert alert-info">No financial data available</div>;

  const financialData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

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
      return calculators[metric.calculate](data, prevYearData);
    }
    return data[metric.key];
  };

  const renderMetricRow = (metric, sectionIndex, metricIndex) => (
    <React.Fragment key={metric.label}>
      <tr 
        className="hover:bg-base-200 cursor-pointer"
        onClick={() => toggleMetric(sectionIndex, metricIndex)}
      >
        <td className="w-1/4">{metric.label}</td>
        {financialData.map((data, index) => (
          <td key={data.date} className="text-right" style={{width: `${75 / financialData.length}%`}}>
            {formatters[metric.format || 'number'](getValue(metric, data, financialData[index - 1]))}
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
  );

  const renderSection = (section, sectionIndex) => (
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
              {financialData.map((data) => (
                <th key={data.date} className="bg-base-100 text-right" style={{width: `${75 / financialData.length}%`}}>
                  {formatters.date(data.date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.metrics.map((metric, metricIndex) => renderMetricRow(metric, sectionIndex, metricIndex))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body">
        <h2 className="card-title">Financials</h2>
        {financialMetrics.map((section, sectionIndex) => renderSection(section, sectionIndex))}
      </div>
    </div>
  );
};

export default FinancialHealth;