const express = require('express');
const cors = require('cors');
const workflowRoutes = require('./routes/workflow-routes');
const authRoutes = require('./routes/auth-routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workflows', (req, res, next) => {
  console.log('API Workflows route accessed');
  next();
}, workflowRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

module.exports = app;
