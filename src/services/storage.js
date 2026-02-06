// 초기 데모 데이터 (심사위원용 - 내용은 있되 AI 결과는 직접 확인)
const DEMO_PROJECT = {
  id: 20250001,
  title: "[심사위원 예시]시니어 돌봄 AI 비서 '효도메이트'",
  progress: 40,
  maxAllowedStep: 5,
  activeStep: 1,
  isRecruiting: false,
  createdAt: "2025-05-01T00:00:00.000Z",
  updatedAt: "2025-05-20T00:00:00.000Z",
  formData: {
    '1-1': "시니어 돌봄 AI 비서 '효도메이트'",
    '1-2': "독거 노인의 일상 대화를 AI가 24시간 분석하여 이상 징후(우울감, 치매 전조 등)를 감지하고, 보호자에게 실시간 리포트를 전송하는 감성 케어 솔루션입니다.",
    '1-3': "수도권에 거주하며 홀로 계신 부모님의 안부가 걱정되는 3040 직장인 자녀 (약 150만 가구 타겟)",
    '2-1': "고령화 사회 진입으로 실버 테크 시장은 매년 12% 이상 고성장 중이며, 특히 독거 노인 비중이 급증하여 비대면 돌봄 서비스 수요가 폭발적입니다.",
    '2-2': "기존의 단순 버튼형 비상 벨이나 고가의 간병인 서비스와 달리, 우리는 AI 대화 엔진을 통해 저렴한 비용으로 정서적 케어까지 제공한다는 차별점이 있습니다.",
    '2-3': "특허 출원 중인 '대화 기반 감정 분석 알고리즘'과 병원 응급실 시스템과의 다이렉트 연동 망을 확보하고 있습니다.",
    '3-1': "월 19,900원의 B2C 구독 모델 및 지자체(보건소) 대상의 B2G 대량 라이선스 판매",
    '3-2': "베이직(분석 전용), 프리미엄(긴급출동 포함), 엔터프라이즈(B2G 맞춤형)로 구성",
    '3-3': "국내 주요 통신사(AI 스피커 연동), 실버타운 운영사, 전문 의료기관",
    '4-1': "자녀 세대가 밀집한 맘카페 및 직장인 커뮤니티 타겟 광고, 노인 복지관 협력 홍보",
    '4-2': "초기 가입 고객 1,000명 대상 '부모님 건강 유전자 검사' 무료 이벤트 진행",
    '5-1': "1년 차 매출 5억 원 (구독자 2,500명 확보), 3년 내 누적 매출 50억 달성 목표",
    '5-2': "정부지원금 1억 원 및 시드 투자 3억 원 유치 계획 (현재 AC와 논의 중)"
  },
  phase1Result: null, // 직접 버튼을 눌러야 결과가 나옴
  simulation: null,   // 직접 버튼을 눌러야 결과가 나옴
  finalEval: null     // 직접 버튼을 눌러야 결과가 나옴
};

export const getProjects = () => {
  const data = localStorage.getItem('myProjects');
  let projects = data ? JSON.parse(data) : [];
  
  // 데이터가 아예 없거나, 데모 프로젝트가 없다면 삽입
  if (projects.length === 0 || !projects.some(p => p.id === 20250001)) {
    projects = [DEMO_PROJECT, ...projects];
    localStorage.setItem('myProjects', JSON.stringify(projects));
  }
  return projects;
};

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

export const getRecruitments = () => {
  const stored = localStorage.getItem('recruitments');
  const DUMMY_RECRUITMENTS = [
    {
      id: 101,
      projectId: 999999, 
      title: "글로벌 펫 테크 서비스 파트너 모집",
      summary: "반려동물 건강 데이터를 활용한 맞춤형 보험 서비스를 준비하고 있습니다.",
      roles: ["백엔드 개발자", "데이터 분석가"],
      author: "펫메이트",
      createdAt: "2025-05-15",
      tags: ["PET-TECH", "FINTECH"]
    }
  ];
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
  const updated = list.filter(r => String(r.projectId) !== String(projectId));
  localStorage.setItem('recruitments', JSON.stringify(updated));
};