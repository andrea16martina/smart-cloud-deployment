import React, { useState, useEffect } from 'react';
import './styles/FileModal.css';
import { getFilesFromDatabase } from '../management/database';

const FileModal = ({ isOpen, onClose, onSelectFile }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen]);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedFiles = await getFilesFromDatabase();
      setFiles(fetchedFiles);
    } catch (err) {
      setError('Errore durante il recupero dei file.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="file-modal-overlay">
      <div className="file-modal-content">
        <button className="close-button" onClick={onClose}>x</button>
        <h2>Files</h2>
        {loading && <p>Caricamento...</p>}
        {error && <p>{error}</p>}
        {files.length > 0 && (
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                <h4>{file.name}</h4>
                <ul>
                  {Object.entries(file).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                  ))}
                </ul>
                <button onClick={() => onSelectFile(file)}>Seleziona</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileModal;