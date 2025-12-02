import { ChromaClient } from "chromadb";
import { embed } from "./geminiClient.js";

const client = new ChromaClient({ path: "http://localhost:8000" });
const COLLECTION = "debugger";

let collection = null;


// ------------------------------------------------------
// 🔥 Create or Fetch Collection (Safe)
// ------------------------------------------------------
async function getCollection() {
  try {
    if (!collection) {
      collection = await client.getOrCreateCollection({
        name: COLLECTION,
        metadata: { description: "AI Debugger RAG storage (errors + fixes)" }
      });
    }
    return collection;
  } catch (err) {
    console.warn("⚠️ ChromaDB unreachable:", err.message);
    return null;
  }
}


// ------------------------------------------------------
// 🔥 Add document with safety
// ------------------------------------------------------
export async function addDoc(id, text, metadata = {}) {
  try {
    if (!text || text.trim() === "") return;

    const coll = await getCollection();
    if (!coll) return; // Chroma offline = skip silently

    const embedding = await embed(text);

    if (!embedding || embedding.length === 0) {
      console.warn("⚠️ Empty embedding. Skipping addDoc for:", id);
      return;
    }

    await coll.add({
      ids: [String(id)],
      embeddings: [embedding],
      documents: [text],
      metadatas: [metadata]
    });

  } catch (err) {
    console.warn("⚠️ RAG addDoc failed:", err.message);
  }
}


// ------------------------------------------------------
// 🔥 Query Similar Docs (Safe)
// ------------------------------------------------------
export async function querySimilarDocs(text, topK = 3) {
  try {
    if (!text || text.trim() === "") return [];

    const coll = await getCollection();
    if (!coll) return [];

    const embedding = await embed(text);
    if (!embedding || embedding.length === 0) {
      console.warn("⚠️ Empty embedding. Cannot query.");
      return [];
    }

    const results = await coll.query({
      queryEmbeddings: [embedding],
      nResults: topK
    });

    const docs = results.documents?.[0] || [];
    const metas = results.metadatas?.[0] || [];
    const scores = results.distances?.[0] || [];

    return docs.map((doc, i) => ({
      doc,
      metadata: metas[i] || {},
      score: scores[i] ?? null
    }));

  } catch (err) {
    console.warn("⚠️ RAG query failed:", err.message);
    return [];
  }
}
