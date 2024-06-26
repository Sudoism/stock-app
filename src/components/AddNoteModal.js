import React, { useState } from 'react';

const AddNoteModal = ({ isOpen, onRequestClose, addNote }) => {
  const [content, setContent] = useState('');
  const [noteDate, setNoteDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content && noteDate) {
      await addNote({
        content,
        noteDate,
      });
      setContent('');
      setNoteDate('');
      onRequestClose();
    }
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
              rows="10"
            />
          </div>
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