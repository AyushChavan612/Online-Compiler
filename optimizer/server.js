import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

// Import our new route
import optimizerRoute from "./routes/optimizerRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from your frontend
app.use(bodyParser.json()); // Parse JSON bodies

// Register Routes
// The endpoint will be: http://localhost:5000/api/optimize
app.use("/api/optimize", optimizerRoute);

// Basic Health Check
app.get("/", (req, res) => {
  res.send("✅ DevFlow AI Optimizer is Running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✨ Optimizer Route: http://localhost:${PORT}/api/optimize`);
  console.log(`=========================================\n`);
});
