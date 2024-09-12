import create from 'zustand';
import { Node, Edge, addEdge, Connection } from 'reactflow'; // Import addEdge here
import axios from 'axios';

interface WorkflowStore {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onConnect: (params: Connection | Edge) => void;
  saveWorkflow: () => void;
}

const useStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  onConnect: (params) => set({ edges: addEdge(params, get().edges) }),
  saveWorkflow: async () => {
    const { nodes, edges } = get();
    try {
      await axios.post('/api/workflows', { nodes, edges });
      alert('Workflow saved successfully!');
    } catch (error) {
      alert('Error saving workflow');
    }
  },
  // onConnect: (params) => {
  //   set((state) => ({ edges: addEdge(params, state.edges) }));
  // },
}));

export default useStore;
