import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCoins } from '@fortawesome/free-solid-svg-icons';

const StockCard = ({ stock, formatDate, isToday }) => {
  return (
    <Link to={`/stocks/${stock.ticker}`} className="card bg-base-100 shadow-xl hover:bg-base-300 transition-colors">
      <div key={stock.id} className="card-body">
        <h2 className="card-title">{stock.name}</h2>
        <p className="text-gray-600">{stock.ticker}</p>
        <div className="mt-2 space-y-1">
          <p className={`text-sm flex items-center ${isToday ? 'text-success' : ''}`}>
            <FontAwesomeIcon icon={faCalendar} className={`mr-2 ${isToday ? 'text-success' : 'text-gray-400'}`} />
            Latest Note: {formatDate(stock.latestNoteDate)}
          </p>
          <p className="text-sm flex items-center">
            <FontAwesomeIcon icon={faCoins} className="mr-2 text-gray-400" />
            Shares Owned: {stock.sharesOwned}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;