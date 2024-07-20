import React from 'react';

const BullBearCase = ({ data }) => {
  if (!data) return <div className="loading loading-lg"></div>;

  const renderCase = (caseType) => {
    return Object.entries(data[`${caseType}_case`]).map(([key, value]) => (
      <div key={key} className="mb-6">
        <h4 className="font-bold text-lg">{value.summary}</h4>
        <p className="text-sm mb-2"><strong></strong> {value.analysis}</p>
        <p className="text-sm mb-2 italic"><strong>What to watch:</strong> {value.indicator}</p>
      </div>
    ));
  };

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Bull/Bear Case for {data.company}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-success">Bull Case</h3>
            {renderCase('bull')}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-error">Bear Case</h3>
            {renderCase('bear')}
          </div>
        </div>
        
        <div className="mt-8 bg-base-200 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Final Investment Grade</h3>
          <p className="text-3xl font-bold mb-2">{data.final_grade.grade}/5</p>
          <p className="text-sm">{data.final_grade.clarification}</p>
        </div>
      </div>
    </div>
  );
};

export default BullBearCase;