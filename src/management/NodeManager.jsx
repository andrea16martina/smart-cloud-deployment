import { addEdge } from 'react-flow-renderer';
import { useNodeContext } from './NodeContext';

const useNodeManager = (showError) => {
  const { nodes, setNodes, edges, setEdges, nodeProperties, setNodeProperties } = useNodeContext();

  const onConnect = (params) => {
    const { source, target } = params;
    
    // Prevenire connessioni circolari
    if (source === target) {
      showError("Impossibile connettere un nodo a se stesso.");
      return;
    }
  
    const sourceNode = nodes.find(node => node.id === source);
    if (sourceNode) {
      const existingEdgesFromSource = edges.filter(edge => edge.source === source);
      if (existingEdgesFromSource.length > 0 && !source.startsWith('switch')) {
        showError("I nodi possono avere solo una connessione in uscita.");
        return;
      } else if (existingEdgesFromSource.length >= 0 && source.startsWith('switch')) {
        showError("usa il pulsante 'aggiungi condizione' per creare una connessione");
        return;
      }
    }
  
    setEdges((eds) => addEdge(params, eds));
  };

  const updateNodeProperties = (nodeId, properties) => {
    setNodeProperties((prevProperties) => ({
      ...prevProperties,
      [nodeId]: properties,
    }));
  };

  const removeNode = (id) => {
    setEdges((eds) => {
      const updatedEdges = eds.filter((edge) => edge.source !== id && edge.target !== id);

      // Se il nodo è uno switch, rimuovi anche i nodi di destinazione associati
      const switchNode = eds.find((edge) => edge.source === id && edge.source.startsWith("switch-"));
      if (switchNode) {
        const connectedNodes = eds.filter((edge) => edge.source === switchNode.source);
        connectedNodes.forEach((edge) => {
          // Qui rimuoviamo i nodi collegati al nodo switch
          setNodes((nds) => nds.filter((n) => n.id !== edge.target));
        });
      }
             
      return updatedEdges;
    });

    const switchNodeId = findSwitchByDestinationNodeId(id);
    const conditionIndex = findConditionIndexByDestination(switchNodeId, id);
    if (switchNodeId && conditionIndex !== -1) {
      removeCondition(switchNodeId, conditionIndex);
    }

    // Fase 2: Rimuovere il nodo
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  const removeCondition = (nodeId, conditionIndex) => {
    if (conditionIndex === -1) return;

    setNodeProperties((prev) => {
      const conditions = prev[nodeId]?.conditions || [];
      const updatedConditions = conditions.filter((_, index) => index !== conditionIndex);

      return {
        ...prev,
        [nodeId]: { ...prev[nodeId], conditions: updatedConditions },
      };
    });

    // Rimuovi anche il nodo destinazione associato alla condizione
    const conditionToRemove = nodeProperties[nodeId]?.conditions[conditionIndex];
    if (conditionToRemove) {
      setNodes((nds) => nds.filter((node) => node.id !== conditionToRemove?.destinazione));
      // Rimuovi anche le connessioni relative al nodo servizio
      setEdges((eds) => eds.filter((edge) => edge.target !== conditionToRemove?.destinazione));
    }
  };

  const findSwitchByDestinationNodeId = (destinationNodeId) => {
    // Troviamo tutte le connessioni che portano al nodo di destinazione
    return edges.find((edge) => edge.target === destinationNodeId)?.source;
  };

  const findConditionIndexByDestination = (switchNodeId, destinationNodeId) => {
    const conditions = nodeProperties[switchNodeId]?.conditions || [];
    return conditions.findIndex((condition) => condition.destinazione === destinationNodeId);
  };

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

  const saveCondition = (nodeId, condition, destinationService) => {
    const newServiceNode = {
      id: `${destinationService}-${Math.random().toString(36).substr(2, 9)}`,
      data: { label: destinationService },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      sourcePosition: 'bottom',
      targetPosition: 'top',
    };

    // Aggiungi il nodo
    setNodes((nds) => [...nds, newServiceNode]);
    
    // Aggiungi la condizione
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
    
    // Crea il collegamento
    setEdges((eds) => addEdge({ source: nodeId, target: newServiceNode.id, label}, eds));
    
  };

  const onSaveDetails = (nodeId, details) => {
    // Aggiorna i dettagli del nodo
    setNodeProperties(prevProperties => ({
      ...prevProperties,
      [nodeId]: details,
    }));
  
    // Trova la connessione in uscita dal nodo corrente
    const outgoingConnection = edges.find(edge => edge.source === nodeId);
    
    if (outgoingConnection) {
      const targetNode = nodes.find(node => node.id === outgoingConnection.target);
  
      // Se il nodo di destinazione è uno switch, aggiorna la logica delle condizioni
      if (targetNode && targetNode.id.startsWith('switch-')) {
        const updatedDetails = {
          ...details,
          next: {
            conditions: nodeProperties[targetNode.id].conditions.map(condition => {
              return {
                if: condition.condition,  // La condizione del nodo switch
                call: nodeProperties[condition.destinazione].task || condition.destinazione,  // Nodo di destinazione della condizione
              };
            })
          }
        };
  
        // Aggiorna il nodo corrente con la nuova logica 'next' (solo se il nodo è uno switch)
        setNodeProperties(prev => ({
          ...prev,
          [nodeId]: updatedDetails
        }));
      } else {
        // Se il nodo non è uno switch, aggiorniamo il campo next con il nome del task del nodo di destinazione
        const updatedDetails = {
          ...details,
          next: { 
            call: nodeProperties[targetNode.id]?.task || 'task N/A' // Aggiungiamo il task del nodo destinazione
          }
        };
  
        // Aggiorna i dettagli del nodo corrente con il nuovo campo `next`
        setNodeProperties(prev => ({
          ...prev,
          [nodeId]: updatedDetails
        }));
      }
    }
  }; 
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

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    setNodeProperties,
    nodeProperties,
    addServiceNode,
    addSwitchNode,
    removeNode,
    onConnect,
    updateNodeProperties,
    findSwitchByDestinationNodeId,
    findConditionIndexByDestination,
    removeCondition,
    saveCondition,
    onSaveDetails,
    updateNodeColors
  };
};

export default useNodeManager;