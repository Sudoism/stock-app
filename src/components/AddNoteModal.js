import React, { useState } from 'react';

const AddNoteModal = ({ isOpen, onRequestClose, addNote }) => {
  const [content, setContent] = useState('');
  const [noteDate, setNoteDate] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noteData = {
      content,
      noteDate,
      transactionType: transactionType || null,
      price: price ? parseFloat(price) : null,
      quantity: quantity ? parseInt(quantity) : null,
    };

    await addNote(noteData);
    setContent('');
    setNoteDate('');
    setTransactionType('');
    setPrice('');
    setQuantity('');
    onRequestClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg mb-4">Add Note</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <input
              type="date"
              value={noteDate}
              onChange={(e) => setNoteDate(e.target.value)}
              required
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Note</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="textarea textarea-bordered w-full"
              rows="5"
            />
          </div>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Transaction Type</span>
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">No Transaction</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          {transactionType && (
            <>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Quantity</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Stock Price</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>
            </>
          )}
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">Add Note</button>
            <button type="button" className="btn" onClick={onRequestClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;