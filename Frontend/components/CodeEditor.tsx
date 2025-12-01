// components/CodeEditor.tsx
"use client";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  content: string;
  onChange: (value: string | undefined) => void;
  language: string; 
}

export default function CodeEditor({ content, onChange, language }: CodeEditorProps) {
  const getLanguageId = (lang: string) => {
    if (lang === 'js') return 'javascript';
    if (lang === 'py') return 'python';
    return lang;
  };

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={getLanguageId(language)} 
      value={content}
      onChange={onChange}
    />
  );
}