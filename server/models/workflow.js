const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  nodes: [{ type: Object }],
  edges: [{ type: Object }]
});

const Workflow = mongoose.model('Workflow', workflowSchema);
module.exports = Workflow;
