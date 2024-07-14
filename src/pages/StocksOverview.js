import React, { useEffect, useState } from 'react';
import { getStocksWithDetails, createStock } from '../api';
import AddStockModal from '../components/AddStockModal';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import StockCard from '../components/StockCard';

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
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const sortStocks = (stockList) => {
    return stockList.sort((a, b) => {
      if (!a.latestNoteDate) return 1;
      if (!b.latestNoteDate) return -1;
      return new Date(a.latestNoteDate) - new Date(b.latestNoteDate);
    });
  };

  const ownedStocks = sortStocks(stocks.filter(stock => stock.sharesOwned > 0));
  const watchlistStocks = sortStocks(stocks.filter(stock => stock.sharesOwned === 0));

  const renderStockGrid = (stockList, title) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 px-2">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {stockList.map(stock => (
          <div key={stock.id} className="h-full">
            <StockCard 
              stock={stock} 
              formatDate={formatDate} 
              isToday={stock.latestNoteDate && new Date(stock.latestNoteDate).toDateString() === new Date().toDateString()}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sky-50">
      <Header title="Overview" />
      <div className="p-2">
        {ownedStocks.length > 0 && renderStockGrid(ownedStocks, "Owned Stocks")}
        {watchlistStocks.length > 0 && renderStockGrid(watchlistStocks, "Watchlist")}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          <div className="h-full">
            <button
              className="card bg-base-100 shadow-xl hover:bg-base-300 transition-colors p-4 w-full h-full flex items-center justify-center"
              onClick={() => setIsModalOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="text-gray-400 mr-2" />
              <span className="text-gray-600">Add New Stock</span>
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add New Stock</h3>
            <AddStockModal
              onCreate={handleCreateStock}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StocksOverview;