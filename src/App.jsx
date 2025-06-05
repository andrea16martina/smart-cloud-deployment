import React, { useEffect, useState } from 'react';
import './App.css';
import SideBarLeft from './components/Side-bar-left'; 
import WorkflowDiagram from './components/WorkflowDiagram';
import { NodeProvider } from './management/NodeContext';
import SwitchModal from './components/SwitchModal';
import './components/styles/progressBar.css';
import DetailsModal from './components/DetailsModal';
import ErrorModal from './components/ErrorModal';
import serviziData from './servizi.json';

function App() {
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSwitchId, setSelectedSwitchId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState({show: false, message: ''});
  const [services, setServices] = useState([]);

  useEffect(() => {
    setServices(serviziData);
  }, []);

  const openSwitchModal = (switchId) => {
    setIsSwitchModalOpen(true);
    setSelectedSwitchId(switchId);
  }

  const closeSwitchModal = () => {
    setIsSwitchModalOpen(false);
    setSelectedSwitchId(null);
  }

  const openDetailsModal = (nodeId) => {
    setIsDetailsModalOpen(true);
    setSelectedNodeId(nodeId);
  }

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedNodeId(null);
  }

  const showError = (message) => {
    setError({ show: true, message });
  };

  const closeErrorModal = () => {
    setError({ show: false, message: '' });
  };

    return (
    <NodeProvider>
      <div className="App">
        <div className="App-body">
          <SideBarLeft className="SideBarLeft" 
          openSwitchModal={openSwitchModal}
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
          openDetailsModal={openDetailsModal}
          progress={progress}
          setProgress={setProgress}
          showError={showError}
          servizi={services}
          />
          <div className="App-content">
            <WorkflowDiagram showError={showError} />
          </div>
        </div>
        <SwitchModal 
        isOpen={isSwitchModalOpen} 
        onClose={closeSwitchModal}
        services={selectedServices}
        switchId={selectedSwitchId}
        />
        <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        nodeId={selectedNodeId}
        services={services}
        />
        {progress && <div className='progress-bar'></div>}
        <ErrorModal show={error.show} message={error.message} onClose={closeErrorModal} />
      </div>
    </NodeProvider>
  );
}

export default App;