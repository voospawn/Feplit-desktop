import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import { PROJECT_TEMPLATES } from '../types/ProjectTypes';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export function CreateProject() {
  const navigate = useNavigate();
  const { createProject } = useProjectStore();
  const [selectedTemplate, setSelectedTemplate] = useState(PROJECT_TEMPLATES[0]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'private'
  });
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }
    
    setError('');
    setIsCreating(true);

    try {
      const project = await createProject({
        ...formData,
        language: selectedTemplate.language,
        files: selectedTemplate.files,
        defaultFile: selectedTemplate.defaultFile
      });
      navigate(`/project/${project.id}`);
    } catch (error) {
      setError(error.message);
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {PROJECT_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={clsx(
                  'p-4 rounded-lg border-2 text-left transition-colors',
                  selectedTemplate.id === template.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                )}
              >
                <h3 className="font-medium mb-1">{template.name}</h3>
                <p className="text-sm text-gray-400">{template.description}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows="3"
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Visibility
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isCreating}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 mr-2 text-gray-300 hover:text-white"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={clsx(
                  "px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium",
                  isCreating && "opacity-50 cursor-not-allowed"
                )}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}