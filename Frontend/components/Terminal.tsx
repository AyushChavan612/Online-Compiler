// components/Terminal.tsx
"use client";
import { useEffect, useRef } from 'react';
interface TerminalProps { output: string[]; }

export default function Terminal({ output }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {  }, [output]);

  return (
    <div 
      ref={terminalRef}
      className="bg-black p-4 font-mono overflow-y-auto h-full"
    >
      {output.map((line, index) => (
        <p key={index} className="whitespace-pre-wrap">{line}</p>
      ))}
    </div>
  );
}