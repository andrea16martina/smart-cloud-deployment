import React from 'react';
import './styles/ErrorModal.css';

const ErrorModal = ({ show, message, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <h2>⚠ Azione non consentita ⚠</h2>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default ErrorModal;