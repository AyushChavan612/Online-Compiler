// components/EditorLoader.tsx
"use client";
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { /* ... */ });

interface EditorLoaderProps {
  fileContent: string;
  onContentChange: (value: string | undefined) => void;
  language: string; 
}

export default function EditorLoader({ fileContent, onContentChange, language }: EditorLoaderProps) {
  return (
    <div className="flex-1 overflow-hidden"> 
      <CodeEditor 
        content={fileContent} 
        onChange={onContentChange}
        language={language} 
      />
    </div>
  );
}