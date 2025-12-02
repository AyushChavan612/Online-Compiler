import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini with Environment Variable
// Ensure your friend has GEMINI_API_KEY in his .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Use the model we confirmed works: gemini-2.5-flash
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const optimizeCode = async (code, language) => {
  try {
    const prompt = `
    Role: Senior Software Engineer and Performance Architect.
    Task: Optimize the provided ${language} code for execution speed, memory usage, and readability.

    Input Code:
    ${code}

    Requirements:
    1. Identify inefficient algorithms (e.g., O(n^2) nested loops).
    2. Suggest a cleaner, faster version.
    3. Estimate the Time Complexity (Big O) before and after.
    
    Output Format:
    You must return strictly valid JSON. Do not include markdown formatting (like \`\`\`json).
    
    JSON Structure:
    {
      "originalComplexity": "String (e.g., O(n^2))",
      "optimizedComplexity": "String (e.g., O(n))",
      "analysis": "Brief explanation of what was inefficient.",
      "optimizedCode": "The full corrected code string",
      "improvementSummary": "One sentence summary of the gain (e.g., 'Reduced processing time by using a Hash Map')."
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean markdown (Gemini sometimes wraps JSON in markdown blocks)
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    // Return a safe fallback object so the server doesn't crash
    return {
      error: "Failed to optimize code",
      details: error.message,
    };
  }
};
