import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Ensure accessibility for screen readers

function AddNoteModal({ isOpen, onRequestClose, addNote }) {
  const [noteContent, setNoteContent] = useState('');
  const [noteDate, setNoteDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addNote({
      date: noteDate,
      content: noteContent,
    });
    setNoteContent('');
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Note"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-xl font-bold mb-4">Add Note</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Date
          <input
            type="date"
            value={noteDate}
            onChange={(e) => setNoteDate(e.target.value)}
            className="py-2 px-4 border rounded mb-2"
          />
        </label>
        <label className="block mb-2">
          Note
          <input
            type="text"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="py-2 px-4 border rounded mb-2"
          />
        </label>
        <div className="flex justify-between">
          <button type="button" onClick={onRequestClose} className="py-2 px-4 bg-red-500 text-white rounded">
            Cancel
          </button>
          <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded">
            Add Note
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddNoteModal;
