import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import EditNoteModal from './EditNoteModal';

const NotesPanel = ({ notes, selectedNote, setSelectedNote, updateNote, deleteNote, openAddNoteModal }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditNote = (updatedNote) => {
    updateNote(updatedNote);
    setIsEditModalOpen(false);
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full">
      <div className="card-body p-0 flex flex-col h-full">
        <div className="flex-grow overflow-auto">
          {selectedNote ? (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Note Details</h3>
                <button className="btn btn-sm btn-ghost" onClick={() => setSelectedNote(null)} aria-label="Close">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{new Date(selectedNote.noteDate).toLocaleDateString()}</p>
              <p className="text-base mb-4">{selectedNote.content}</p>
              <div className="flex justify-end space-x-2">
                <button className="btn btn-sm btn-ghost" onClick={() => setIsEditModalOpen(true)} aria-label="Edit">
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button className="btn btn-sm btn-ghost text-error" onClick={() => deleteNote(selectedNote.id)} aria-label="Delete">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ) : (
            <p className="p-4 text-center text-gray-500">Select a note to view details</p>
          )}
        </div>
        <div className="p-4">
          <button
            onClick={openAddNoteModal}
            className="btn btn-primary btn-block"
          >
            Add Note
          </button>
        </div>
      </div>
      {selectedNote && (
        <EditNoteModal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          note={selectedNote}
          updateNote={handleEditNote}
        />
      )}
    </div>
  );
};

export default NotesPanel;