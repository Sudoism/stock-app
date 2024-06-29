import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p className="py-4">Are you sure you want to delete this note? This action cannot be undone.</p>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onRequestClose}>Cancel</button>
          <button className="btn btn-error" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;