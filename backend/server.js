const express = require("express");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./src/routes");
const {
  errorHandler,
  notFoundHandler,
} = require("./src/middleware/errorHandler");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ✅ Determine correct uploads directory
const localUploadDir = path.join(__dirname, "public/uploads");
const tmpUploadDir = "/tmp/uploads";

// Railway/Vercel use /tmp for uploads (ephemeral)
let finalUploadDir = fs.existsSync(tmpUploadDir)
  ? tmpUploadDir
  : localUploadDir;

// Ensure folder exists (for local runs)
if (!fs.existsSync(finalUploadDir)) {
  fs.mkdirSync(finalUploadDir, { recursive: true });
}

console.log(`🖼️ Serving uploads from: ${finalUploadDir}`);

// ✅ Serve uploaded images
app.use("/uploads", express.static(finalUploadDir));

// ✅ Serve React build (after uploads)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ API routes
app.use("/api", routes);

// ✅ Client-side routing fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
