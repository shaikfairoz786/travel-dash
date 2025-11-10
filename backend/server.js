const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./src/routes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api', routes);

// API routes
app.use('/api', routes);

// Catch all handler: send back React's index.html file for client-side routing
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
