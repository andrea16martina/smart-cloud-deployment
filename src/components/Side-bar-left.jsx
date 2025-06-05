import React, { useState, useEffect } from 'react';
import useWorkflowManager from '../management/WorkflowManager';
import useNodeManager from '../management/NodeManager';
import './styles/Side-bar-left.css'; 

const SidebarLeft = ({openSwitchModal, openDetailsModal, selectedServices, setSelectedServices, setProgress, showError, servizi}) => {
  const { workflowList, saveWorkflow, loadWorkflow, deleteWorkflow, setWorkflowList, setCurrentWorkflowIndex, currentWorkflowIndex } = useWorkflowManager();
  const { nodes, edges, setNodes, setEdges, setNodeProperties, nodeProperties, addServiceNode, addSwitchNode, removeNode, updateNodeColors } = useNodeManager(showError);
  const [expandedSwitches, setExpandedSwitches] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    workflows: false,
    availableServices: false,
    selectedServices: false,
    existingNodes: false,
  });

  useEffect(() => {
    const savedWorkflows = JSON.parse(localStorage.getItem('workflows')) || [];
    setWorkflowList(savedWorkflows);
  }, [setWorkflowList]);

  const toggleServiceSelection = (serviceName) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((name) => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  const startProgress = async () => {
    setProgress(true);
    await updateNodeColors(); // Aggiorna i colori dei nodi
    setProgress(false);
  };

  const handleSaveWorkflow = () => {
    const workflow = { nodes, edges, nodeProperties };
    saveWorkflow(workflow);
  };

  const handleDownloadWorkflow = () => {
    const workflow = { nodes, edges, nodeProperties };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflow));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "workflow.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleUploadWorkflow = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const workflow = JSON.parse(e.target.result);
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      setNodeProperties(workflow.nodeProperties);
    };
    reader.readAsText(file);
  };

  const toggleSwitchMenu = (switchId) => {
    setExpandedSwitches((prevState) => ({
      ...prevState,
      [switchId]: !prevState[switchId],
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const viewNode = nodes.filter((node) => node.type === 'default');

  return (
    <div className="sidebar-left">
      <div>
        <button onClick={handleSaveWorkflow}>
          {currentWorkflowIndex==undefined ? "Salva Workflow" : "Aggiorna Workflow"}</button>
      </div><br></br>

      <div className="workflow-list">
        <h3 onClick={()=>toggleSection('workflows')}> {expandedSections.workflows ? 'Workflow Salvati ▲' : 'Workflow Salvati ▼'}</h3>
        {expandedSections.workflows && (
          <div>
        {workflowList.map((workflow, index) => (
          <div key={index} className="workflow-item">
            <button onClick={() => {
              const loadedWorkflow = loadWorkflow(index);
              setNodes(loadedWorkflow.nodes);
              setEdges(loadedWorkflow.edges);
              setNodeProperties(loadedWorkflow.nodeProperties);
                setCurrentWorkflowIndex(index);
              }}>
                Carica Workflow {index + 1}
              </button>
              <button onClick={() => deleteWorkflow(index)}>Elimina</button>
              </div>
            ))}
            </div>
            )}
            </div>

            <div className="available-services">
            <h3 onClick={()=>toggleSection('availableServices')}> {expandedSections.availableServices ? 'Servizi Disponibili ▲' : 'Servizi Disponibili ▼'}</h3>
            {expandedSections.availableServices && (
              <div>
            {servizi.map((servizio) => (
              <div key={servizio.name} className="service-item">
              <button
                onClick={() => toggleServiceSelection(servizio.name)}
                className={selectedServices.includes(servizio.name) ? 'selected' : ''}
              >
                {selectedServices.includes(servizio.name) ? 'Deseleziona' : 'Seleziona'} {servizio.name}
              </button>
              </div>
            ))}
            </div>
            )}
            </div>

            <div className="selected-services">
            <h3 onClick={() => toggleSection('selectedServices')}>{expandedSections.selectedServices ? 'Servizi Selezionati ▲' : 'Servizi Selezionati ▼'}</h3>
            {expandedSections.selectedServices && (
              <div>
            {selectedServices.map((servizio) => {
              const serviceParams = servizi.find(s => s.name == servizio)?.parameters || {};
              return (
              <div key={servizio} className="selected-item">
                <span>{servizio}</span>
                <button onClick={() => addServiceNode(servizio, serviceParams)}>Aggiungi Nodo</button>
              </div>
              );
            })}
            <button onClick={addSwitchNode}>Aggiungi Nodo Switch</button>
            </div>
            )}
            </div>

            <div className="existing-nodes">
            <h3 onClick={() => toggleSection('existingNodes')}>Nodi Esistenti {expandedSections.existingNodes ? ' ▲' : '  ▼'}</h3>
            {expandedSections.existingNodes && (
              <div>
            {viewNode.map((node) => {
          const taskName = nodeProperties[node.id]?.task || node.id; // Prendi il task o usa l'id del nodo come fallback

          return (
            <div key={node.id} className="node-list">
              <div className="node-item">
                <span>{taskName}</span>

                <button onClick={() => removeNode(node.id)} className="remove-node-btn">
                  Rimuovi
                </button>

                {/* Pulsante Dettagli, visibile solo per i nodi che non sono di tipo switch */}
                {!node.id.startsWith("switch-") && (
                  <button onClick={() => openDetailsModal(node.id)} className="details-node-btn">
                    Dettagli
                  </button>
                )}

                {/* Logica per espandere i nodi switch */}
                {node.id.startsWith('switch-') && (
                  <>
                    <button onClick={() => openSwitchModal(node.id)} className="add-condition-btn">
                      Aggiungi Condizione
                    </button>
                    <button
                      className="expand-button"
                      onClick={() => toggleSwitchMenu(node.id)}
                      aria-label={`Espandi menu switch ${node.id}`}
                    >
                      {expandedSwitches[node.id] ? '▲' : '▼'}
                    </button>

                    {/* Se il nodo è espanso, mostra le condizioni */}
                    {expandedSwitches[node.id] && (
                      <div className="switch-conditions">
                        {/* Condizioni per il nodo switch */}
                        {nodeProperties[node.id]?.conditions?.map((condition) => {
                          const destinationNode = nodes.find((n) => n.id === condition.destinazione);
                          return (
                            <div key={condition.destinazione} className="condition-item">
                              <span>{nodeProperties[destinationNode]?.task || condition.destinazione}</span>
                              <button
                                onClick={() => removeNode(condition.destinazione)}
                                className="remove-node-btn"
                              >
                                Rimuovi
                              </button>
                              <button
                                onClick={() => openDetailsModal(destinationNode.id)}
                                className="details-node-btn"
                              >
                                Dettagli
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
        )}
        </div>
        <button onClick={handleDownloadWorkflow}>Scarica Workflow</button>
        <label className="upload-label">
          Carica Workflow
          <input type="file" accept=".json" onChange={handleUploadWorkflow} className="upload-input" />
        </label>
        <button onClick={startProgress}>Esegui</button>
    </div>
  );
};

export default SidebarLeft;