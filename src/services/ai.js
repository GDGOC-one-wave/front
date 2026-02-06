import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const isValidKey = apiKey && apiKey.startsWith('sk-');
const openai = isValidKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;
const MOCK_DELAY = 1500;

// 유틸리티: 키가 없을 때 안내 메시지 출력
const logStatus = () => {
    if (!isValidKey) {
        console.log("%c[AI 서비스] API 키가 설정되지 않았거나 올바르지 않습니다. Mock 데이터를 사용합니다.", "color: orange; font-weight: bold;");
    } else {
        console.log("%c[AI 서비스] OpenAI API가 연결되었습니다. 실시간 GPT 모드로 작동합니다.", "color: green; font-weight: bold;");
    }
};
logStatus();

// 1. [Phase 1 검증] 사업 개요(Step 1) + 시장 분석(Step 2) 통합 분석
export const verifyPhase1 = async (step1Data, step2Data) => {
  if (!openai) {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    const isDetailed = Object.values(step1Data).join('').length > 30 && Object.values(step2Data).join('').length > 30;
    return {
      score: isDetailed ? 82 : 55,
      passed: isDetailed,
      feedback: isDetailed 
        ? "사업의 정의와 타겟 시장이 논리적으로 잘 연결되어 있습니다. 특히 경쟁사 분석이 구체적입니다." 
        : "핵심 기능과 타겟 시장에 대한 설명이 다소 부족합니다. 조금 더 구체적인 수치나 예시를 들어주세요.",
      suggestions: isDetailed 
        ? ["타겟 고객을 더 세분화하여 '초기 거점 시장'을 명시해보세요."] 
        : ["경쟁사의 약점을 공략할 우리만의 '한 방'을 2-3 항목에 추가하세요."]
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: "당신은 까다로운 벤처 투자자(VC)입니다. 사업 개요와 시장 분석 내용을 평가하세요. 70점 이상이어야 통과입니다. JSON 응답: { score: number, passed: boolean, feedback: string, suggestions: string[] }" 
        },
        { 
          role: "user", 
          content: `[1. 사업 개요] ${JSON.stringify(step1Data)} \n [2. 시장 분석] ${JSON.stringify(step2Data)}` 
        }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};

// 2. [BM 시뮬레이션] Step 1, 2, 3 데이터를 모두 통합하여 시뮬레이션
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
        cac: "약 8,000원 (SNS 타겟 광고)",
        ltv: "약 150,000원 (6개월 유지 가정)",
        projection: "1차년도 매출 약 2억 원 예상",
        assumptions: ["유료 전환율 5% 가정", "월 이탈률 10% 미만 유지 시"]
      },
      riskFactor: "유사 AI 서비스의 빠른 등장이 위협 요인임"
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: `당신은 비즈니스 모델 분석가이자 간단 시뮬레이터입니다.
입력된 사업 계획(allData)을 바탕으로 BM 캔버스 9요소를 “요약 분석”하고,
가정 기반의 핵심 지표(시장규모, CAC, LTV, 매출추정)를 산출하세요.

[중요]
질문, 코칭, nextActions, 완료기준 체크, 긴 설명은 절대 포함하지 마세요.
사용자가 제공하지 않은 정보는 임의로 단정하지 말고, 추정/가정으로 표시하세요.
출력은 반드시 JSON 단일 객체로만 응답하세요(마크다운/텍스트 금지).
아래 스키마의 키 이름을 정확히 지키세요.

[출력 스키마]
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

[시뮬레이션 규칙]
숫자는 ‘가정 기반 예시’로만 제시하고, assumptions에 근거 가정을 3~6개 적으세요.
allData에 수익모델/가격/전환율 정보가 없다면 보수적으로 범위를 추정하고 “가정”이라고 명시하세요.` 
        },
        { role: "user", content: JSON.stringify(allData) }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};

// 3. [AI 챗봇] 사용자의 질문에 답변 (컨텍스트 포함)
export const chatWithMentor = async (currentStep, formData, userMessage) => {
  if (!openai) {
    await new Promise(r => setTimeout(r, 1000));
    return "네, 작성 시 고려할 점을 알려드릴게요.\n- **타겟 정의**: 단순히 '누구'가 아니라 '어떤 상황에 처한 누구'인지 고민해보세요.\n- **시장 규모**: 전체 시장보다는 우리가 초기 진입 가능한 거점 시장(SAM)에 집중하는 것이 좋습니다.";
  }

  try {
    // 컨텍스트 로직 변경: 현재 단계 이전의 데이터도 포함하여 문맥 파악
    // 예: Step 2 질문 시 Step 1 데이터도 함께 전송
    const contextData = Object.entries(formData)
      .filter(([key]) => {
        const stepNum = parseInt(key.split('-')[0]);
        return stepNum <= currentStep;
      })
      .map(([key, val]) => {
         const stepNum = parseInt(key.split('-')[0]);
         const prefix = stepNum === currentStep ? "[현재 작성 중]" : "[배경 정보]";
         return `${prefix} ${key}: ${val}`;
      })
      .join('\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: `당신은 사용자가 스스로 사고할 수 있도록 돕는 '소크라테스형 창업 가이드'입니다.
          
          [원칙]
          1. **직접적인 수정 지시 금지**: "이렇게 고치세요"라고 하지 말고, "이런 점을 고려해보셨나요?" 또는 "이 부분은 어떤 근거가 있나요?"라고 질문이나 관점을 제시하세요.
          2. **고려사항 중심**: 해당 항목 작성 시 놓치기 쉬운 포인트나, 비즈니스적으로 검증해야 할 요소를 설명하세요.
          3. **가독성**: 3~4문장 이내, 불렛포인트(-) 활용.
          4. **문맥 파악**: [배경 정보]를 참고하여 [현재 작성 중]인 내용이 논리적으로 연결되는지 생각하며 조언하세요.
          5. 한국어로 답변하세요.
          
          [Context]
          ${contextData}`
        },
        { role: "user", content: userMessage }
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("AI Chat Error:", error);
    throw error;
  }
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
        { role: "system", content: "최종 사업계획서를 평가합니다. JSON 응답: { score: number, feedback: string, advice: string }" },
        { role: "user", content: JSON.stringify(fullPlan) }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};
