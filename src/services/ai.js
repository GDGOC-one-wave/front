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
      score: 88,
      status: "성장 가능성 높음",
      analysis: "타겟 시장의 니즈와 수익 모델(구독)의 적합성이 높습니다.",
      metrics: {
        marketSize: "연간 3,000억 원 규모",
        cac: "15,000원",
        ltv: "120,000원",
        projection: "3.5억 원"
      },
      riskFactor: "대형 경쟁사의 진입"
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: "당신은 비즈니스 모델 시뮬레이터입니다. 입력된 전체 사업 계획을 바탕으로 가상의 성과 지표를 산출하세요. JSON 응답: { score: number, status: string, analysis: string, metrics: { marketSize: string, cac: string, ltv: string, projection: string }, riskFactor: string }" 
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
