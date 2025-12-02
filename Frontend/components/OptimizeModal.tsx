// components/OptimizeModal.tsx
"use client";

import { useState } from "react";

interface OptimizeModalProps {
  loading: boolean;
  result: any;
  onClose: () => void;
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap break-words pr-20">
        {code}
      </pre>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-purple-400 mb-2">{title}</h3>
      <div className="text-gray-300">{children}</div>
    </div>
  );
}

export default function OptimizeModal({ loading, result, onClose }: OptimizeModalProps) {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-11/12 max-w-4xl">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="ml-4 text-white">Analyzing and optimizing your code...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  // Extract data from result
  const data = result.data || result;
  const {
    originalComplexity,
    optimizedComplexity,
    analysis,
    optimizedCode,
    improvementSummary,
  } = data;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-11/12 max-w-6xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-purple-400">⚡ Code Optimization Results</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Complexity Comparison */}
          {(originalComplexity || optimizedComplexity) && (
            <Section title="⏱️ Complexity Analysis">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-900 p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Original Complexity</div>
                  <div className="text-2xl font-mono text-red-400">{originalComplexity || "N/A"}</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Optimized Complexity</div>
                  <div className="text-2xl font-mono text-green-400">{optimizedComplexity || "N/A"}</div>
                </div>
              </div>
            </Section>
          )}

          {/* Improvement Summary */}
          {improvementSummary && (
            <Section title="📊 Improvement Summary">
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-gray-300 whitespace-pre-wrap">{improvementSummary}</p>
              </div>
            </Section>
          )}

          {/* Analysis */}
          {analysis && (
            <Section title="🔍 Detailed Analysis">
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-gray-300 whitespace-pre-wrap">{analysis}</p>
              </div>
            </Section>
          )}

          {/* Optimized Code */}
          {optimizedCode && (
            <Section title="✨ Optimized Code">
              <CodeBlock code={optimizedCode} />
            </Section>
          )}

          {/* No data fallback */}
          {!originalComplexity && !optimizedComplexity && !analysis && !optimizedCode && !improvementSummary && (
            <div className="text-center text-gray-400 py-8">
              <p>No optimization data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
