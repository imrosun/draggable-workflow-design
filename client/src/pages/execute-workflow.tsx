import React, { useState } from 'react';
import { executeWorkflow, getWorkflows } from '../services/workflow-service';

const ExecuteWorkflow = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchWorkflows = async () => {
      const result = await getWorkflows();
      setWorkflows(result);
    };
    fetchWorkflows();
  }, []);

  const handleSubmit = async () => {
    if (!selectedWorkflow || !file) return;

    const formData = new FormData();
    formData.append('workflowId', selectedWorkflow);
    formData.append('file', file);

    await executeWorkflow(formData);
  };

  return (
    <div className="p-4">
      <h2>Execute Workflow</h2>
      <div>
        <label>Choose a Workflow:</label>
        <select onChange={(e) => setSelectedWorkflow(e.target.value)}>
          <option value="">Select</option>
          {workflows.map((workflow) => (
            <option key={workflow.id} value={workflow.id}>
              {workflow.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
      </div>
      <button onClick={handleSubmit} className="mt-4 p-2 bg-blue-500 text-white">
        Execute
      </button>
    </div>
  );
};

export default ExecuteWorkflow;
