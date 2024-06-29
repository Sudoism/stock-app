import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import EditNoteModal from './EditNoteModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function NoteDetail({ note, updateNote, deleteNote, onClose }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteNote(note.id);
    setIsDeleteModalOpen(false);
    onClose();
  };

  return (
    <>
      <div className="card bg-base-100 shadow-xl mt-4">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Note Details</h2>
            <button className="btn btn-ghost btn-sm p-0" onClick={onClose} aria-label="Close">
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">{formatDate(note.noteDate)}</p>
          <p className="text-base mb-6">{note.content}</p>
          <div className="flex justify-end space-x-2">
            <button className="btn btn-ghost btn-sm p-2" onClick={() => setIsEditModalOpen(true)} aria-label="Edit">
              <FontAwesomeIcon icon={faPen} />
            </button>
            <button className="btn btn-ghost btn-sm p-2 text-error" onClick={handleDelete} aria-label="Delete">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
      <EditNoteModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        note={note}
        updateNote={updateNote}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default NoteDetail;