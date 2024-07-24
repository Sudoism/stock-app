import React, { useState } from 'react';

const AddStockModal = ({ isOpen, onRequestClose, onCreate }) => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !ticker.trim()) {
      setError('Both name and ticker are required.');
      return;
    }

    try {
      await onCreate({ name, ticker });
      setName('');
      setTicker('');
    } catch (err) {
      setError('Failed to add stock. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Stock</h3>
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
            <button type="submit" className="btn btn-primary">Add Stock</button>
            <button type="button" onClick={onRequestClose} className="btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;