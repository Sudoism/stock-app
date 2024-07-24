import React, { useEffect, useState, useCallback } from 'react';
import { getStocksWithDetails, createStock, updateStock, deleteStock } from '../api';
import AddStockModal from '../components/AddStockModal';
import EditStockModal from '../components/EditStockModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import StockCard from '../components/StockCard';

const StocksOverview = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchStocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getStocksWithDetails();
      setStocks(response.data);
    } catch (error) {
      console.error('Failed to fetch stocks data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const handleCreateStock = async (stock) => {
    try {
      await createStock(stock);
      await fetchStocks();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to create stock:', error);
    }
  };

  const handleEditStock = (stock) => {
    setSelectedStock(stock);
    setIsEditModalOpen(true);
  };

  const handleUpdateStock = async (updatedStock) => {
    try {
      await updateStock(updatedStock.id, updatedStock);
      await fetchStocks();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const handleDeleteStock = (id) => {
    setSelectedStock(stocks.find(stock => stock.id === id));
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteStock = async () => {
    try {
      await deleteStock(selectedStock.id);
      await fetchStocks();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete stock:', error);
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
      return new Date(b.latestNoteDate) - new Date(a.latestNoteDate);
    });
  };

  const ownedStocks = sortStocks(stocks.filter(stock => stock.sharesOwned > 0));
  const watchlistStocks = sortStocks(stocks.filter(stock => stock.sharesOwned === 0 && (stock.changeInValue === null || stock.changeInValue === 0)));
  const exitedStocks = sortStocks(stocks.filter(stock => stock.sharesOwned === 0 && stock.changeInValue !== null && stock.changeInValue !== 0));

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
              onEdit={handleEditStock}
              onDelete={handleDeleteStock}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header title="Overview" />
      <div className="p-2">
        {ownedStocks.length > 0 && renderStockGrid(ownedStocks, "Owned")}
        {watchlistStocks.length > 0 && renderStockGrid(watchlistStocks, "Watchlist")}
        {exitedStocks.length > 0 && renderStockGrid(exitedStocks, "Exits")}
        {!isLoading && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            <div className="h-full">
              <button
                className="card bg-base-100 shadow-xl hover:bg-base-300 transition-colors p-4 w-full h-full flex items-center justify-center"
                onClick={() => setIsAddModalOpen(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="text-gray-400 mr-2" />
                <span className="text-gray-600">Add New Stock</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <AddStockModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        onCreate={handleCreateStock}
      />
      {isEditModalOpen && (
        <EditStockModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateStock}
          stock={selectedStock}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteStock}
          itemName={selectedStock?.name}
        />
      )}
    </div>
  );
};

export default StocksOverview;