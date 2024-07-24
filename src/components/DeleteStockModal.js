import React from 'react';

const DeleteStockModal = ({ isOpen, onRequestClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p className="py-4">
          Are you sure you want to delete {itemName}? This action cannot be undone.
        </p>
        <div className="modal-action">
          <button onClick={onRequestClose} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStockModal;