import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const isValidKey = apiKey && apiKey.startsWith('sk-');
const openai = isValidKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;
const MOCK_DELAY = 1500;

// 1. [Phase 1 검증]
export const verifyPhase1 = async (step1Data, step2Data) => {
  if (!openai) {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    const isDetailed = Object.values(step1Data).join('').length > 30 && Object.values(step2Data).join('').length > 30;
    return {
      score: isDetailed ? 82 : 55,
      passed: isDetailed,
      feedback: isDetailed 
        ? "사업의 정의와 타겟 시장이 논리적으로 잘 연결되어 있습니다." 
        : "설명이 다소 부족합니다. 조금 더 구체적으로 작성해주세요.",
      suggestions: isDetailed ? ["타겟 고객 세분화"] : ["경쟁사 분석 보완"]
    };
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "당신은 벤처 투자자입니다. 사업 개요와 시장 분석을 평가하세요. JSON: { score: number, passed: boolean, feedback: string, suggestions: string[] }" },
        { role: "user", content: JSON.stringify({ ...step1Data, ...step2Data }) }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) { throw error; }
};

// 2. [BM 시뮬레이션]
export const simulateBM = async (allData) => {
  if (!openai) {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return {
      score: 85,
      status: "검증 설계 가능",
      bm: {
        customerSegments: { coreUser: "수도권 20대 대학생", earlyAdopterGroup: "창업 동아리 활동 중인 학생" },
        problem: { situation: "창업 준비 중 막막함", alternatives: ["유튜브 검색", "유료 컨설팅"], mainPainPoint: "체계적인 가이드 부재" },
        valueProposition: { beforeAfter: "혼자 고민 -> AI와 함께 완성", uvp: "실시간 AI 피드백 및 시뮬레이션" },
        solution: { coreFeatures: ["AI 챗봇 멘토", "BM 시뮬레이터"], mvpFeature: "사업계획서 자동 진단" },
        channels: { inflowChannels: ["SNS 광고", "대학 커뮤니티"], initialAcquisitionStrategy: "무료 체험 이벤트" },
        revenueStreams: { payer: "예비 창업자", payFor: "프리미엄 리포트", priceModelType: "월 구독 (SaaS)" },
        keyResources: { required: ["AI 모델링 기술", "창업 데이터 DB"], internal: ["개발팀"], external: ["OpenAI API"] },
        keyActivities: { activities: ["프롬프트 엔지니어링", "UX 개선"] },
        costStructure: { majorCosts: ["API 사용료", "서버 운영비", "마케팅비"] }
      },
      simulation: {
        marketSize: "연간 500억 원 (초기 거점 시장)",
        cac: "약 8,000원",
        ltv: "약 150,000원",
        projection: "1차년도 매출 약 2억 원 예상",
        assumptions: ["유료 전환율 5% 가정", "월 이탈률 10% 미만"]
      },
      riskFactor: "유사 AI 서비스의 빠른 등장이 위협 요인임"
    };
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "BM 분석가입니다. JSON으로 응답하세요. { score, status, bm: { ...9 blocks }, simulation: { marketSize, cac, ltv, projection, assumptions }, riskFactor }" },
        { role: "user", content: JSON.stringify(allData) }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) { throw error; }
};

// 3. [AI 챗봇]
export const chatWithMentor = async (currentStep, formData, userMessage) => {
  if (!openai) return "네, 타겟 고객을 더 구체화해보세요.";
  try {
    const contextData = Object.entries(formData).filter(([k]) => k.startsWith(`${currentStep}-`)).map(([k, v]) => `${k}: ${v}`).join('\n');
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: `당신은 소크라테스형 멘토입니다. 짧게(3문장) 조언하세요. [Context] ${contextData}` },
        { role: "user", content: userMessage }
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) { throw error; }
};

// 4. [최종 평가]
export const evaluatePlan = async (fullPlan) => {
  if (!openai) {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    return {
      score: 92,
      feedback: "매우 탄탄한 기획입니다. 초기 시장 진입 전략만 조금 더 다듬으면 투자 유치도 가능해 보입니다.",
      advice: "데모 데이 발표를 위해 장표를 시각화하는 단계로 넘어가세요.",
    };
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "최종 사업계획서를 평가합니다. JSON: { score, feedback, advice }" },
        { role: "user", content: JSON.stringify(fullPlan) }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) { throw error; }
};

// 5. [팀원 추천]
export const suggestRoles = async (fullPlan) => {
  if (!openai) {
    await new Promise(r => setTimeout(r, 1000));
    return [
      { role: "프론트엔드 개발자", reason: "웹 서비스 구현 필수" },
      { role: "마케터", reason: "초기 유입 증대" },
      { role: "UI/UX 디자이너", reason: "사용자 경험 개선" }
    ];
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "팀 빌딩 전문가입니다. 필요한 직군 3개 추천. JSON: { roles: [{ role, reason }] }" },
        { role: "user", content: JSON.stringify(fullPlan) }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content).roles;
  } catch (error) { throw error; }
};
