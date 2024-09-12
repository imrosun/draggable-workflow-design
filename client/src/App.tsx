import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home-page';
import WorkflowPage from './pages/workflow-page';
import CSVUploadPage from './pages/csv-upload-page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/upload" element={<CSVUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
