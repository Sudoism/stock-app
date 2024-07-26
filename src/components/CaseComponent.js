import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { getCase, createOrUpdateCase } from '../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

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
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save case:', error);
    }
  };

  if (isLoading) {
    return <div className="loading loading-lg"></div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl overflow-x-auto">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-2xl">Investment Case</h2>
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
          <div className="mb-4">
            <textarea
              className="textarea textarea-bordered w-full text-sm text-gray-600"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="15"
            />
          </div>
        ) : (
          <div className="bg-base-100 rounded">
            <ReactMarkdown
              className="text-sm text-gray-600 prose max-w-none"
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                h1: ({node, children, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props}>{children}</h1>,
                h2: ({node, children, ...props}) => <h2 className="text-xl font-bold mt-3 mb-2" {...props}>{children}</h2>,
                h3: ({node, children, ...props}) => <h3 className="text-lg font-bold mt-2 mb-1" {...props}>{children}</h3>,
                p: ({node, ...props}) => <p className="mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseComponent;