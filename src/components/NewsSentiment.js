import React, { useState, useEffect } from 'react';
import { getNewsSentiment } from '../api';

const NewsSentiment = ({ ticker }) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await getNewsSentiment(ticker);
        setNewsData(response.data.feed || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news data:', err);
        setError('Unable to fetch news data. Please try again later.');
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [ticker]);

  const formatDate = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const hour = dateString.slice(9, 11);
    const minute = dateString.slice(11, 13);

    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  const getSentimentBadge = (sentimentScore) => {
    let colorClass = '';
    let label = '';

    if (sentimentScore <= -0.35) {
      colorClass = 'bg-red-500 text-white';
      label = 'Bearish';
    } else if (sentimentScore <= -0.15) {
      colorClass = 'bg-red-200';
      label = 'Somewhat-Bearish';
    } else if (sentimentScore < 0.15) {
      colorClass = 'bg-gray-400 text-white';
      label = 'Neutral';
    } else if (sentimentScore < 0.35) {
      colorClass = 'bg-green-200';
      label = 'Somewhat-Bullish';
    } else {
      colorClass = 'bg-green-500 text-white';
      label = 'Bullish';
    }

    return (
      <span className={`badge ${colorClass} text-xs px-2 py-1 w-32 inline-flex justify-center items-center`}>
        {label}
      </span>
    );
  };

  const handleItemClick = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  if (loading) return <div className="loading loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">News Sentiment</h2>
        <ul className="space-y-2">
          {newsData.sort((a, b) => b.time_published.localeCompare(a.time_published)).map((item, index) => (
            <li 
              key={index} 
              className="cursor-pointer hover:bg-base-200 rounded p-2"
              onClick={() => handleItemClick(index)}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <p className="text-sm font-semibold flex-grow">{item.title}</p>
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <p className="text-xs text-gray-500 sm:hidden">{formatDate(item.time_published)}</p>
                  {getSentimentBadge(item.overall_sentiment_score)}
                </div>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block mt-1">{formatDate(item.time_published)}</p>
              {expandedItem === index && (
                <div className="mt-2">
                  <p className="text-sm">{item.summary}</p>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                  >
                    Read full article
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewsSentiment; 