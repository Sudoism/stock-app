import React, { useState, useEffect } from 'react';

const EditNoteModal = ({ isOpen, onRequestClose, note, updateNote }) => {
  const [content, setContent] = useState('');
  const [noteDate, setNoteDate] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (note) {
      setContent(note.content || '');
      setNoteDate(note.noteDate ? note.noteDate.split('T')[0] : '');
      setTransactionType(note.transactionType || '');
      setPrice(note.price ? note.price.toString() : '');
      setQuantity(note.quantity ? note.quantity.toString() : '');
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note && content && noteDate) {
      const updatedNote = {
        ...note,
        content,
        noteDate,
        transactionType: transactionType || null,
        price: price ? parseFloat(price) : null,
        quantity: quantity ? parseInt(quantity) : null,
      };
      await updateNote(updatedNote);
      onRequestClose();
    }
  };

  if (!isOpen || !note) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg mb-4">Edit Note</h3>
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
            </>
          )}
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">Update Note</button>
            <button type="button" className="btn" onClick={onRequestClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal;