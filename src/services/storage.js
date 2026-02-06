// ... (기존 프로젝트 로직 유지) ...

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

export const updateProjectStatus = (id, updates) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === Number(id));
  if (index >= 0) {
    projects[index] = { ...projects[index], ...updates };
    localStorage.setItem('myProjects', JSON.stringify(projects));
    return projects[index];
  }
  return null;
};

// --- Recruitment Storage ---

// 더미 공고 데이터
const DUMMY_RECRUITMENTS = [
  {
    id: 101,
    projectId: 901,
    title: "AI 기반 여행 경로 추천 앱 '트래블AI'",
    summary: "사용자 취향을 분석하여 최적의 여행 경로를 1분 만에 짜주는 서비스입니다.",
    roles: ["프론트엔드 (React)", "UI/UX 디자이너"],
    author: "여행가",
    createdAt: "2025-05-10",
    tags: ["TRAVEL", "AI"]
  },
  {
    id: 102,
    projectId: 902,
    title: "반려식물 케어 플랫폼 '식집사'",
    summary: "식물 사진을 찍으면 상태를 진단하고 물 주기 알림을 보내주는 앱입니다.",
    roles: ["백엔드 (Node.js)", "마케터"],
    author: "초록이",
    createdAt: "2025-05-12",
    tags: ["LIFE", "APP"]
  },
  {
    id: 103,
    projectId: 903,
    title: "대학생 중고 전공책 거래 '북마켓'",
    summary: "우리 학교 학생들과 안전하게 전공책을 거래하는 직거래 플랫폼.",
    roles: ["플러터 개발자", "기획자"],
    author: "A플러스",
    createdAt: "2025-05-14",
    tags: ["COMMUNITY", "O2O"]
  }
];

export const getRecruitments = () => {
  const stored = localStorage.getItem('recruitments');
  if (!stored) {
    localStorage.setItem('recruitments', JSON.stringify(DUMMY_RECRUITMENTS));
    return DUMMY_RECRUITMENTS;
  }
  return JSON.parse(stored);
};

export const saveRecruitment = (recruit) => {
  const list = getRecruitments();
  list.unshift({ 
    ...recruit, 
    id: Date.now(), 
    createdAt: new Date().toISOString().split('T')[0] 
  });
  localStorage.setItem('recruitments', JSON.stringify(list));
};

export const removeRecruitmentByProjectId = (projectId) => {
  const list = getRecruitments();
  // 타입 안전 비교 (문자열/숫자 모두 처리)
  const updated = list.filter(r => String(r.projectId) !== String(projectId));
  localStorage.setItem('recruitments', JSON.stringify(updated));
};

export const getMyRecruitments = () => {
  const allRecruits = getRecruitments();
  const myProjectIds = getProjects().map(p => p.id);
  return allRecruits.filter(r => myProjectIds.includes(r.projectId));
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