import { create } from 'zustand';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  setProjects: (projects) => {
    window.electron.store.set('projects', projects);
    set({ projects });
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  createProject: async (projectData) => {
    const project = {
      id: Date.now().toString(),
      ...projectData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const projects = [...get().projects, project];
    await window.electron.store.set('projects', projects);
    set({ projects, currentProject: project });
    return project;
  },

  updateProject: async (id, updates) => {
    const projects = get().projects.map(p => 
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    await window.electron.store.set('projects', projects);
    set({ projects });
  },

  deleteProject: async (id) => {
    const projects = get().projects.filter(p => p.id !== id);
    await window.electron.store.set('projects', projects);
    set({ projects, currentProject: null });
  },

  loadProjects: async () => {
    const projects = await window.electron.store.get('projects') || [];
    set({ projects });
  }
}));