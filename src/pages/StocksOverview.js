import React, { useEffect, useState } from 'react';
import { getStocks, createStock } from '../api';
import StockForm from '../components/StockForm';
import { Link } from 'react-router-dom';

const StocksOverview = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStocks();
      setStocks(response.data);
    };

    fetchData();
  }, []);

  const handleCreateStock = async (stock) => {
    const response = await createStock(stock);
    setStocks([...stocks, response.data]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Owned Stocks</h1>
      <table className="min-w-full bg-white shadow-md rounded my-6">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200">Name</th>
            <th className="py-2 px-4 bg-gray-200">Ticker</th>
            <th className="py-2 px-4 bg-gray-200">Details</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock.id} className="text-center border-t">
              <td className="py-2 px-4">{stock.name}</td>
              <td className="py-2 px-4">{stock.ticker}</td>
              <td className="py-2 px-4">
                <Link to={`/stocks/${stock.ticker}`}>
                  <button className="py-1 px-3 bg-blue-500 text-white rounded">
                    <span className="mr-2">Details</span>
                    <i className="fas fa-info-circle"></i>
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <StockForm onCreate={handleCreateStock} />
    </div>
  );
};

export default StocksOverview;
