import React, { useState, useEffect } from 'react';
import './styles/FileModal.css';
import { useNodeContext } from '../management/NodeContext';

const InputModal = ({ isOpen, onClose, onSelectInput, nodeId, nodeProperties, service }) => {
  const [input, setInput] = useState({});
  const [parentInput, setParentInput] = useState(null);
  const { edges } = useNodeContext();

  useEffect(() => {
    if (isOpen && nodeId && nodeProperties[nodeId]) {
      const nodeDetail = nodeProperties[nodeId];
      setInput(nodeDetail.input || {});

      // Trova l'input del nodo padre se esiste
      let parentNodeId = getParentNodeId(nodeId);
      if (parentNodeId && parentNodeId.startsWith('switch-')) parentNodeId = getParentNodeId(parentNodeId);
      if (parentNodeId && nodeProperties[parentNodeId]) {
        setParentInput(nodeProperties[parentNodeId].input || null);
      } else {
        setParentInput(null);
      }
    }
  }, [isOpen, nodeId, nodeProperties]);

  const getParentNodeId = (nodeId) => {
    const edge = edges.find(edge => edge.target === nodeId);
    return edge ? edge.source : null;
  }

  const handleSave = () => {
    let formattedInput = input
    if (parentInput != input) formattedInput = { ...input, id: nodeId + '-input', name: service.name + '-input' };
    onSelectInput(formattedInput);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setInput(prevInput => ({ ...prevInput, [field]: value }));
  };

  const handleStructChange = (structName, field, value) => {
    setInput(prevInput => ({
      ...prevInput,
      [structName]: {
        ...prevInput[structName],
        [field]: value
      }
    }));
  };

  const handleUseParentInput = () => {
    setInput(parentInput);
    onSelectInput(parentInput);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="file-modal-overlay">
      <div className="file-modal-content">
        <button className="close-button" onClick={onClose}>x</button>
        <h2>Input</h2>
        {parentInput && (
          <div>
            <h3>Input del Nodo Padre</h3>
            <ul>
              {Object.entries(parentInput).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
            <button onClick={handleUseParentInput}>Usa Input del Nodo Padre</button>
          </div>
        )}
        <div>
          <h3>Definisci Nuovo Input</h3>
          {service.parameters.map((param, index) => (
            <div key={index}>
              <label>{param.name} ({param.type})</label>
              {param.type === "string" && (
                <input
                  type="text"
                  value={input[param.name] || ''}
                  onChange={(e) => handleInputChange(param.name, e.target.value)}
                />
              )}
              {param.type === "int" && (
                <input
                  type="number"
                  value={input[param.name] || ''}
                  onChange={(e) => handleInputChange(param.name, parseInt(e.target.value))}
                />
              )}
              {param.type === "float" && (
                <input
                  type="number"
                  step="0.01"
                  value={input[param.name] || ''}
                  onChange={(e) => handleInputChange(param.name, parseFloat(e.target.value))}
                />
              )}
              {param.type === "boolean" && (
                <input
                  type="checkbox"
                  checked={input[param.name] || false}
                  onChange={(e) => handleInputChange(param.name, e.target.checked)}
                />
              )}
              {param.type === "file" && (
                <input
                  type="file"
                  onChange={(e) => handleInputChange(param.name, e.target.files[0])}
                />
              )}
              {param.type !== "string" && param.type !== "file" && param.type !== "int" && param.type !== "boolean" && param.type !== "float" && param.struct && (
                <div>
                  {param.struct.map((field, idx) => (
                    <div key={idx}>
                      <label>{field.name} ({field.type})</label>
                      {field.type === "string" && (
                        <input
                          type="text"
                          value={input[param.name]?.[field.name] || ''}
                          onChange={(e) => handleStructChange(param.name, field.name, e.target.value)}
                        />
                      )}
                      {field.type === "int" && (
                        <input
                          type="number"
                          value={input[param.name]?.[field.name] || ''}
                          onChange={(e) => handleStructChange(param.name, field.name, parseInt(e.target.value))}
                        />
                      )}
                      {field.type === "float" && (
                        <input
                          type="number"
                          step="0.01"
                          value={input[param.name]?.[field.name] || ''}
                          onChange={(e) => handleStructChange(param.name, field.name, parseFloat(e.target.value))}
                        />
                      )}
                      {field.type === "boolean" && (
                        <input
                          type="checkbox"
                          checked={input[param.name]?.[field.name] || false}
                          onChange={(e) => handleStructChange(param.name, field.name, e.target.checked)}
                        />
                      )}
                      {field.type === "file" && (
                        <input
                          type="file"
                          onChange={(e) => handleStructChange(param.name, field.name, e.target.files[0])}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleSave}>Salva</button>
      </div>
    </div>
  );
};

export default InputModal;