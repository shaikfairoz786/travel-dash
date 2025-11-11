// backend/scripts/check-express.js
const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "..", "node_modules", "express", "lib");

console.log("===== Express files on Render =====");
try {
  console.log("lib:", fs.readdirSync(base));
  console.log("router:", fs.readdirSync(path.join(base, "router")));
} catch (e) {
  console.error("Error reading Express folders:", e.message);
}
console.log("===================================");
