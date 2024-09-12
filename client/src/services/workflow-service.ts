import axios from 'axios';

export const getWorkflows = async () => {
  const response = await axios.get('/api/workflows');
  return response.data;
};

export const executeWorkflow = async (formData: FormData) => {
  const response = await axios.post('/api/workflows/execute', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
