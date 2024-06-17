import React, { useState } from 'react';

const StockForm = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onCreate({ name, ticker });
    setName('');
    setTicker('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex flex-col mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="py-2 px-4 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="py-2 px-4 border rounded mb-2"
        />
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded">Add Stock</button>
      </div>
    </form>
  );
};

export default StockForm;
