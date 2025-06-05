import React, { createContext, useContext, useState } from 'react';
import { useNodesState, useEdgesState } from 'react-flow-renderer';

const NodeContext = createContext();

export const NodeProvider = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeProperties, setNodeProperties] = useState({});

  return (
    <NodeContext.Provider value={{ nodes, setNodes, edges, setEdges, nodeProperties, setNodeProperties, onNodesChange, onEdgesChange }}>
      {children}
    </NodeContext.Provider>
  );
};

export const useNodeContext = () => useContext(NodeContext);