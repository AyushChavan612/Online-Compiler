// components/Tabs.tsx
"use client";

import { MouseEvent } from 'react';

interface TabsProps {
    openFiles: string[];
    activeFile: string;
    onTabClick: (fileName: string) => void;
    onTabClose: (fileName: string) => void;
}

export default function Tabs({ openFiles, activeFile, onTabClick, onTabClose }: TabsProps) {
    const handleCloseClick = (e: MouseEvent, fileName: string) => {
        e.stopPropagation();
        onTabClose(fileName);
    };

    return (
        <div className="bg-gray-800 flex items-center border-b border-gray-700">
            {}
            {openFiles.map(fileName => {
                const isActive = fileName === activeFile;
                return (
                    <div
                        key={fileName}
                        onClick={() => onTabClick(fileName)}
                        className={`flex items-center p-2 cursor-pointer border-r border-gray-700 ${isActive ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-700'}`}
                    >
                        <span>{fileName}</span>
                        <button
                            onClick={(e) => handleCloseClick(e, fileName)}
                            className="ml-4 text-gray-400 hover:text-white text-sm"
                        >
                            x
                        </button>
                    </div>
                );
            })}
        </div>
    );
}