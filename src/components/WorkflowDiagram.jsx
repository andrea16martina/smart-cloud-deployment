import React, { useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap} from 'react-flow-renderer';
import { useNodeContext } from '../management/NodeContext';
import useNodeManager from '../management/NodeManager';
import './styles/WorkflowDiagram.css';

const WorkflowDiagram = ({showError}) => {
  const { nodes, edges, onEdgesChange, onNodesChange, nodeProperties} = useNodeContext();
  const {onConnect} = useNodeManager(showError)

  return (
    <div className='react-flow-container'>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              label: nodeProperties[node.id]?.task || node.id, // Se il task esiste, lo usiamo come label, altrimenti mettiamo 'Task N/A'
            }
          }))}
          edges={edges.map((edge) => ({
            ...edge,
            label: edge.label || '', // Aggiungi l'etichetta agli edge
          labelStyle: { fill: '#000', fontWeight: 700 }, // Stile dell'etichetta
        }))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
  );
};

export default WorkflowDiagram;