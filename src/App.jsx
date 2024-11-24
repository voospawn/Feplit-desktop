import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useProjectStore from './store/projectStore';
import { Editor } from './components/Editor';
import { ProjectList } from './components/ProjectList';
import { CreateProject } from './components/CreateProject';
import { Navbar } from './components/Navbar';

function App() {
  const { loadProjects } = useProjectStore();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto py-4">
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/new" element={<CreateProject />} />
            <Route path="/project/:projectId" element={<Editor />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;