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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center h-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-auto"> {/* Increased max-width */}
        <h2 className="text-2xl font-bold mb-4">Add Note</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={noteDate}
              onChange={(e) => setNoteDate(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2"
              rows="10"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddNoteModal;
