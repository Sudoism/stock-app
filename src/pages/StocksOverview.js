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
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map(stock => (
            <StockCard key={stock.id} stock={stock} formatDate={formatDate} />
          ))}
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
        <div className="flex justify-start items-center mb-6">
          <button
            className="card bg-base-100 shadow-xl hover:bg-base-300 transition-colors p-4 mt-4"
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StocksOverview;
