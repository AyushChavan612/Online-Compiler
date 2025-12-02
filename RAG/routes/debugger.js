import express from "express";
import fs from "fs";
import path from "path";
import { buildPrompt } from "../utils/promptBuilder.js";
import * as vectorStore from "../services/vectorStore.js";
import { sendToAI } from "../services/geminiClient.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const artifactsDir = path.join(process.cwd(), "artifacts");

// Ensure artifact folder exists
if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir);


// ------------------------------------------------------
// Existing route (if needed)
// ------------------------------------------------------
router.post("/run-and-debug", async (req, res) => {
  res.json({ message: "Your old /run-and-debug logic stays here." });
});


// ------------------------------------------------------
// 🚀 New Debugger Route (Code OR File)
// ------------------------------------------------------
router.post("/debug-compiler", async (req, res) => {
  try {
    let {
      filePath,
      code,
      language = "javascript",
      runtimeOutput = "",
      errorLogs = "",
      shouldApplyFix = false
    } = req.body;

    // ------------------------------------------------------
    // 1) If filePath provided → Read file
    // ------------------------------------------------------
    if (filePath) {
      const fullPath = path.resolve(process.cwd(), filePath);

      if (!fs.existsSync(fullPath)) {
        return res.status(400).json({ error: `File not found: ${fullPath}` });
      }

      code = fs.readFileSync(fullPath, "utf-8");
    }

    // ------------------------------------------------------
    // 2) Validate input
    // ------------------------------------------------------
    if (!code && !errorLogs) {
      return res.status(400).json({
        error: "You must provide either 'code' or 'errorLogs' or 'filePath'."
      });
    }

    // ------------------------------------------------------
    // 3) RAG Retrieval (ChromaDB)
    // ------------------------------------------------------
    let retrieved = [];
    try {
      retrieved = await vectorStore.querySimilarDocs(
        (code || "") + "\n" + (errorLogs || ""),
        3
      );
    } catch (err) {
      console.warn("⚠️ ChromaDB not reachable → Skipping retrieval.");
    }

    // ------------------------------------------------------
    // 4) Build Prompt
    // ------------------------------------------------------
    const prompt = buildPrompt({
      code,
      errorLogs,
      language,
      runtimeOutput,
      retrieved
    });

    // ------------------------------------------------------
    // 5) Get AI Response (JSON)
    // ------------------------------------------------------
    const geminiResp = await sendToAI(prompt);

    // ------------------------------------------------------
    // 6) Save artifact
    // ------------------------------------------------------
    const requestId = uuidv4();

    fs.writeFileSync(
      path.join(artifactsDir, `${requestId}.json`),
      JSON.stringify({ input: req.body, retrieved, geminiResp }, null, 2)
    );

    // ------------------------------------------------------
    // 7) Auto-Fix (Only if filePath is given)
    // ------------------------------------------------------
    let fixApplied = false;

    if (shouldApplyFix && filePath && geminiResp.correctedCode) {
      const fullPath = path.resolve(process.cwd(), filePath);

      // backup original
      fs.writeFileSync(fullPath + ".bak", code);

      // write fixed version
      fs.writeFileSync(fullPath, geminiResp.correctedCode);

      fixApplied = true;
    }

    // ------------------------------------------------------
    // 8) Final Response
    // ------------------------------------------------------
    return res.json({
      requestId,
      retrievedCount: retrieved.length,
      fixApplied,
      result: geminiResp
    });

  } catch (err) {
    console.error("Debugger error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
