// app/page.tsx
"use client";

import { useState, FormEvent } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

import FileExplorer from '@/components/FileExplorer';
import Terminal from '@/components/Terminal';
import EditorLoader from '@/components/EditorLoader';
import Header from '@/components/Header';
import SettingsPanel from '@/components/SettingsPanel';
import Tabs from '@/components/Tabs';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  path: string;
  children?: FileNode[];
}

const SUPPORTED_EXTENSIONS = ['js', 'py', 'c', 'cpp', 'java'];

export default function Home() {
  // All your state...
  // Start with no default files; user must create them
  const [files, setFiles] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFileName, setActiveFileName] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['> Welcome to the DevFlow terminal!']);
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [addingInPath, setAddingInPath] = useState('/');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [showSettings, setShowSettings] = useState(false);

  // Helper functions
  const findFileByPath = (nodes: FileNode[], path: string): FileNode | null => {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.type === 'folder' && node.children) {
        const found = findFileByPath(node.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const addNodeToTree = (nodes: FileNode[], newNode: FileNode, parentPath: string): FileNode[] => {
    if (parentPath === '/') {
      return [...nodes, newNode];
    }
    return nodes.map(node => {
      if (node.path === parentPath && node.type === 'folder') {
        return {
          ...node,
          children: [...(node.children || []), newNode]
        };
      }
      if (node.type === 'folder' && node.children) {
        return {
          ...node,
          children: addNodeToTree(node.children, newNode, parentPath)
        };
      }
      return node;
    });
  };

  const deleteNodeFromTree = (nodes: FileNode[], pathToDelete: string): FileNode[] => {
    return nodes.filter(node => node.path !== pathToDelete).map(node => {
      if (node.type === 'folder' && node.children) {
        return {
          ...node,
          children: deleteNodeFromTree(node.children, pathToDelete)
        };
      }
      return node;
    });
  };

  const updateNodeContent = (nodes: FileNode[], path: string, newContent: string): FileNode[] => {
    return nodes.map(node => {
      if (node.path === path && node.type === 'file') {
        return { ...node, content: newContent };
      }
      if (node.type === 'folder' && node.children) {
        return {
          ...node,
          children: updateNodeContent(node.children, path, newContent)
        };
      }
      return node;
    });
  };

  // All your handlers...
  const activeFile = findFileByPath(files, activeFileName);

  const handleSelectFile = (filePath: string) => {
    const file = findFileByPath(files, filePath);
    if (file && file.type === 'file') {
      if (!openFiles.includes(filePath)) {
        setOpenFiles([...openFiles, filePath]);
      }
      setActiveFileName(filePath);
    }
  };

  const handleCloseTab = (fileNameToClose: string) => {
    const remainingTabs = openFiles.filter(file => file !== fileNameToClose);
    setOpenFiles(remainingTabs);
    if (activeFileName === fileNameToClose) {
      setActiveFileName(remainingTabs.length > 0 ? remainingTabs[0] : '');
    }
  };

  const handleEditorChange = (newContent: string | undefined) => {
    if (newContent === undefined) return;
    setFiles(updateNodeContent(files, activeFileName, newContent));
  };

  const handleCreateFile = (e: FormEvent) => {
    e.preventDefault();
    const name = newFileName.trim();
    if (name) {
      const extension = name.split('.').pop()?.toLowerCase();
      if (extension && SUPPORTED_EXTENSIONS.includes(extension)) {
        const newPath = addingInPath === '/' ? `/${name}` : `${addingInPath}/${name}`;
        const newFile: FileNode = { 
          name, 
          type: 'file',
          path: newPath,
          content: `// New file: ${name}\n` 
        };
        setFiles(addNodeToTree(files, newFile, addingInPath));
        if (!openFiles.includes(newPath)) {
          setOpenFiles([...openFiles, newPath]);
        }
        setActiveFileName(newPath);
        setNewFileName('');
        setIsAddingFile(false);
        setAddingInPath('/');
      } else {
        alert(`Error: Unsupported file extension. Please use one of: ${SUPPORTED_EXTENSIONS.join(', ')}`);
      }
    }
  };

  const handleCreateFolder = (e: FormEvent) => {
    e.preventDefault();
    const name = newFileName.trim();
    if (name) {
      const newPath = addingInPath === '/' ? `/${name}` : `${addingInPath}/${name}`;
      const newFolder: FileNode = { 
        name, 
        type: 'folder',
        path: newPath,
        children: []
      };
      setFiles(addNodeToTree(files, newFolder, addingInPath));
      setNewFileName('');
      setIsAddingFolder(false);
      setAddingInPath('/');
    }
  };

  const handleDeleteFile = (pathToDelete: string) => {
    handleCloseTab(pathToDelete);
    setFiles(deleteNodeFromTree(files, pathToDelete));
  };

  const handleRunCode = async () => {
    if (!activeFile || activeFile.type !== 'file') return;
    setTerminalOutput(prev => [...prev, `$ running ${activeFile.path}...`]);
    try {
      const response = await fetch(`${BACKEND_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activeFile.content,
          filename: activeFile.name
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setTerminalOutput(prev => [...prev, `Error: ${errorText}`, '--------------------']);
      } else {
        const result = await response.json();
        setTerminalOutput(prev => [...prev, result.output, '--------------------']);
      }
    } catch (error) {
      console.error("Failed to run code:", error);
      setTerminalOutput(prev => [...prev, `Error: Failed to connect to backend. Is it running?`, '--------------------']);
    }
  };

  const handleSuggestCode = async () => {
    alert("AI Suggestion feature not implemented yet.");
  };

  const toggleSidebar = () => setIsSidebarVisible(prev => !prev);
  const toggleTerminal = () => setIsTerminalVisible(prev => !prev);
  const toggleSettings = () => setShowSettings(prev => !prev);
  
  const handleFileCreate = (parentPath?: string) => {
    setAddingInPath(parentPath || '/');
    setIsAddingFile(true);
    setIsAddingFolder(false);
  };

  const handleFolderCreate = (parentPath?: string) => {
    setAddingInPath(parentPath || '/');
    setIsAddingFolder(true);
    setIsAddingFile(false);
  };

  const handleInputBlur = () => {
    setIsAddingFile(false);
    setIsAddingFolder(false);
    setNewFileName('');
    setAddingInPath('/');
  };
  
  const language = activeFile?.name.split('.').pop() || 'plaintext';
  return (
    <main className="flex h-screen w-screen bg-gray-900 text-white">
      <PanelGroup direction="horizontal" className="flex-1">
        {isSidebarVisible && (
          <Panel id="sidebar" defaultSize={20} minSize={15}>
            <FileExplorer
              files={files}
              activeFile={activeFileName}
              onSelectFile={handleSelectFile}
              onFileDelete={handleDeleteFile}
              onFileCreate={handleFileCreate}
              onFolderCreate={handleFolderCreate}
              isAddingFile={isAddingFile}
              isAddingFolder={isAddingFolder}
              newFileName={newFileName}
              setNewFileName={setNewFileName}
              handleCreateFormSubmit={handleCreateFile}
              handleFolderCreateSubmit={handleCreateFolder}
              onInputBlur={handleInputBlur}
              addingInPath={addingInPath}
            />
          </Panel>
        )}
        {isSidebarVisible && <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-sky-600" />}
        <Panel id="main" defaultSize={isSidebarVisible ? 80 : 100} minSize={40}>
          <PanelGroup direction="vertical">
            <Panel id="editor" defaultSize={75} minSize={30}>
              <div className="flex flex-col h-full">
                <Header 
                  onRunClick={handleRunCode} 
                  onSuggestClick={handleSuggestCode}
                  onToggleSidebar={toggleSidebar}
                  onToggleTerminal={toggleTerminal}
                  onToggleSettings={toggleSettings}
                />
                {showSettings && (
                  <SettingsPanel
                    fontSize={fontSize}
                    tabSize={tabSize}
                    onFontSizeChange={setFontSize}
                    onTabSizeChange={setTabSize}
                    onClose={() => setShowSettings(false)}
                  />
                )}
                <Tabs
                  openFiles={openFiles}
                  activeFile={activeFileName}
                  onTabClick={setActiveFileName}
                  onTabClose={handleCloseTab}
                />
                <EditorLoader
                  fileContent={activeFile?.content || ''}
                  onContentChange={handleEditorChange}
                  language={language}
                  fontSize={fontSize}
                  tabSize={tabSize}
                />
              </div>
            </Panel>
            {isTerminalVisible && (
              <>
                <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-sky-600" />
                <Panel id="terminal" defaultSize={25} minSize={10}>
                  <Terminal output={terminalOutput} />
                </Panel>
              </>
            )}
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </main>
  );
}