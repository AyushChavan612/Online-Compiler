
// This simulates what the Frontend sends to the Backend
const payload = {
  filePath: "test.js", // The backend will look for this file in the root
  language: "javascript", // Optional, backend acts smart if omitted
};

console.log(`⏳ Requesting optimization for file: ${payload.filePath}...`);

try {
  const response = await fetch("http://localhost:5000/api/optimize", {
    // Ensure port matches your server.js (8080 or 5000)
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (data.success) {
    console.log("\n✅ SUCCESS: Backend read the file and optimized it!");
    console.log("--------------------------------------------------");
    console.log("📄 Original File Path:", data.filePath);
    console.log("⚡ Improvement:", data.data.improvementSummary);
    console.log(
      "📝 Complexity Change:",
      `${data.data.originalComplexity} -> ${data.data.optimizedComplexity}`
    );
    console.log("--------------------------------------------------");
    // console.log("Optimized Code:\n", data.data.optimizedCode);
  } else {
    console.log("\n❌ FAILED:", data.message || data.error);
  }
} catch (error) {
  console.error("❌ Network Error. Is the server running?", error.message);
}
