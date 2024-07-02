import React, { useEffect, useState } from 'react';
import { getStocksWithDetails, createStock } from '../api';
import StockForm from '../components/StockForm';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCalendar, faCoins } from '@fortawesome/free-solid-svg-icons';

const StocksOverview = () => {
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStocksWithDetails();
        setStocks(response.data);
      } catch (error) {
        console.error('Failed to fetch stocks data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateStock = async (stock) => {
    try {
      const response = await createStock(stock);
      setStocks([...stocks, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create stock:', error);
      // You might want to show an error message to the user here
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No notes yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header title="Stock Dashboard" />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Owned Stocks</h1>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Stock
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map(stock => (
            <div key={stock.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
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
                <div className="card-actions justify-end mt-4">
                  <Link to={`/stocks/${stock.ticker}`} className="btn btn-primary">
                    <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Add New Stock</h3>
              <StockForm
                onCreate={handleCreateStock}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StocksOverview;