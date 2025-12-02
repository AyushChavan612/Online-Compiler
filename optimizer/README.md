🚀 DevFlow – AI Code Optimizer Backend

A high-performance AI-powered Code Optimizer module designed for the DevFlow IDE. It analyzes source code, identifies inefficiencies (time/space complexity), and automatically generates optimized, clean, and production-ready code using Google Gemini 2.5 Flash.

This backend is built with Node.js, Express, and Google Generative AI, featuring a specialized file-reading system for seamless IDE integration.

✨ Features

⚡ 1. Intelligent Code Optimization

Complexity Analysis: Calculates Big-O notation before and after optimization (e.g., $O(n^2) \rightarrow O(n)$).

Algorithm Replacement: Detects inefficient patterns (like nested loops) and suggests optimal data structures (Hash Maps, Sets).

Clean Code: Rewrites code to follow language-specific best practices.

🧠 2. Powered by Gemini 2.5 Flash

Uses Google's latest Gemini 2.5 Flash model for low-latency, high-reasoning performance.

Engineered prompts ensure strictly structured JSON output for easy frontend rendering.

📂 3. Direct File Integration

Smart File Reading: The API accepts a filePath relative to the project root, reads the file securely, and optimizes it without requiring the frontend to send the raw code string.

Language Auto-Detection: Automatically detects Python, JavaScript, C++, and Java based on file extensions.

📦 Project Structure

optimizer/
│
├── routes/
│   └── optimizerRoute.js    # API Endpoint (Handles file reading & validation)
│
├── services/
│   └── optimizer.js         # Gemini AI Logic (Secure API calls)
│
├── server.js                # Main Express Server
├── package.json             # Dependencies
├── .env                     # API Keys (Not uploaded to GitHub)
└── .gitignore               # Security rules


🛠️ Installation & Setup

1. Clone the Repository

git clone [https://github.com/YOUR_USERNAME/optimizer.git](https://github.com/YOUR_USERNAME/optimizer.git)
cd optimizer


2. Install Dependencies

npm install


3. Configure Environment

Create a .env file in the root directory:

PORT=5000
GEMINI_API_KEY=AIzaSy...YourActualKeyHere


(Get your key from Google AI Studio)

🚀 Usage

Start the Server

node server.js


Server will run at http://localhost:5000

API Endpoint: /api/optimize

Method: POST

Option A: Optimize by File Path (For IDE Integration)

Send the path of the active file currently open in the IDE.

{
  "filePath": "test.js"
}


Option B: Optimize Raw Code

Send the code string directly.

{
  "language": "python",
  "code": "def slow(n): ..."
}


Success Response

{
  "success": true,
  "filePath": "test.js",
  "data": {
    "originalComplexity": "O(n^2)",
    "optimizedComplexity": "O(n)",
    "analysis": "The nested loop was unnecessary...",
    "optimizedCode": "def fast(n): ...",
    "improvementSummary": "Reduced time complexity by using a Set lookup."
  }
}


🧪 Testing

You can verify the system using the included test script.

Create a dummy file named test.js with inefficient code.

Run the test script:

node test-api.js


🤝 Integration Guide (For DevFlow)

To integrate this module into the main DevFlow project:

Copy routes/optimizerRoute.js to the main backend routes/ folder.

Copy services/optimizer.js to the main backend services/ folder.

In the main server.js, register the route:

import optimizerRoute from "./routes/optimizerRoute.js";
app.use("/optimize", optimizerRoute);


🛡️ Security Note

This project uses dotenv to manage secrets. Never commit your .env file to GitHub. The .gitignore file is pre-configured to prevent this.
