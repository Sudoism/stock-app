import React, { useState, useEffect } from 'react';
import { getCase, createOrUpdateCase } from '../api';

const CaseComponent = ({ ticker }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await getCase(ticker);
        if (response.data && response.data.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch case:', error);
        // If case is not found, we'll just leave the content empty
      } finally {
        setIsLoading(false);
      }
    };

    fetchCase();
  }, [ticker]);

  const handleSave = async () => {
    try {
      await createOrUpdateCase(ticker, content);
      // Optionally, you can show a success message here
    } catch (error) {
      console.error('Failed to save case:', error);
      // Optionally, you can show an error message here
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Investment Case</h2>
        <textarea
          className="textarea textarea-bordered w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
        />
        <div className="card-actions justify-end">
          <button className="btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CaseComponent;