import React from 'react';
import { CloudArrowDownIcon, PlayIcon } from '@heroicons/react/24/outline';
import { exportProject } from '../services/projectExporter';
import useProjectStore from '../store/projectStore';

export function Toolbar({ onRun, isCompiling, language, onTogglePreview, showPreview }) {
  const { currentProject } = useProjectStore();

  const handleExport = async () => {
    if (currentProject) {
      await exportProject(currentProject);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-t-lg border-b border-gray-700">
      <button
        onClick={onRun}
        disabled={isCompiling}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlayIcon className="h-4 w-4" />
        {isCompiling ? 'Running...' : 'Run'}
      </button>

      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md font-medium"
      >
        <CloudArrowDownIcon className="h-4 w-4" />
        Export
      </button>

      {language === 'markdown' && (
        <button
          onClick={onTogglePreview}
          className={`px-3 py-1.5 rounded-md font-medium ${
            showPreview ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      )}
    </div>
  );
}