import { Handle, NodeProps, Position } from 'reactflow';

const WorkflowNode = ({ id, data }: NodeProps) => {
  return (
    <div className={`p-4 border rounded shadow ${data.color} relative`}>
      <div className="flex justify-between items-center">
        <div>{data.label}</div>
        <button
          onClick={() => data.onDelete(id)}
          className="absolute top-0 right-0 bg-red-200 rounded-2xl text-red-500 hover:text-red-700"
          aria-label="Delete node"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default WorkflowNode;
