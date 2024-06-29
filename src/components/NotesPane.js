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
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Select a note to view details</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title mb-2">{selectedNote.date}</h2>
            <p className="text-sm">{selectedNote.content}</p>
          </div>
          <div className="flex space-x-2">
            <button
              className="btn btn-sm btn-ghost"
              onClick={handleEditNote}
              aria-label="Edit note"
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
            <button
              className="btn btn-sm btn-ghost text-error"
              onClick={() => deleteNote(selectedNote.id)}
              aria-label="Delete note"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotesPane;