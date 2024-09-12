import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion'; 
import axios from 'axios';

interface Workflow {
  id: string;
  name: string;
}

const CSVUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const navigate = useNavigate();

  const pageTransition = {
    initial: { opacity: 0, x: '-100vw' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100vw' },
    transition: { duration: 0.5, ease: 'easeInOut' },
  };

  useEffect(() => {
    axios.get('/api/workflows')
      .then((response) => setWorkflows(response.data))
      .catch((error) => console.error('Error fetching workflows:', error));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;
  
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const json = JSON.parse(e.target?.result as string);
  //     setNodes(json.nodes);
  //     setEdges(json.edges);
  //   };
  //   reader.readAsText(file);
  // };
  

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a CSV file.');
      return;
    }

    const newWorkflow = {
      id: 'csv-generated-workflow',
      name: file.name.replace('.csv', ''),
    };

    setTimeout(() => {
      navigate('/workflow', { state: { workflow: newWorkflow } });
    }, 1000);
  };

  return (
    <motion.div
    className="flex flex-col items-center p-8"
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition.transition}
    // variants={pageTransition}
  >
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="self-start mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back
      </button>

      <h1 className="text-3xl mb-6 font-semibold text-gray-800">Upload CSV and Execute Workflow</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* File Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Upload CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 w-full"
          />
        </div>

        {/* Workflow Selector */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Workflow</label>
          <select
            value={selectedWorkflow}
            onChange={(e) => setSelectedWorkflow(e.target.value)}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="">Select a workflow</option>
            {workflows.map((workflow) => (
              <option key={workflow.id} value={workflow.id}>
                {workflow.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Execute Workflow
        </button>
      </form>
    </motion.div>
  );
};

export default CSVUploadPage;
