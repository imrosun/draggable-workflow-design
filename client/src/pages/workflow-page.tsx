import { useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Navbar from '../components/navbar';
import WorkflowNode from '../components/workflow-node';
import 'tailwindcss/tailwind.css';
import { motion } from 'framer-motion';

const nodeTypes = { workflowNode: WorkflowNode };

const tools = [
  { id: 1, name: 'Start', type: 'start', bgColor: 'bg-blue-500' },
  { id: 2, name: 'Filter Data', type: 'filterData', bgColor: 'bg-green-500' },
  { id: 3, name: 'Wait', type: 'wait', bgColor: 'bg-yellow-500' },
  { id: 4, name: 'Convert Format', type: 'convertFormat', bgColor: 'bg-red-500' },
  { id: 5, name: 'Send POST Request', type: 'sendPost', bgColor: 'bg-purple-500' },
  { id: 6, name: 'End', type: 'end', bgColor: 'bg-blue-500' },
];

const WorkflowPage = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeId, setNodeId] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null); // Save status

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const handleEdgesChange = (changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const handleConnect = (params: Connection | Edge) => {
    setEdges((eds) => addEdge(params, eds));
  };

  const addNode = (type: string, position: { x: number; y: number }, color: string) => {
    const newNode: Node = {
      id: `${nodeId}`,
      position,
      data: {
        label: `${type} Node`,
        color,
        onDelete: handleDeleteNode
      },
      type: 'workflowNode',
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId((prevId) => prevId + 1);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
  };

  const handleDragStart = (event: React.DragEvent, tool: { name: string, bgColor: string }) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: tool.name, color: tool.bgColor }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const { type, color } = JSON.parse(event.dataTransfer.getData('application/reactflow'));
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    addNode(type, position, color);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const saveWorkflow = async () => {
    const workflowData = { nodes, edges }; 
  
    try {
      const response = await fetch('http://localhost:5000/api/workflows/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData), 
      });
  
      if (!response.ok) {
        throw new Error('Failed to save workflow');
      }
  
      const result = await response.json();
      console.log('Workflow saved:', result);
      alert('Workflow saved successfully');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Failed to save workflow');
    }
  };
  
  return (
    <motion.div
      className="h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Navbar
        title="Workflow Editor"
        onBack={() => window.history.back()}
        onSave={saveWorkflow} 
        onSettings={() => alert('Settings')}
      />

      <div className="flex h-full">
        {sidebarOpen && (
          <aside
            className={`${sidebarOpen ? 'block' : 'hidden md:block'} md:w-1/5 w-full md:relative fixed top-16 left-0 bg-gray-600 rounded-r-xl h-fit p-4 transition-all z-50`}
          >
            <h3 className="mb-4 font-semibold text-lg text-white">Add nodes</h3>
            <div className="flex flex-col ">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className={`${tool.bgColor} text-white p-2 mb-2 rounded cursor-pointer`}
                  draggable
                  onDragStart={(event) => handleDragStart(event, { name: tool.name, bgColor: tool.bgColor })}
                >
                  {tool.name}
                </div>
              ))}
            </div>
          </aside>
        )}

        <div className="flex-grow pb-10" onDrop={handleDrop} onDragOver={handleDragOver}>
          <button
            className="absolute top-20 z-50 left-4 bg-gray-600 text-white px-4 py-2 rounded-t-xl"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            {sidebarOpen ? 'Close' : 'Tools'}
          </button>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap className='hidden sm:block' />
            <Controls className='hidden sm:block' />
          </ReactFlow>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkflowPage;
