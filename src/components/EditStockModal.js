import React, { useState, useEffect } from 'react';

const EditStockModal = ({ isOpen, onRequestClose, onUpdate, stock }) => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (stock) {
      setName(stock.name);
      setTicker(stock.ticker);
    }
  }, [stock]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !ticker.trim()) {
      setError('Both name and ticker are required.');
      return;
    }

    try {
      await onUpdate({ ...stock, name, ticker });
      onRequestClose();
    } catch (err) {
      setError('Failed to update stock. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Stock</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Stock Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Apple Inc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Stock Ticker</span>
            </label>
            <input
              type="text"
              placeholder="e.g. AAPL"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">Update Stock</button>
            <button type="button" onClick={onRequestClose} className="btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockModal;