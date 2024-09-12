import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();  

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl mb-8">Welcome to Workflow Manager</h1>
      <div className="space-y-4 space-x-2">
        <button 
          onClick={() => navigate('/workflow')}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Create New Workflow
        </button>
        <button 
          onClick={() => navigate('/upload')}
          className="px-4 py-2 bg-blue-400 text-white rounded"
        >
          Upload CSV
        </button>
      </div>
    </div>
  );
};

export default HomePage;
