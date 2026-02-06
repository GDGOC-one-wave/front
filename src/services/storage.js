export const saveProject = (project) => {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  const projectData = {
    ...project,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    projects[existingIndex] = { ...projects[existingIndex], ...projectData };
  } else {
    projects.push({ ...projectData, createdAt: new Date().toISOString() });
  }
  
  localStorage.setItem('myProjects', JSON.stringify(projects));
  // 저장 시 임시 초안은 비웁니다 (공식 저장되었으므로)
  localStorage.removeItem('current_draft');
};

export const getProjects = () => {
  const data = localStorage.getItem('myProjects');
  return data ? JSON.parse(data) : [];
};

export const getProjectById = (id) => {
  const projects = getProjects();
  return projects.find(p => p.id === Number(id));
};

// --- 실시간 임시 저장(Draft) 기능 ---
export const saveDraft = (draftData) => {
  localStorage.setItem('current_draft', JSON.stringify({
    ...draftData,
    updatedAt: new Date().toISOString()
  }));
};

export const getDraft = () => {
  const data = localStorage.getItem('current_draft');
  return data ? JSON.parse(data) : null;
};