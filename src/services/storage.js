export const saveProject = (project) => {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = { ...projects[existingIndex], ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.push({ ...project, id: project.id || Date.now(), createdAt: new Date().toISOString() });
  }
  
  localStorage.setItem('myProjects', JSON.stringify(projects));
};

export const getProjects = () => {
  const data = localStorage.getItem('myProjects');
  return data ? JSON.parse(data) : [];
};

export const getProjectById = (id) => {
  const projects = getProjects();
  return projects.find(p => p.id === Number(id));
};
