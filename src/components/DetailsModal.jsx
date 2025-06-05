import React, { useState, useEffect } from 'react';
import useNodeManager from '../management/NodeManager';
import './styles/DetailsModal.css';
import FileModal from './FileModal';
import InputModal from './InputModal';

const DetailsModal = ({ isOpen, onClose, nodeId, services }) => {
  const [taskName, setTaskName] = useState('');
  const [command, setCommand] = useState('');
  const [container, setContainer] = useState('');
  const [engine, setEngine] = useState('');
  const [protocol, setProtocol] = useState('');
  const [transport, setTransport] = useState('');
  const [confidenzialità, setConfidenzialità] = useState(false);
  const [integrità, setIntegrità] = useState(false);
  const [disponibilità, setDisponibilità] = useState(false);
  const [autenticazione, setAutenticazione] = useState(false);
  const {nodeProperties, onSaveDetails} = useNodeManager();
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [selectedInput, setSelectedInput] = useState(null);

  useEffect(() => {
    if (nodeId && nodeProperties[nodeId]) {
      const nodeDetail = nodeProperties[nodeId];
      setTaskName(nodeDetail?.task || '');
      setCommand(nodeDetail?.command || '');
      setContainer(nodeDetail?.runtime?.container || '');
      setEngine(nodeDetail?.runtime?.engine || '');
      setProtocol(nodeDetail?.coms?.protocol || '');
      setTransport(nodeDetail?.coms?.transport || '');
      setConfidenzialità(nodeDetail?.sec?.confidenzialità || false);
      setIntegrità(nodeDetail?.sec?.integrità || false);
      setDisponibilità(nodeDetail?.sec?.disponibilità || false);
      setAutenticazione(nodeDetail?.sec?.autenticazione || false);
      setSelectedInput(nodeDetail?.input || null);
    }
  }, [nodeId, nodeProperties]);

  const handleSave = () => {
    const updatedDetails = {
      ...nodeProperties[nodeId],
      task: taskName,
      command,
      runtime: { container, engine },
      coms: { protocol, transport },
      sec : {confidenzialità, integrità, disponibilità, autenticazione}
    };
    onSaveDetails(nodeId, updatedDetails);
    onClose();
  };

  const handleSelectFile = (file) => {
    const updatedDetails = {
      ...nodeProperties[nodeId],
      input: file
    };
    onSaveDetails(nodeId, updatedDetails);
    setIsFileModalOpen(false);
  }

  if (!isOpen) return null;

  const service = services.find((service) => service.name === nodeId.split('-')[0]);

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isFileModalOpen || isInputModalOpen ? 'no-overflow' : ''}`}>
        <button className="close-button" onClick={onClose}>x</button>
        <h2>Dettagli Nodo: {nodeId}</h2>

        <div className="modal-field">
          <label htmlFor="taskName">Nome della Task:</label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>

        {service && service.parameters && (
          <div className="modal-field">
            <h3>Input</h3>
            {service.parameters.map((param, index) => (
              <div key={index}>
                <label>{param.name} ({param.type})</label>
                {param.type !== "string" && param.type !== "file" && param.type !== "int" && param.type !== "boolean" && param.type !== "float" && param.struct && (
                  <ul>
                    {param.struct.map((field, idx) => (
                      <li key={idx}>{field.name} ({field.type})</li>
                    ))}
                  </ul>
                )}
                {param.type === 'file' && (
                  <>
                    {selectedInput ? (
                      <div>
                        <p>File selezionato: {selectedInput.name}</p>
                        <button onClick={() => setIsFileModalOpen(true)}>Cambia file</button>
                      </div>
                    ) : (
                      <button onClick={() => setIsFileModalOpen(true)}>Seleziona file</button>
                    )}
                  </>
                )} 
              {param.type != 'file' && (
                  <>
                    {selectedInput ? (
                      <div>
                        <p>Input: {selectedInput.name}</p>
                        <button onClick={() => setIsInputModalOpen(true)}>Cambia Input</button>
                      </div>
                    ) : (
                      <button onClick={() => setIsInputModalOpen(true)}>Definisci Input</button>
                    )}
                  </>
                )} 
              </div>
            ))}
          </div>
        )}

        <div className="modal-field">
          <label htmlFor="command">Command:</label>
          <textarea style={{ width: '100%' }}
            id="command"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
        </div>

        <div className="modal-field">
          <h3>Requisiti Runtime</h3>
          <label htmlFor="container">Container:</label>
          <input
            type="text"
            id="container"
            value={container}
            onChange={(e) => setContainer(e.target.value)}
          />
          <label htmlFor="engine">Engine:</label>
          <input
            type="text"
            id="engine"
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
          />
        </div>

        <div className="modal-field">
          <h3>Requisiti Coms</h3>
          <label htmlFor="protocol">Protocol:</label>
          <input
            type="text"
            id="protocol"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
          />
          <label htmlFor="transport">Transport:</label>
          <input
            type="text"
            id="transport"
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
          />
        </div>

        <div className="modal-field">
          <h3>Requisiti di Sicurezza</h3>
          <div className="security-requirement-container">
          <div className="security-requirement">
            <label>Confidenzialità:</label>
            <input
              type="checkbox"
              checked={confidenzialità}
              onChange={(e) => setConfidenzialità(e.target.checked)}
            />
          </div>
          <div className="security-requirement">
            <label>Integrità:</label>
            <input
              type="checkbox"
              checked={integrità}
              onChange={(e) => setIntegrità(e.target.checked)}
            />
          </div>
          <div className="security-requirement">
            <label>Disponibilità:</label>
            <input
              type="checkbox"
              checked={disponibilità}
              onChange={(e) => setDisponibilità(e.target.checked)}
            />
          </div>
          <div className="security-requirement">
            <label>Autenticazione:</label>
            <input
              type="checkbox"
              checked={autenticazione}
              onChange={(e) => setAutenticazione(e.target.checked)}
            />
          </div>
        </div>
        </div>

        <div className="modal-footer">
          <button className="modal-save-btn" onClick={handleSave}>
            Salva
          </button>
        </div>
        <FileModal 
        isOpen={isFileModalOpen} 
        onClose={() => setIsFileModalOpen(false)} 
        onSelectFile={handleSelectFile}
        />
        <InputModal 
        isOpen={isInputModalOpen} 
        onClose={() => setIsInputModalOpen(false)} 
        onSelectInput={handleSelectFile}
        nodeId={nodeId}
        nodeProperties={nodeProperties}
        service={service}
        />
      </div>
    </div>
  );
};

export default DetailsModal;