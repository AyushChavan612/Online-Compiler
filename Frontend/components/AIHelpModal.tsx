import React from 'react';

interface AIHelpModalProps {
  loading: boolean;
  result: any;
  onClose: () => void;
}

const Section: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => {
  if (!children) return null;
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-sky-300 mb-1">{title}</h3>
      <div className="text-sm text-gray-200 whitespace-pre-wrap bg-gray-800/60 p-2 rounded border border-gray-700">
        {children}
      </div>
    </div>
  );
};

const CodeBlock: React.FC<{ code?: string; language?: string }> = ({ code, language }) => {
  if (!code) return null;
  return (
    <pre className="text-xs bg-black/60 border border-gray-700 rounded p-3 overflow-auto max-h-72">
      <code className={`language-${language || 'plaintext'}`}>{code}</code>
    </pre>
  );
};

const AIHelpModal: React.FC<AIHelpModalProps> = ({ loading, result, onClose }) => {
  const data = result?.result ?? result;
  const issue = data?.rootCause || data?.issue || data?.errorAnalysis || data?.message;
  const fix = data?.whatToChange || data?.fix || data?.suggestions || data?.resolution;
  const steps: string[] = data?.steps || data?.nextSteps || [];
  const correctedCode: string | undefined = data?.correctedCode || data?.patch || data?.code;
  const language: string | undefined = data?.language;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[min(900px,95vw)] max-h-[90vh] bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800">
          <h2 className="text-base font-semibold">🤖 AI Help</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-sm">✕</button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="text-sm text-gray-300">Thinking… analyzing your error and code.</div>
          )}
          {!loading && result?.error && (
            <div className="text-sm text-red-400">{String(result.error)}</div>
          )}
          {!loading && !result?.error && (
            <div>
              {result?.requestId && (
                <div className="text-xs text-gray-400 mb-2">Request ID: {result.requestId}</div>
              )}
              <Section title="Why It Failed">
                {issue || 'The assistant could not extract a specific root cause.'}
              </Section>
              <Section title="What To Change">
                {fix || 'No precise fix instructions returned.'}
              </Section>
              {steps?.length > 0 && (
                <Section title="Steps">
                  <ul className="list-disc list-inside space-y-1">
                    {steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </Section>
              )}
              <Section title="Corrected Code">
                <CodeBlock code={correctedCode} language={language} />
              </Section>
            </div>
          )}
        </div>
        <div className="px-4 py-2 border-t border-gray-700 bg-gray-800 flex justify-end">
          <button onClick={onClose} className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-1 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIHelpModal;
