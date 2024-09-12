const Workflow = require('../models/workflow');
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');

// Save Workflow
exports.saveWorkflow = async (req, res) => {
  try {
    const { nodes, edges } = req.body;
    const workflow = new Workflow({ nodes, edges });
    await workflow.save();
    res.status(201).json(workflow);
  } catch (err) {
    res.status(500).json({ message: 'Error saving workflow', error: err.message });
  }
};

// Get Workflows
exports.getWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find();
    res.status(200).json(workflows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching workflows', error: err.message });
  }
};

// Execute Workflow
exports.executeWorkflow = async (req, res) => {
  try {
    const { workflowId } = req.body;
    const workflow = await Workflow.findById(workflowId);

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    // Assume a CSV file is uploaded
    const results = [];
    const filePath = req.file.path;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Execute nodes in workflow
        for (const node of workflow.nodes) {
          switch (node.type) {
            case 'filterData':
              // Example: convert all data in the first column to lowercase
              results.forEach(row => {
                row[node.data.column] = row[node.data.column].toLowerCase();
              });
              break;
            case 'wait':
              // Delay execution (dummy code)
              await new Promise(resolve => setTimeout(resolve, 60000));
              break;
            case 'convertFormat':
              // Convert CSV to JSON (already parsed in `results`)
              break;
            case 'sendPostRequest':
              // Send POST request with JSON payload
              await axios.post('https://requestcatcher.com/test', results);
              break;
            default:
              break;
          }
        }

        res.status(200).json({ message: 'Workflow executed successfully', data: results });
      });
  } catch (err) {
    res.status(500).json({ message: 'Error executing workflow', error: err.message });
  }
};
