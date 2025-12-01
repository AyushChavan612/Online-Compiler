"use client";
import React from 'react';

interface SettingsPanelProps {
  fontSize: number;
  tabSize: number;
  onFontSizeChange: (size: number) => void;
  onTabSizeChange: (size: number) => void;
  onClose: () => void;
}

export default function SettingsPanel({ fontSize, tabSize, onFontSizeChange, onTabSizeChange, onClose }: SettingsPanelProps) {
  return (
    <div className="absolute top-14 right-4 bg-gray-800 border border-gray-700 rounded shadow-lg p-4 w-64 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">Editor Settings</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white" title="Close">✖</button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1">Font Size: {fontSize}px</label>
          <input
            type="range"
            min={10}
            max={28}
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Tab Size: {tabSize}</label>
          <input
            type="range"
            min={2}
            max={8}
            value={tabSize}
            onChange={(e) => onTabSizeChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
