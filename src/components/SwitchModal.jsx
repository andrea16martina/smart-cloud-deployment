import React, { useState } from 'react';
import './styles/SwitchModal.css';
import useNodeManager from '../management/NodeManager';

const SwitchModal = ({ isOpen, onClose, services, switchId }) => {
  const [condition, setCondition] = useState('');
  const [destinationService, setDestinationService] = useState('');
  const {nodeProperties, saveCondition, removeCondition} = useNodeManager();

  if (!isOpen) return null;

  const handleSave = () => {
    if(condition && destinationService)
    saveCondition(switchId, condition, destinationService);
    onClose();
  };

  const handleRemove = (index) => {
    removeCondition(switchId, index);
  }

  const conditions = nodeProperties[switchId]?.conditions || [];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Definisci Condizione per {switchId}</h2>
        <input
          type="text"
          placeholder="Inserisci condizione"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
        <select
          value={destinationService}
          onChange={(e) => setDestinationService(e.target.value)}
        >
          <option value="">Seleziona un servizio</option>
          {services.map((service, index) => (
            <option key={index} value={service}>
              {service}
            </option>
          ))}
        </select>
        <button className='save-button' onClick={handleSave}>Salva</button>

        <div className="conditions-list">
          <h3>Condizioni Associate</h3>
          {conditions.length === 0 ? (
            <p>Nessuna condizione associata</p>
          ) : (
            <ul>
              {conditions.map((cond, index) => (
                <li key={index}>
                  <span>Condizione: {cond.condition}</span>
                  <span> con Destinazione: {cond.destinazione}</span>
                  <button className="remove-cond-button" onClick={() => handleRemove(index)}>Rimuovi</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwitchModal;