import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';

export function ProjectList() {
  const { projects, loading, fetchProjects, forkProject } = useProjectStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return <div className="text-center p-4">Loading projects...</div>;
  }

  return (
    <div className="grid gap-4 p-4">
      {projects.map((project) => (
        <div key={project.id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
          <div>
            <Link 
              to={`/project/${project.id}`}
              className="text-xl font-bold text-white hover:text-blue-400"
            >
              {project.name}
            </Link>
            <p className="text-gray-400">{project.description}</p>
            <div className="flex gap-2 mt-2">
              <span className={`px-2 py-1 rounded text-sm ${
                project.visibility === 'public' ? 'bg-green-600' : 'bg-yellow-600'
              }`}>
                {project.visibility}
              </span>
              {project.forked_from && (
                <span className="text-sm text-gray-400">
                  Forked from Project #{project.forked_from}
                </span>
              )}
            </div>
          </div>
          {user && user.id !== project.owner_id && (
            <button
              onClick={() => forkProject(project.id)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Fork
            </button>
          )}
        </div>
      ))}
    </div>
  );
}