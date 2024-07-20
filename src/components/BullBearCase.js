import React, { useState, useEffect } from 'react';
import { getBullBearCase } from '../api';

const BullBearCase = ({ ticker }) => {
  const [bullBearCase, setBullBearCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('BullBearCase component mounted with ticker:', ticker);
    const fetchBullBearCase = async () => {
      try {
        setLoading(true);
        const response = await getBullBearCase(ticker);
        setBullBearCase(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bull/bear case:', err);
        setError('Failed to fetch bull/bear case. Please try again later.');
        setLoading(false);
      }
    };

    fetchBullBearCase();
  }, [ticker]);

  if (loading) return <div className="loading loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!bullBearCase) return <div className="alert alert-info">No bull/bear case available</div>;

  const renderCase = (caseType) => {
    return Object.entries(bullBearCase[`${caseType}_case`]).map(([key, value]) => (
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
        <h2 className="card-title text-2xl mb-4">Bull/Bear Case for {bullBearCase.company}</h2>
        
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
          <p className="text-3xl font-bold mb-2">{bullBearCase.final_grade.grade}/5</p>
          <p className="text-sm">{bullBearCase.final_grade.clarification}</p>
        </div>
      </div>
    </div>
  );
};

export default BullBearCase;