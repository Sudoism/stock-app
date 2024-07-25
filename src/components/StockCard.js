import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCoins, faPen, faTrash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const StockCard = ({ stock, formatDate, isToday, onEdit, onDelete }) => {
  const formatCurrency = (value) => {
    if (value === null || value === 0) return '';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === null || value === 0) return '';
    return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);
  };

  const getChangeColor = (value) => {
    return value > 0 ? 'text-success' : value < 0 ? 'text-error' : 'text-gray-500';
  };

  return (
    <Link to={`/stocks/${stock.ticker}`} className="card bg-base-100 shadow-xl hover:bg-base-300 transition-colors">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title text-lg">{stock.name}</h2>
            <p className="text-sm text-gray-600">{stock.ticker}</p>
          </div>
          <div className="text-right">
            {stock.changeInValuePercentage !== null && stock.changeInValuePercentage !== 0 && (
              <p className={` font-bold ${getChangeColor(stock.changeInValuePercentage)}`}>
                <FontAwesomeIcon 
                  icon={stock.changeInValuePercentage > 0 ? faArrowUp : faArrowDown} 
                  className="mr-1"
                />
                {formatPercentage(stock.changeInValuePercentage)}
              </p>
            )}
            {stock.changeInValue !== null && stock.changeInValue !== 0 && (
              <p className={`text-sm ${getChangeColor(stock.changeInValue)}`}>
                {formatCurrency(stock.changeInValue)}
              </p>
            )}
            
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <p className={`text-xs flex items-center ${isToday ? 'text-success' : 'text-gray-500'}`}>
            <FontAwesomeIcon 
              icon={faCalendar} 
              className={`mr-2 ${isToday ? 'text-success' : 'text-gray-400'}`} 
            />
            Latest Note: {formatDate(stock.latestNoteDate)}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs flex items-center text-gray-500">
              <FontAwesomeIcon icon={faCoins} className="mr-2 text-gray-400" />
              Shares Owned: {stock.sharesOwned}
            </p>
            <div className="flex space-x-1">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(stock);
                }} 
                className="btn btn-xs btn-ghost text-gray-400 hover:text-gray-600" 
                aria-label="Edit"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(stock.id);
                }} 
                className="btn btn-xs btn-ghost text-gray-400 hover:text-gray-600" 
                aria-label="Delete"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;