import * as vectorStore from "./services/vectorStore.js";
import { v4 as uuidv4 } from "uuid";

// ---------------------------------------------
// 🔥 SEED DATA — REAL DEBUGGING EXAMPLES
// ---------------------------------------------
const SEED_DOCUMENTS = [
  {
    text: `
JavaScript TypeError: Cannot read properties of undefined
Cause: Accessing obj.x when obj is undefined.
Fix: Add null checks or initialize obj before use.
Correct Example:
const obj = data || {};
console.log(obj.x);
    `,
    metadata: {
      language: "javascript",
      errorCategory: "TypeError",
      source: "seed",
      severity: "medium"
    }
  },

  {
    text: `
Python ZeroDivisionError
Cause: Dividing by zero in a mathematical function.
Fix: Add conditional check:
if denominator == 0: handle_error()
    `,
    metadata: {
      language: "python",
      errorCategory: "ZeroDivisionError",
      source: "seed",
      severity: "high"
    }
  },

  {
    text: `
Java NullPointerException
Cause: Attempting to call methods on a null object reference.
Fix:
if (obj != null) { obj.method(); }
OR use Optional.ofNullable(obj)
    `,
    metadata: {
      language: "java",
      errorCategory: "NullPointerException",
      source: "seed",
      severity: "high"
    }
  },

  {
    text: `
C++ Segmentation Fault
Cause: Dereferencing invalid pointers or out-of-bounds memory.
Fix: Validate pointers & array bounds.
Example:
if (ptr != nullptr) { ... }
    `,
    metadata: {
      language: "cpp",
      errorCategory: "SegFault",
      source: "seed",
      severity: "critical"
    }
  },

  {
    text: `
Node.js fs.readFile error: Path must be a string
Cause: Passing non-string filePath (number, object, undefined)
Fix:
fs.readFile(String(path), "utf-8", cb)
    `,
    metadata: {
      language: "javascript",
      errorCategory: "TypeError",
      source: "seed",
      severity: "low"
    }
  },

  {
    text: `
SQL Syntax Error
Cause: Misplaced comma or missing keyword.
Fix:
Check syntax near SELECT, FROM, WHERE.
Example:
SELECT name, age FROM users;
    `,
    metadata: {
      language: "sql",
      errorCategory: "SyntaxError",
      source: "seed",
      severity: "low"
    }
  }
];


// ---------------------------------------------
// 🔥 RUN SEEDING PROCESS
// ---------------------------------------------
async function seed() {
  console.log("🚀 Seeding ChromaDB with debugging examples...\n");

  try {
    for (const doc of SEED_DOCUMENTS) {
      const id = uuidv4();
      await vectorStore.addDoc(id, doc.text, doc.metadata);
      console.log(`✔️ Added seed doc: ${id}`);
    }

    console.log("\n✅ Seeding complete!");
    console.log("📚 Total docs added:", SEED_DOCUMENTS.length);

  } catch (err) {
    console.error("❌ Error during seeding:", err.message);
  }
}

seed();
