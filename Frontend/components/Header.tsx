// components/Header.tsx
"use client";

interface HeaderProps {
  onRunClick: () => void;
  onSuggestClick: () => void;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  onToggleSettings: () => void;
}

export default function Header({ onRunClick, onSuggestClick, onToggleSidebar, onToggleTerminal, onToggleSettings }: HeaderProps) {
  return (
    <div className="bg-gray-800 p-2 flex items-center justify-between border-b border-gray-700">
      {}
      <div className="flex items-center space-x-4">
        <button
          onClick={onRunClick}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded text-sm"
        >
          ► Run
        </button>
        <button
          onClick={onToggleSidebar}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-4 rounded text-xs"
        >
          Toggle Sidebar
        </button>
        <button
          onClick={onToggleTerminal}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-4 rounded text-xs"
        >
          Toggle Terminal
        </button>
        <button
          onClick={onToggleSettings}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-4 rounded text-xs"
          title="Settings"
        >
          ⚙ Settings
        </button>
      </div>

      {}
      <div className="flex items-center space-x-4">
        <button
          onClick={onSuggestClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded text-sm"
        >
          🤖 AI Help
        </button>
      </div>
    </div>
  );
}
