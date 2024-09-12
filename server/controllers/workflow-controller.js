const Workflow = require('../models/workflow');
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');

exports.saveWorkflow = async (req, res) => {
  try {
    const { nodes, edges } = req.body;
    if (!nodes || !edges) {
      return res.status(400).json({ message: 'Invalid workflow data' });
    }
    const workflow = new Workflow({ nodes, edges });  
    await workflow.save();
    res.status(201).json({ message: 'Workflow saved successfully', workflow });
  } catch (err) {
    console.error('Error saving workflow:', err);
    res.status(500).json({ message: 'Error saving workflow', error: err.message });
  }
};

exports.getWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find();
    console.log('Fetched workflows:', workflows); // Log the fetched workflows
    res.status(200).json(workflows);
  } catch (err) {
    console.error('Error fetching workflows:', err);
    res.status(500).json({ message: 'Error fetching workflows', error: err.message });
  }
};

exports.executeWorkflow = async (req, res) => {
  try {
    const { workflowId } = req.body;
    const workflow = await Workflow.findById(workflowId);

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    const results = [];
    const filePath = req.file.path;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const node of workflow.nodes) {
          switch (node.type) {
            case 'filterData':
              results.forEach(row => {
                row[node.data.column] = row[node.data.column].toLowerCase();
              });
              break;
            case 'wait':
              await new Promise(resolve => setTimeout(resolve, 60000));
              break;
            case 'convertFormat':
              break;
            case 'sendPostRequest':
              await axios.post('https://requestcatcher.com/test', results);
              break;
            default:
              break;
          }
        }

        res.status(200).json({ message: 'Workflow executed successfully', data: results });
      });
  } catch (err) {
    console.error('Error executing workflow:', err);
    const errorMessage = err.message || 'Unknown error';
    res.status(500).json({ message: 'Error executing workflow', error: errorMessage });
  }
};
