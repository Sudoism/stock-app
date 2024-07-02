import React, { useEffect, useState } from 'react';
import { getStocksWithDetails, createStock } from '../api';
import StockForm from '../components/StockForm';
import Header from '../components/Header';
import StockCard from '../components/StockCard'; // Import the new StockCard component

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
            <StockCard key={stock.id} stock={stock} formatDate={formatDate} />
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
