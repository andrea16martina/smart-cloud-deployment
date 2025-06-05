// Funzione per salvare il workflow con aggiornamento del colore dei nodi
const saveWorkflow = (workflow) => {
  const updatedNodes = workflow.nodes.map((node) => ({
    ...node,
    style: { ...node.style, backgroundColor: '#fff' },
  }));

  const updatedWorkflow = { ...workflow, nodes: updatedNodes };

  const updatedWorkflowList = [...workflowList];
  if (currentWorkflowIndex !== undefined) {
    updatedWorkflowList[currentWorkflowIndex] = updatedWorkflow;
  } else {
    updatedWorkflowList.push(updatedWorkflow);
  }
  setWorkflowList(updatedWorkflowList);
  localStorage.setItem('workflows', JSON.stringify(updatedWorkflowList));
  window.location.reload();
};

// Funzione per aggiungere un nodo di servizio
const addServiceNode = (serviceName, parameters) => {
  const newServiceNode = {
    id: `${serviceName}-${Math.random().toString(36).substr(2, 9)}`,
    data: { label: serviceName },
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    sourcePosition: 'bottom',
    targetPosition: 'top',
    type: 'default',
  };

  setNodes((nds) => [...nds, newServiceNode]);

  setNodeProperties((prev) => ({
    ...prev,
    [newServiceNode.id]: { parameters: parameters },
  })); 
};

// Funzione per aggiungere un nodo switch
const addSwitchNode = () => {
  const newSwitchNode = {
    id: `switch-${Math.random().toString(36).substr(2, 9)}`,
    data: { label: 'Switch' },
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    sourcePosition: 'bottom',
    targetPosition: 'top',
    type: "default",
  };

  setNodes((nds) => [...nds, newSwitchNode]);

  setNodeProperties((prev) => ({
    ...prev,
    [newSwitchNode.id]: { conditions: [] },
  }));
};

// Funzione per salvare una condizione
const saveCondition = (nodeId, condition, destinationService) => {
  const newServiceNode = {
    id: `${destinationService}-${Math.random().toString(36).substr(2, 9)}`,
    data: { label: destinationService },
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    sourcePosition: 'bottom',
    targetPosition: 'top',
  };

  setNodes((nds) => [...nds, newServiceNode]);
  
  setNodeProperties((prev) => {
    const newCondition = { destinazione: newServiceNode.id, condition, service: destinationService };
    const updatedConditions = [...(prev[nodeId]?.conditions || []), newCondition];
  
    return {
      ...prev,
      [nodeId]: { ...prev[nodeId], conditions: updatedConditions },
    };
  });

  setNodeProperties((prev) => ({
    ...prev,
    [newServiceNode.id]: { requisiti: [] },
  }));

  let label = condition;
  
  setEdges((eds) => addEdge({ source: nodeId, target: newServiceNode.id, label}, eds));
};

// Funzione per aggiornare i colori dei nodi
const updateNodeColors = async () => {
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i].id.startsWith('switch-')) {
      const color = Math.random() > 0.5 ? '#90EE90' : '#FF6666';
      setNodes((nds) =>
        nds.map((node, index) =>
          index === i ? { ...node, style: { ...node.style, backgroundColor: color } } : node
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }
  }
};

// Funzione per scaricare il workflow come file JSON
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

// Funzione per caricare un workflow da un file JSON
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
