// AddNoteModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';

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

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Add Note</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={noteDate}
            onChange={(e) => setNoteDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Note</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Note</button>
        <button type="button" onClick={onRequestClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default AddNoteModal;
