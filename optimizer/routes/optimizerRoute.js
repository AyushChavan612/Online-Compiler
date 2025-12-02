import express from "express";
import fs from "fs";
import path from "path";
import { optimizeCode } from "../services/optimizer.js";

const router = express.Router();

// POST http://localhost:5000/api/optimize
router.post("/", async (req, res) => {
  try {
    let { code, filePath, language } = req.body;

    // DEBUG LOG: This proves you are using the correct file version
    console.log("📨 Received Request:", {
      filePath,
      codeSnippetLength: code ? code.length : 0,
    });

    // --- 1. LOGIC TO READ FILE FROM DISK ---
    if (filePath) {
      try {
        const absolutePath = path.resolve(process.cwd(), filePath);

        if (fs.existsSync(absolutePath)) {
          console.log(`📂 Reading file from disk: ${absolutePath}`);
          code = fs.readFileSync(absolutePath, "utf-8");

          // Auto-detect language
          if (!language) {
            const ext = path.extname(absolutePath);
            if (ext === ".py") language = "python";
            else if (ext === ".js") language = "javascript";
            else if (ext === ".cpp" || ext === ".c") language = "cpp";
            else if (ext === ".java") language = "java";
            else language = "javascript";
          }
        } else {
          return res.status(404).json({
            success: false,
            message: `File not found at path: ${filePath}`,
          });
        }
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: `Error reading file: ${err.message}`,
        });
      }
    }

    // --- 2. VALIDATION ---
    // If 'code' is still empty here, it means filePath was missing AND code was missing
    if (!code) {
      return res.status(400).json({
        success: false,
        message:
          "Code snippet is required. Please provide 'code' or 'filePath'.",
      });
    }

    console.log("🚀 Sending to Gemini...");

    // --- 3. CALL SERVICE ---
    const optimizationResult = await optimizeCode(
      code,
      language || "javascript"
    );

    res.json({
      success: true,
      filePath: filePath || null,
      data: optimizationResult,
    });
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during optimization",
    });
  }
});

export default router;
