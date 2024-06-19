import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

function NotesPane({ selectedNote, updateNote, deleteNote }) {
  const handleEditNote = () => {
    const text = prompt('Edit your note:', selectedNote.content);
    if (text !== null) {
      updateNote({ ...selectedNote, content: text });
    }
  };

  if (!selectedNote) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md mt-4">
        <h2 className="">Select a note to view details</h2>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md mt-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold mb-2">{selectedNote.date}</h2>
        <p className="mb-4">{selectedNote.content}</p>
      </div>
      <div className="flex space-x-2 items-center">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleEditNote}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => deleteNote(selectedNote.id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

export default NotesPane;
