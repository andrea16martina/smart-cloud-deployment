import { useState } from 'react';

const useWorkflowManager = () => {
  const [workflowList, setWorkflowList] = useState([]);
  const [currentWorkflowIndex, setCurrentWorkflowIndex] = useState();

  const saveWorkflow = (workflow) => {
    // Imposta il colore di tutti i nodi su #fff
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

  const loadWorkflow = (index) => {
    setCurrentWorkflowIndex(index);
    return workflowList[index];
  };

  const deleteWorkflow = (index) => {
    const updatedWorkflowList = workflowList.filter((_, i) => i !== index);
    setWorkflowList(updatedWorkflowList);
    localStorage.setItem('workflows', JSON.stringify(updatedWorkflowList));
  };

  return {
    workflowList,
    saveWorkflow,
    loadWorkflow,
    deleteWorkflow,
    setCurrentWorkflowIndex,
    currentWorkflowIndex,
    setWorkflowList
  };
};

export default useWorkflowManager;