import fs from "fs";

// Create a dummy file for testing purposes
fs.writeFileSync("./example.txt", "Hello from example.txt!", "utf-8");

fs.readFile("./example.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error occurred:", err);
  } else {
    console.log("File content:", data);
    // Clean up the dummy file after reading for a self-contained example
    fs.unlinkSync("./example.txt");
  }
});