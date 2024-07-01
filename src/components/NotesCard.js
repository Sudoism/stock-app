import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import EditNoteModal from './EditNoteModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const NotesCard = ({ notes, selectedNote, setSelectedNote, updateNote, deleteNote, openAddNoteModal }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const sortedNotes = [...notes].sort((a, b) => new Date(b.noteDate) - new Date(a.noteDate));

  const renderTransactionBadge = (note) => {
    if (!note.transactionType) return null;
    const color = note.transactionType === 'buy' ? 'bg-green-500' : 'bg-red-500';
    return (
      <div className={`badge ${color} text-white text-xs ml-2 flex-shrink-0`}>
        {note.transactionType === 'buy' ? '+' : '-'}{note.quantity}
      </div>
    );
  };

  const renderNoteDetails = () => {
    if (!selectedNote) return null;

    return (
      <div className="p-2 bg-base-100 rounded">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">{formatDate(selectedNote.noteDate)}</p>
          {renderTransactionBadge(selectedNote)}
        </div>
        <p className="text-sm mb-4">{selectedNote.content}</p>
        {selectedNote.transactionType && (
          <div className="mb-4 text-sm">
            <p>
              {selectedNote.transactionType === 'buy' ? 'Bought' : 'Sold'}:{' '}
              <strong>${(selectedNote.price * selectedNote.quantity).toFixed(2)}</strong>
            </p>
            <p>
              Quantity: <strong>{selectedNote.quantity}</strong>
            </p>
            <p>
              Quote: <strong>${parseFloat(selectedNote.price).toFixed(2)}</strong>
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full">
      <div className="card-body p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Notes</h2>
          {selectedNote && (
            <button 
              className="p-0 h-6 w-6 flex items-center justify-center hover:bg-base-200 rounded-full transition-colors duration-200" 
              onClick={() => setSelectedNote(null)} 
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
          )}
        </div>
        <div className="flex-grow overflow-auto">
          {selectedNote ? (
            renderNoteDetails()
          ) : (
            <ul className="space-y-2">
              {sortedNotes.map((note) => (
                <li key={note.id} className="cursor-pointer hover:bg-base-200 rounded" onClick={() => setSelectedNote(note)}>
                  <div className="p-2 flex items-start">
                    <div className="flex-grow mr-2 min-w-0">
                      <p className="text-sm text-gray-600">{formatDate(note.noteDate)}</p>
                      <p className="text-sm truncate">{note.content}</p>
                    </div>
                    {renderTransactionBadge(note)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedNote && (
          <div className="flex justify-end space-x-2 mt-4">
            <button className="btn btn-sm btn-ghost" onClick={() => setIsEditModalOpen(true)} aria-label="Edit">
              <FontAwesomeIcon icon={faPen} />
            </button>
            <button className="btn btn-sm btn-ghost text-error" onClick={() => setIsDeleteModalOpen(true)} aria-label="Delete">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
        <div className="mt-4">
          <button
            onClick={openAddNoteModal}
            className="btn btn-primary btn-block"
          >
            Add Note
          </button>
        </div>
      </div>
      <EditNoteModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        note={selectedNote}
        updateNote={(updatedNote) => {
          updateNote(updatedNote);
          setSelectedNote(updatedNote);
          setIsEditModalOpen(false);
        }}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (selectedNote) {
            deleteNote(selectedNote.id);
            setIsDeleteModalOpen(false);
            setSelectedNote(null);
          }
        }}
      />
    </div>
  );
};

export default NotesCard;