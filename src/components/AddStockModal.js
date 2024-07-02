import React, { useState } from 'react';

const StockForm = ({ onCreate, onCancel }) => {
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

  return (
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
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="btn">
          Cancel
        </button>
        <button type="submit" className="btn">
          Add Stock
        </button>
      </div>
    </form>
  );
};

export default StockForm;