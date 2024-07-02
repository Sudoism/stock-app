import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { getCase, createOrUpdateCase } from '../api';

const CaseComponent = ({ ticker, initialContent, onSave }) => {
  const [content, setContent] = useState(initialContent || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await getCase(ticker);
        if (response.data && response.data.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch case:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCase();
  }, [ticker]);

  const handleSave = async () => {
    try {
      await createOrUpdateCase(ticker, content);
      if (onSave) {
        onSave();
      }
      setIsEditing(false); // Return to read-only state after saving
    } catch (error) {
      console.error('Failed to save case:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Investment Case</h2>
          {isEditing ? (
            <button className="btn btn-sm" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setIsEditing(true)}
              aria-label="Edit"
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
          )}
        </div>
        {isEditing ? (
          <div>
            <textarea
              className="textarea textarea-bordered w-full text-sm text-gray-600"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
            />
          </div>
        ) : (
          <div className="p-2 bg-base-100 rounded">
            <div className="text-sm text-gray-600 whitespace-pre-wrap">{content}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseComponent;
