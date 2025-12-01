// components/EditorLoader.tsx
"use client";
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { /* ... */ });

interface EditorLoaderProps {
  fileContent: string;
  onContentChange: (value: string | undefined) => void;
  language: string;
  fontSize: number;
  tabSize: number;
}

export default function EditorLoader({ fileContent, onContentChange, language, fontSize, tabSize }: EditorLoaderProps) {
  return (
    <div className="flex-1 overflow-hidden"> 
      <CodeEditor
        content={fileContent}
        onChange={onContentChange}
        language={language}
        fontSize={fontSize}
        tabSize={tabSize}
      />
    </div>
  );
}