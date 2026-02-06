import OpenAI from 'openai';

// eslint-disable-next-line no-undef
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const isValidKey = apiKey && apiKey.startsWith('sk-');
const openai = isValidKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;
const MOCK_DELAY = 1500;

// 1. [Phase 1 검증]
export const verifyPhase1 = async (step1Data, step2Data) => {
  if (!openai) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
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
  // eslint-disable-next-line no-useless-catch
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: `당신은 사용자의 아이디어를 비즈니스 모델로 발전시키는 '전략적 사업 코치'입니다.
사용자가 입력한 [1. 사업 개요]와 [2. 시장 분석] 내용을 분석하여, 사업의 본질을 꿰뚫고 방향성을 정립할 수 있는 '날카로운 질문'을 제공하는 것이 목적입니다.

[코칭 및 질문 가이드]
1. 고객 세그먼트 (Customer Segments)
- 핵심 사용자 1명을 구체화할 수 있는 질문 (상황, 결핍, 인지 시점)
- 얼리어답터 그룹이 누구인지 명확히 하는 질문

2. 문제 (Problem)
- 문제의 실제성을 검증하는 질문 (빈도, 강도, 해결의 가치)
- 기존 대안의 한계와 사용자의 불만을 파고드는 질문

3. 가치 제안 (Value Proposition)
- 기존 방식 대비 압도적인 차별점을 묻는 질문
- Before → After의 변화를 선명하게 만드는 질문

JSON 응답 형식:
{
  "score": 100,
  "passed": true,
  "feedback": "사용자의 기획 의도를 존중하면서, 더 깊은 고민이 필요한 지점에 대한 따뜻하지만 날카로운 코멘트",
  "suggestions": [
    "위 가이드에 근거하여, 사용자가 사업 방향을 잡는 데 도움이 되는 구체적인 질문 3-4개"
  ]
}` },
        { role: "user", content: JSON.stringify({ ...step1Data, ...step2Data }) }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("verifyPhase1 Error:", error);
    return { score: 0, passed: false, feedback: "분석 중 오류가 발생했습니다.", suggestions: [] };
  }
};

// 2. [BM 시뮬레이션]
export const simulateBM = async (allData) => {
  if (!openai) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
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
  // eslint-disable-next-line no-useless-catch
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system",
// 기존 system content 부분을 아래로 교체
          content: `당신은 노련한 'Venture Builder'이자 'Growth Strategist'입니다.
입력된 데이터(allData)를 바탕으로 비즈니스 모델의 현실성을 날카롭게 분석하고, 구체적인 수치 시뮬레이션을 수행하세요.

[분석 원칙]
1. 구체성(Specificity): "마케팅" 대신 "인스타그램 타겟 광고 및 커뮤니티 바이럴"처럼 구체적인 수단과 대상을 명시하세요.
2. 논리적 연결(Logical Link): 채널 전략이 CAC(고객 획득 비용)에 반영되고, 수익 모델이 LTV(고객 생애 가치)에 반영되어야 합니다.
3. 데이터 기반 추정: 근거 없는 숫자 대신, 유사 산업군(SaaS, 교육 플랫폼 등)의 평균 지표를 바탕으로 "가정"을 설정하세요.
4. 비판적 시각: 장점만 나열하지 말고, 비즈니스 모델 상의 치명적인 약점(Risk)을 반드시 짚어내세요.

[출력 요구사항]
- 모든 텍스트 필드는 최소 40자 이상으로 구체적이고 상세하게 작성하세요.
- 배열 필드(arrays)는 최소 5개 이상의 항목을 포함하세요.
- assumptions는 최소 6개 이상, 각 항목은 "근거 → 결론" 구조로 50자 이상 작성하세요.
- marketSize, projection은 구체적인 수치와 계산 근거를 함께 제시하세요.
- cac와 ltv는 산출 과정을 포함하여 설명하세요.

[출력 스키마 가이드]
{
  "score": number (0~100, BM 구조 완성도),
  "status": string ("초기 아이디어 단계" | "가설 정리 필요" | "검증 설계 가능" | "MVP 실험 가능"),
  "bm": {
    "customerSegments": { "coreUser": string, "earlyAdopterGroup": string },
    "problem": { "situation": string, "alternatives": string[], "mainPainPoint": string },
    "valueProposition": { "beforeAfter": string, "uvp": string },
    "solution": { "coreFeatures": string[], "mvpFeature": string },
    "channels": { "inflowChannels": string[], "initialAcquisitionStrategy": string },
    "revenueStreams": { "payer": string, "payFor": string, "priceModelType": string },
    "keyResources": { "required": string[], "internal": string[], "external": string[] },
    "keyActivities": { "activities": string[] },
    "costStructure": { "majorCosts": string[] }
  },
  "simulation": {
    "marketSize": string,
    "cac": string,
    "ltv": string,
    "projection": string,
    "assumptions": string[]
  },
  "riskFactor": string
}

[주의사항]
- 모든 응답은 JSON 단일 객체여야 합니다.
- 설명이나 인사말을 절대 포함하지 마세요.`
        },
        { role: "user", content: JSON.stringify(allData) }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("simulateBM Error:", error);
    return null;
  }
};

// 3. [AI 챗봇]
export const chatWithMentor = async (currentStep, formData, userMessage) => {
  if (!openai) return "네, 타겟 고객을 더 구체화해보세요.";
  // eslint-disable-next-line no-useless-catch
  try {
    const contextData = Object.entries(formData)
      .filter(([k]) => k.startsWith(`${currentStep}-`))
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: `당신은 소크라테스형 멘토입니다. 짧게(3문장) 조언하세요. [Context] ${contextData}` },
        { role: "user", content: userMessage }
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("chatWithMentor Error:", error);
    return "상담 서비스에 일시적인 오류가 발생했습니다.";
  }
};

// 4. [최종 평가]
export const evaluatePlan = async (fullPlan) => {
  if (!openai) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    return {
      score: 92,
      feedback: "매우 탄탄한 기획입니다. 초기 시장 진입 전략만 조금 더 다듬으면 투자 유치도 가능해 보입니다.",
      advice: "데모 데이 발표를 위해 장표를 시각화하는 단계로 넘어가세요.",
    };
  }
  // eslint-disable-next-line no-useless-catch
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: `당신은 비즈니스 모델의 완성도를 평가하는 전문 컨설턴트입니다. 
제공된 사업계획서 데이터를 다음 9가지 핵심 기준(Lean Canvas & BM Canvas 기반)에 따라 엄격하고 전문적으로 평가하세요.

[평가 기준 및 가점 포인트]
1. 고객 세그먼트: 핵심 사용자 1명과 얼리어답터 1그룹이 명확한가?
2. 문제: 문제의 실제성이 검증되었는가? 기존 대안의 불만 포인트가 명확한가?
3. 가치 제안: Before-After의 변화가 선명하며, 매력적인 UVP를 갖추었는가?
4. 해결책: 핵심 기능 3개와 MVP 기능 1개가 비대하지 않게 정의되었는가?
5. 채널: 유입 채널과 초기 100명 확보 전략이 구체적인가?
6. 수익 구조: 누가, 무엇에 대해, 어떤 방식으로 돈을 내는지 명확한가?
7. 핵심 자원: 실행을 위한 필수 자원(내/외부)이 파악되었는가?
8. 핵심 활동: 서비스 유지를 위한 반복적이고 중요한 운영 활동이 정의되었는가?
9. 비용 구조: 주요 고정비와 변동비 등 비용 요소가 누락 없이 고려되었는가?

[응답 가이드]
- 총점(score)은 100점 만점으로 산출하세요.
- feedback에는 9가지 기준 중 특히 잘된 점과 보완이 필요한 점을 종합하여 서술하세요.
- advice에는 사용자가 바로 실행에 옮길 수 있는 '다음 행동(Next Action)'을 구체적으로 제시하세요.

JSON 응답 형식:
{
  "score": number,
  "feedback": "종합적인 분석 및 평가 결과 (공백 포함 300자 내외)",
  "advice": "실행을 위한 핵심 조언"
}` },
        { role: "user", content: JSON.stringify(fullPlan) }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("evaluatePlan Error:", error);
    return { score: 0, feedback: "평가 중 오류가 발생했습니다.", advice: "" };
  }
};

// 5. [팀원 추천]
export const suggestRoles = async (fullPlan) => {
  if (!openai) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      { role: "프론트엔드 개발자", reason: "웹 서비스 구현 필수" },
      { role: "마케터", reason: "초기 유입 증대" },
      { role: "UI/UX 디자이너", reason: "사용자 경험 개선" }
    ];
  }
  // eslint-disable-next-line no-useless-catch
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
  } catch (error) {
    console.error("suggestRoles Error:", error);
    return [];
  }
};