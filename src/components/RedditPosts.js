import React, { useState, useEffect } from 'react';
import { getRedditPosts } from '../api';

const RedditPosts = ({ ticker, stockName }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    const fetchRedditPosts = async () => {
      try {
        const response = await getRedditPosts(ticker, stockName);
        setPosts(response.data.data.children.map(child => child.data));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Reddit posts:', err);
        setError('Failed to fetch Reddit posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchRedditPosts();
  }, [ticker, stockName]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0]; // This will return the date in YYYY-MM-DD format
  };

  const handleItemClick = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  if (loading) return <div className="loading loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Top Reddit Posts for {ticker} ({stockName})</h2>
        <ul className="space-y-2">
          {posts.sort((a, b) => b.created_utc - a.created_utc).map((post, index) => (
            <li
              key={post.id}
              className="cursor-pointer hover:bg-base-200 rounded p-2"
              onClick={() => handleItemClick(index)}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <p className="text-sm font-semibold flex-grow">{post.title}</p>
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <p className="text-xs text-gray-500 sm:hidden">{formatDate(post.created_utc)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block mt-1">{formatDate(post.created_utc)}</p>
              <p className="text-xs text-gray-500 mt-1">
                r/{post.subreddit} | 
                Votes: {post.ups - post.downs} | 
                Comments: {post.num_comments}
              </p>
              {expandedItem === index && (
                <div className="mt-2">
                  {post.selftext && <p className="text-sm">{post.selftext.slice(0, 300)}...</p>}
                  <a
                    href={`https://www.reddit.com${post.permalink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                  >
                    Read full post
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

export default RedditPosts;