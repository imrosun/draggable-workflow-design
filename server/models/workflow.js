const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  nodes: {
    type: Array,
    required: true,
  },
  edges: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
}, {
  timestamps: true, 
});


const Workflow = mongoose.model('Workflow', workflowSchema);
module.exports = Workflow;