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
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header title="Overview" />
      <div className="p-2"> {/* 4px padding on left and right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {stocks.map(stock => (
            <div key={stock.id} className="h-full">
              <StockCard stock={stock} formatDate={formatDate} />
            </div>
          ))}
          <div className="h-full">
            <button
              className="card bg-base-100 shadow-xl hover:bg-base-300 transition-colors p-4 w-full h-full flex items-center justify-center"
              onClick={() => setIsModalOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="text-gray-400 text-4xl" />
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