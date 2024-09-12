const express = require('express');
const multer = require('multer');
const router = express.Router();
const { executeWorkflow, saveWorkflow, getWorkflows } = require('../controllers/workflow-controller');

const upload = multer({ dest: 'uploads/' });

router.post('/save', async (req, res) => {
  try {
    await saveWorkflow(req, res); // Pass both req and res
  } catch (error) {
    console.error('Error saving workflow:', error);
    res.status(500).json({ message: 'Error saving workflow' });
  }
});

router.get('/workflows', async (req, res) => {
  try {
    const workflows = await getWorkflows();
    res.status(200).json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ message: 'Error fetching workflows' });
  }
});

router.post('/execute-workflow', upload.single('file'), async (req, res) => {
  const { workflowId } = req.body;
  const csvFilePath = req.file.path;
  
  try {
    await executeWorkflow(workflowId, csvFilePath);
    res.status(200).json({ message: 'Workflow executed successfully' });
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({ message: 'Error executing workflow' });
  }
});

module.exports = router;
