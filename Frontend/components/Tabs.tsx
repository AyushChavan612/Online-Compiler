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
    const handleCloseClick = (e: MouseEvent, filePath: string) => {
        e.stopPropagation();
        onTabClose(filePath);
    };

    const getFileName = (path: string) => {
        return path.split('/').pop() || path;
    };

    return (
        <div className="bg-gray-800 flex items-center border-b border-gray-700">
            {}
            {openFiles.map(filePath => {
                const isActive = filePath === activeFile;
                const displayName = getFileName(filePath);
                return (
                    <div
                        key={filePath}
                        onClick={() => onTabClick(filePath)}
                        className={`flex items-center p-2 cursor-pointer border-r border-gray-700 ${isActive ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-700'}`}
                    >
                        <span>{displayName}</span>
                        <button
                            onClick={(e) => handleCloseClick(e, filePath)}
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