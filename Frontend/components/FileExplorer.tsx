// components/FileExplorer.tsx
"use client";

import { FormEvent, MouseEvent, useState } from 'react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  path: string;
  children?: FileNode[];
}

interface FileExplorerProps {
  files: FileNode[]; 
  activeFile: string;
  onSelectFile: (filePath: string) => void;
  onFileDelete: (filePath: string) => void;
  onFileCreate: (parentPath?: string) => void;
  onFolderCreate: (parentPath?: string) => void;
  isAddingFile: boolean;
  isAddingFolder: boolean;
  newFileName: string;
  setNewFileName: (name: string) => void;
  handleCreateFormSubmit: (e: FormEvent) => void;
  handleFolderCreateSubmit: (e: FormEvent) => void;
  onInputBlur: () => void;
  addingInPath: string;
}

export default function FileExplorer({
  files,
  activeFile,
  onSelectFile,
  onFileDelete,
  onFileCreate,
  onFolderCreate,
  isAddingFile,
  isAddingFolder,
  newFileName,
  setNewFileName,
  handleCreateFormSubmit,
  handleFolderCreateSubmit,
  onInputBlur,
  addingInPath
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

  const handleDeleteClick = (e: MouseEvent, filePath: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete "${filePath}"?`)) {
      onFileDelete(filePath);
    }
  };

  const toggleFolder = (e: MouseEvent, folderPath: string) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const renderFileTree = (nodes: FileNode[], parentPath: string = '', depth: number = 0) => {
    return nodes.map((node) => {
      const isActive = node.path === activeFile;
      const isExpanded = expandedFolders.has(node.path);
      const indent = depth * 16;

      return (
        <div key={node.path}>
          <div
            className={`p-1 rounded flex justify-between items-center cursor-pointer ${isActive ? 'bg-sky-700' : 'hover:bg-gray-700'}`}
            style={{ paddingLeft: `${indent + 8}px` }}
            onClick={(e) => {
              if (node.type === 'folder') {
                toggleFolder(e, node.path);
              } else {
                onSelectFile(node.path);
              }
            }}
          >
            <span className="flex items-center gap-1">
              {node.type === 'folder' ? (
                <span>{isExpanded ? '📂' : '📁'}</span>
              ) : (
                <span>📄</span>
              )}
              {node.name}
            </span>
            <div className="flex gap-1">
              {node.type === 'folder' && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedFolders(prev => {
                        const ns = new Set(prev);
                        ns.add(node.path);
                        return ns;
                      });
                      onFileCreate(node.path);
                    }}
                    className="text-green-400 hover:text-green-300 text-xs font-bold px-1"
                    title="New file in folder"
                  >
                    +F
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedFolders(prev => {
                        const ns = new Set(prev);
                        ns.add(node.path);
                        return ns;
                      });
                      onFolderCreate(node.path);
                    }}
                    className="text-blue-400 hover:text-blue-300 text-xs font-bold px-1"
                    title="New folder in folder"
                  >
                    +D
                  </button>
                </>
              )}
              <button
                onClick={(e) => handleDeleteClick(e, node.path)}
                className="text-gray-400 hover:text-white text-xs font-bold px-2"
              >
                X
              </button>
            </div>
          </div>
          {node.type === 'folder' && isExpanded && (
            <div>
              {node.children && renderFileTree(node.children, node.path, depth + 1)}
              {isAddingFile && addingInPath === node.path && (
                <div className="p-1" style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}>
                  <form onSubmit={handleCreateFormSubmit}>
                    <span>📄 </span>
                    <input
                      type="text"
                      autoFocus
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onBlur={onInputBlur}
                      className="bg-gray-900 text-white w-3/4 focus:outline-none"
                      placeholder="filename.ext"
                    />
                  </form>
                </div>
              )}
              {isAddingFolder && addingInPath === node.path && (
                <div className="p-1" style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}>
                  <form onSubmit={handleFolderCreateSubmit}>
                    <span>📁 </span>
                    <input
                      type="text"
                      autoFocus
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onBlur={onInputBlur}
                      className="bg-gray-900 text-white w-3/4 focus:outline-none"
                      placeholder="foldername"
                    />
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex flex-col h-full overflow-auto select-none">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Files</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onFileCreate('/')}
            className="bg-green-700 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-xs"
            title="New File"
          >
            + File
          </button>
          <button
            onClick={() => onFolderCreate('/')}
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs"
            title="New Folder"
          >
            + Folder
          </button>
        </div>
      </div>

      <div className="flex-grow">
        {renderFileTree(files, '/', 0)}
        {isAddingFile && addingInPath === '/' && (
          <div className="p-1">
            <form onSubmit={handleCreateFormSubmit}>
              <span>📄 </span>
              <input
                type="text"
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={onInputBlur}
                className="bg-gray-900 text-white w-3/4 focus:outline-none"
                placeholder="filename.ext"
              />
            </form>
          </div>
        )}
        {isAddingFolder && addingInPath === '/' && (
          <div className="p-1">
            <form onSubmit={handleFolderCreateSubmit}>
              <span>📁 </span>
              <input
                type="text"
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={onInputBlur}
                className="bg-gray-900 text-white w-3/4 focus:outline-none"
                placeholder="foldername"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}