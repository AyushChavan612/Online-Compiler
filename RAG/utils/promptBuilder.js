export function buildPrompt({
  code,
  errorLogs,
  language,
  runtimeOutput,
  retrieved,
  filePath,
  functionName
}) {
  
  // ------------------------------
  // Build RAG Context
  // ------------------------------
  let context = "";

  if (retrieved && retrieved.length > 0) {
    context += `The following are similar past issues from the knowledge base:\n\n`;
    retrieved.forEach((r, i) => {
      context += `--- Retrieved Doc ${i + 1} ---\n`;
      context += `${r.doc}\n`;
      context += `Metadata: ${JSON.stringify(r.metadata)}\n\n`;
    });
  } else {
    context += `No similar past cases were found in the knowledge base. Rely only on the given code and error logs.\n\n`;
  }

  // ------------------------------
  // Final Prompt for Gemini
  // ------------------------------
  return `
You are an expert AI Debugger. Analyze the code and error logs and create a structured debugging response.

Programming Language: ${language}
File Path: ${filePath || "N/A"}
Function Name: ${functionName || "Unknown or not applicable"}

=========================
ERROR LOGS
=========================
${errorLogs || "No error logs provided"}

=========================
CODE SNIPPET
=========================
${code || "No code provided"}

=========================
RUNTIME OUTPUT
=========================
${runtimeOutput || "No runtime output"}

=========================
KNOWLEDGE BASE (RAG)
=========================
${context}

=========================
YOUR TASKS
=========================

1. Identify the **root cause** of the issue clearly.
2. Provide **correctedCode** — a FULL corrected version of the snippet/file.
3. Provide an additional field **fix** summarizing the important code change.
4. Explain the issue and fix clearly under **explanation**.
5. Provide **steps** — bullet points showing how to resolve such issues in general.
6. Provide **testCases** — list of inputs to verify correctness after the fix.
7. If retrieved documents influenced your fix, summarize them in **fromKnowledgeBase**.

=========================
RESPONSE FORMAT (IMPORTANT)
=========================

Return ONLY a **valid JSON object** with exactly these keys:

{
  "rootCause": "...",
  "summary": "...",
  "correctedCode": "...",
  "fix": "...",
  "explanation": "...",
  "steps": ["...", "..."],
  "testCases": ["...", "..."],
  "fromKnowledgeBase": ["...", "..."]
}

⚠️ DO NOT return markdown.
⚠️ DO NOT wrap JSON in backticks.
⚠️ DO NOT include extra commentary outside the JSON.
  `;
}
