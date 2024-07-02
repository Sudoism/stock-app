import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCalendar, faCoins } from '@fortawesome/free-solid-svg-icons';

const StockCard = ({ stock, formatDate }) => {
  return (
    <div key={stock.id} className="card bg-base-100 shadow-xl">
      <div className="card-body flex flex-col justify-between">
        <div>
          <h2 className="card-title">{stock.name}</h2>
          <p className="text-gray-600">{stock.ticker}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm flex items-center">
              <FontAwesomeIcon icon={faCalendar} className="mr-2 text-gray-400" />
              Latest Note: {formatDate(stock.latestNoteDate)}
            </p>
            <p className="text-sm flex items-center">
              <FontAwesomeIcon icon={faCoins} className="mr-2 text-gray-400" />
              Shares Owned: {stock.sharesOwned}
            </p>
          </div>
        </div>
        <div className="card-actions mt-4 flex justify-end">
          <Link to={`/stocks/${stock.ticker}`} className="btn btn-primary flex items-center">
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
