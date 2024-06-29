import React, { useEffect, useState } from 'react';
import { getStocks, createStock } from '../api';
import StockForm from '../components/StockForm';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const StocksOverview = () => {
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStocks();
      setStocks(response.data);
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
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Ticker</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(stock => (
                <tr key={stock.id}>
                  <td>{stock.name}</td>
                  <td>{stock.ticker}</td>
                  <td>
                    <Link to={`/stocks/${stock.ticker}`} className="btn btn-sm btn-outline">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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