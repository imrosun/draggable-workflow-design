const express = require('express');
const cors = require('cors');
const workflowRoutes = require('./routes/workflow-routes');
const authRoutes = require('./routes/auth-routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/workflows', workflowRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

module.exports = app;
