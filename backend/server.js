const express = require('express');
const path = require('path');
const fs = require('fs');
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

// ✅ Serve uploaded images (works both locally and on Railway)
const uploadDir = path.join(__dirname, 'public/uploads');
const altUploadDir = path.join(__dirname, 'src/public/uploads');

// Check which path actually exists
const finalUploadDir = fs.existsSync(uploadDir) ? uploadDir : altUploadDir;

// Log which path is being used for clarity
console.log(`🖼️ Serving uploads from: ${finalUploadDir}`);

app.use('/uploads', express.static(finalUploadDir));

// ✅ API routes
app.use('/api', routes);

// ✅ Catch all handler: send React index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ✅ 404 handler
app.use(notFoundHandler);

// ✅ Global error handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
