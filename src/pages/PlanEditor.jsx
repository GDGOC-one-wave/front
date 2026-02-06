import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPhase1, simulateBM, evaluatePlan, chatWithMentor, getGuidedQuestions } from '../services/ai';
import { saveProject, getProjectById, updateProjectStatus, removeRecruitmentByProjectId } from '../services/storage';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Loader2, ArrowRight, MessageSquare, LineChart, Send, 
  LayoutGrid, Users, Target, Zap, DollarSign,
  CheckCircle, Lock, AlertCircle, RefreshCw, PlayCircle, Bot, User, FileText, PlusCircle, HelpCircle
} from 'lucide-react';

const STEPS = [
  { id: 1, title: '사업 개요', icon: <LayoutGrid size={18}/> },
  { id: 2, title: '시장 및 경쟁 분석', icon: <Target size={18}/> },
  { id: 3, title: '비즈니스 모델', icon: <Zap size={18}/> },
  { id: 4, title: '마케팅 전략', icon: <Users size={18}/> },
  { id: 5, title: '재무 계획', icon: <DollarSign size={18}/> },
];

const ALL_FIELD_IDS = [
  '1-1', '1-2', '1-3', 
  '2-1', '2-2', '2-3', 
  '3-1', '3-2', '3-3', 
  '4-1', '4-2', 
  '5-1', '5-2'
];

const FIELD_DATA = {
  1: [
        { id: '1-1', label: '1-1. 창업 아이템의 명칭', placeholder: "예: AI 기반 맞춤형 식단 추천 서비스 '헬시메이트'" },
        { id: '1-2', label: '1-2. 아이템의 핵심 기능 및 가치', placeholder: "예: 사용자의 혈액 검사 결과와 활동량을 분석하여, 실시간으로 최적의 점심 메뉴를 추천하고 재료 배송까지 연동하는 원스톱 헬스케어 솔루션입니다.", rows: 4 },
        { id: '1-3', label: '1-3. 타겟 고객 및 시장 페르소나', placeholder: "예: 건강 관리에 관심이 많으나 바쁜 업무로 식단 조절에 어려움을 겪는 30대 IT 직장인 (강남/판교 거주자 중심)", rows: 4 }
      ],
      2: [
        { id: '2-1', label: '2-1. 시장 현황 및 규모', placeholder: "예: 국내 디지털 헬스케어 시장은 연평균 15% 성장 중이며, 특히 구독형 식단 시장은 2025년 기준 2조 원 규모에 달할 것으로 전망됩니다.", rows: 4 },
        { id: '2-2', label: '2-2. 경쟁사 분석', placeholder: "예: 'A사'는 칼로리 기록에 치중하고 있고, 'B사'는 범용적인 식단을 제공합니다. 우리 서비스는 개인의 생체 데이터를 직접 활용한다는 점이 다릅니다.", rows: 4 },
        { id: '2-3', label: '2-3. 차별화 전략', placeholder: "예: 단순 기록을 넘어 AI가 '결정'까지 내려주는 실시간 추천 엔진과 병원 EMR 데이터 연동을 통한 독보적인 분석 정확도를 보유하고 있습니다.", rows: 4 }
      ],
      3: [
        { id: '3-1', label: '3-1. 수익 구조 (Revenue Model)', placeholder: "예: 월 19,000원의 프리미엄 구독 멤버십, 식재료 판매에 따른 15% 수수료, 제휴 피트니스 센터 광고 수익", rows: 2 },
        { id: '3-2', label: '3-2. 가격 정책', placeholder: "예: 베이직(무료 - 분석 전용), 프로(월 1.9만 - 식단 추천), 패밀리(월 4.5만 - 3인 가족 관리)", rows: 2 },
        { id: '3-3', label: '3-3. 핵심 파트너십', placeholder: "예: 건강검진센터(데이터 API), 로컬 신선식품 물류 업체(당일 배송), 유명 헬스 유튜버(브랜딩)", rows: 2 }
      ],
      4: [
        { id: '4-1', label: '4-1. 홍보 및 마케팅 방안', placeholder: "예: 직장인 타겟 오피스 밀집 지역 인스타그램 타겟 광고, 기업 사내 복지 시스템 연동을 통한 단체 유입 유도", rows: 4 },
        { id: '4-2', label: '4-2. 초기 고객 확보 전략', placeholder: "예: 초기 1,000명에게 3개월 무료 체험권 제공 및 '혈액 분석 리포트' 바이럴 공유 캠페인 진행", rows: 4 }
      ],
      5: [
        { id: '5-1', label: '5-1. 예상 매출 추정', placeholder: "예: 1년차 유료 구독자 5,000명 달성을 통한 연 매출 10억 원 목표, 영업이익률 20% 달성", rows: 4 },
        { id: '5-2', label: '5-2. 초기 자본 조달 계획', placeholder: "예: 중기부 예비창업패키지 5천만 원 확보, 시드 투자 유치 2억 원 추진 중 (엔젤 매칭 펀드 활용)", rows: 4 }
      ]
};

const PlanEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id');
  const printRef = useRef(null); 
  
  const [activeStep, setActiveStep] = useState(1);
  const [maxAllowedStep, setMaxAllowedStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: '안녕하세요! 저는 당신의 창업 멘토입니다. 무엇이든 물어보세요.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const [formData, setFormData] = useState({
    '1-1': '', '1-2': '', '1-3': '',
    '2-1': '', '2-2': '', '2-3': '',
    '3-1': '', '3-2': '', '3-3': '',
    '4-1': '', '4-2': '',
    '5-1': '', '5-2': ''
  });

  const [checkedFields, setCheckedFields] = useState({});
  const [guidedQuestions, setGuidedQuestions] = useState({}); // { fieldId: [q1, q2, q3] }
  const [autoGuidedFields, setAutoGuidedFields] = useState({}); // 자동 가이드 완료 여부
  const [fieldLoading, setFieldLoading] = useState(null);

  const [phase1Result, setPhase1Result] = useState(null); 
  const [showPhase1Modal, setShowPhase1Modal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [finalEval, setFinalEval] = useState(null);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [isRecruiting, setIsRecruiting] = useState(false);

  useEffect(() => {
    if (projectId) {
      const savedProject = getProjectById(projectId);
      if (savedProject) {
        setFormData(savedProject.formData);
        const restoredMaxStep = savedProject.finalEval ? 5 : (savedProject.maxAllowedStep || 1);
        setMaxAllowedStep(restoredMaxStep);
        setActiveStep(savedProject.activeStep || 1);
        setPhase1Result(savedProject.phase1Result);
        setSimulation(savedProject.simulation);
        setFinalEval(savedProject.finalEval);
        setIsRecruiting(savedProject.isRecruiting || false);
        setCheckedFields(savedProject.checkedFields || {});
        setGuidedQuestions(savedProject.guidedQuestions || {});
        setAutoGuidedFields(savedProject.autoGuidedFields || {});
      }
      setIsInitialLoaded(true);
    } else {
      const newId = Date.now();
      setFormData({
        '1-1': '', '1-2': '', '1-3': '',
        '2-1': '', '2-2': '', '2-3': '',
        '3-1': '', '3-2': '', '3-3': '',
        '4-1': '', '4-2': '',
        '5-1': '', '5-2': ''
      });
      setCheckedFields({});
      setGuidedQuestions({});
      setAutoGuidedFields({});
      setMaxAllowedStep(1);
      setActiveStep(1);
      setPhase1Result(null);
      setSimulation(null);
      setFinalEval(null);
      setIsInitialLoaded(true);
      navigate(`/plan?id=${newId}`, { replace: true });
    }
  }, [projectId]);

  useEffect(() => {
    if (isInitialLoaded && projectId) {
      const hasContent = Object.values(formData).some(val => val.trim().length > 0);
      if (hasContent) {
        const currentStatus = {
          id: Number(projectId),
          title: formData['1-1'] || '작성 중인 프로젝트',
          formData,
          checkedFields,
          guidedQuestions,
          autoGuidedFields,
          maxAllowedStep,
          activeStep,
          phase1Result,
          simulation,
          finalEval,
          isRecruiting,
          progress: Math.round((maxAllowedStep / 5) * 100)
        };
        saveProject(currentStatus);
      }
    }
  }, [formData, checkedFields, guidedQuestions, autoGuidedFields, maxAllowedStep, activeStep, phase1Result, simulation, finalEval, projectId, isInitialLoaded, isRecruiting]);

  // 페이지 진입 시 첫 항목 자동 가이드
  useEffect(() => {
    const triggerAutoGuide = async () => {
      const stepFields = FIELD_DATA[activeStep];
      if (!stepFields || stepFields.length === 0) return;

      const firstField = stepFields[0];
      
      // 이미 체크되었거나 이미 자동 가이드가 나갔다면 중단
      if (checkedFields[firstField.id] || autoGuidedFields[firstField.id]) return;

      setFieldLoading(firstField.id);
      try {
        const questions = await getGuidedQuestions("start", firstField.label, formData);
        
        const guideMsg = {
          role: 'assistant',
          content: `👋 [${STEPS[activeStep-1].title}] 단계를 시작합니다!\n\n` +
                   `첫 번째 항목인 [${firstField.label}] 작성을 돕기 위해 멘토가 질문을 준비했어요. 아래 내용을 참고해서 작성해보세요.\n\n` +
                   `──────────────\n\n` +
                   questions.map((q, i) => `💡 질문 ${i+1}\n"${q}"`).join('\n\n') +
                   `\n\n──────────────\n\n` +
                   `준비되셨나요? 천천히 답변을 적어주세요! 😊`
        };
        
        setChatHistory(prev => [...prev, guideMsg]);
        setAutoGuidedFields(prev => ({ ...prev, [firstField.id]: true }));
        setActiveTab('chat');
      } catch (e) {
        console.error(e);
      } finally {
        setFieldLoading(null);
      }
    };

    if (isInitialLoaded) {
      triggerAutoGuide();
    }
  }, [activeStep, isInitialLoaded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheck = async (fieldId, nextFieldLabel, isLastInStep) => {
    const isNowChecked = !checkedFields[fieldId];
    setCheckedFields(prev => ({ ...prev, [fieldId]: isNowChecked }));

    // 마지막 항목이 아니고, 체크된 상태일 때만 질문 생성
    if (isNowChecked && !isLastInStep) {
      const currentIndex = ALL_FIELD_IDS.indexOf(fieldId);
      const nextFieldId = ALL_FIELD_IDS[currentIndex + 1];

      if (nextFieldId) {
        setFieldLoading(fieldId);
        try {
          const questions = await getGuidedQuestions(fieldId, nextFieldLabel, formData);
          
          // 챗봇 창에 메시지 추가
          const guideMsg = {
            role: 'assistant',
            content: `🚀 [${fieldId} 완료] 정말 잘하셨어요!\n\n` + 
                     `이제 [${nextFieldLabel}] 단계로 넘어가 볼까요? 작성하시기 전에 이 질문들에 대해 잠시 생각해보시면 큰 도움이 될 거예요.\n\n` +
                     `──────────────\n\n` +
                     questions.map((q, i) => `💡 질문 ${i+1}\n"${q}"`).join('\n\n') +
                     `\n\n──────────────\n\n` +
                     `생각이 정리되시면 내용을 입력창에 적어주세요! ✍️`
          };
          setChatHistory(prev => [...prev, guideMsg]);
          setActiveTab('chat'); // 챗봇 탭으로 자동 전환
        } catch (e) {
          console.error(e);
        } finally {
          setFieldLoading(null);
        }
      }
    }
  };

  const handleStepClick = (stepId) => {
    if (stepId <= maxAllowedStep) {
      setActiveStep(stepId);
      if (stepId !== 3) setActiveTab('chat');
    } else {
      alert("이전 단계를 완료해야 접근할 수 있습니다.");
    }
  };

  const validateCurrentStep = () => {
    const currentFields = Object.keys(formData).filter(k => k.startsWith(`${activeStep}-`));
    const isEmpty = currentFields.some(k => formData[k].trim().length < 1);
    if (isEmpty) {
      alert("항목을 작성해주세요.");
      return false;
    }
    return true;
  };

  const handleNextStepDirect = () => {
    if (!validateCurrentStep()) return;
    const nextStep = activeStep + 1;
    setMaxAllowedStep(Math.max(maxAllowedStep, nextStep));
    setActiveStep(nextStep);
  };

  const handleRecruitToggle = () => {
    if (isRecruiting) {
      if (window.confirm("모집 공고를 내리시겠습니까? 파트너 찾기 목록에서 즉시 삭제됩니다.")) {
        // 1. 프로젝트 상태 업데이트
        updateProjectStatus(projectId, { isRecruiting: false });
        // 2. 실제 공고 리스트에서 삭제 (중요: 이 코드가 핵심입니다)
        removeRecruitmentByProjectId(projectId);
        // 3. UI 상태 업데이트
        setIsRecruiting(false);
        alert("공고가 정상적으로 삭제되었습니다.");
      }
    } else {
      navigate(`/recruitment/new?projectId=${projectId}`);
    }
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setLoading(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const fileName = formData['1-1'] ? formData['1-1'].replace(/[/\\?%*:|"<>]/g, '_') : '사업계획서';
      pdf.save(`${fileName}.pdf`);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setLoading(true);
    try {
      const response = await chatWithMentor(activeStep, formData, chatInput);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "오류가 발생했습니다." }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePhase1Check = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    try {
      const result = await verifyPhase1(
        { '1-1': formData['1-1'], '1-2': formData['1-2'], '1-3': formData['1-3'] },
        { '2-1': formData['2-1'], '2-2': formData['2-2'], '2-3': formData['2-3'] }
      );
      setPhase1Result(result);
      setShowPhase1Modal(true);
      if (result.passed) setMaxAllowedStep(Math.max(maxAllowedStep, 3));
      // eslint-disable-next-line no-unused-vars
    } catch (e) { alert("오류 발생"); } finally { setLoading(false); }
  };

  const handleRunSimulation = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    try {
      const result = await simulateBM(formData);
      setSimulation(result);
      setActiveTab('sim');
      setMaxAllowedStep(Math.max(maxAllowedStep, 4));
      // eslint-disable-next-line no-unused-vars
    } catch (e) { alert("오류 발생"); } finally { setLoading(false); }
  };

  const handleFinalEval = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    try {
      const result = await evaluatePlan(formData);
      setFinalEval(result);
      setShowFinalModal(true);
      const currentStatus = {
        id: Number(projectId),
        title: formData['1-1'] || '제목 없는 프로젝트',
        formData,
        phase1Result,
        simulation,
        finalEval: result,
        progress: 100,
        isRecruiting
      };
      saveProject(currentStatus);
      // eslint-disable-next-line no-unused-vars
    } catch (e) { alert("평가 실패"); } finally { setLoading(false); }
  };

  const renderFields = (step) => {
    const currentStepFields = FIELD_DATA[step];

    return (
      <div className="space-y-12 animate-fade-in">
        <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-xl">{STEPS[step-1].icon}</span>
          {STEPS[step-1].title}
        </h2>
        {currentStepFields.map((field, idx) => {
          const isLastInStep = idx === currentStepFields.length - 1;
          const nextField = currentStepFields[idx + 1];
          return (
            <div key={field.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-600">{field.label}</label>
                <div className="flex items-center gap-2">
                   {fieldLoading === field.id && <Loader2 size={16} className="animate-spin text-blue-600"/>}
                   <button 
                    onClick={() => handleCheck(field.id, nextField?.label || "", isLastInStep)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black transition-all ${checkedFields[field.id] ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                   >
                     {checkedFields[field.id] ? <CheckCircle size={14}/> : <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-sm"/>}
                     작성 완료
                   </button>
                </div>
              </div>

              <textarea 
                className={`w-full p-6 bg-white border-2 rounded-[24px] outline-none transition-all text-slate-700 shadow-sm ${checkedFields[field.id] ? 'border-green-100 bg-green-50/10' : 'border-slate-100 focus:border-blue-500'}`}
                rows={field.rows || 2}
                placeholder={field.placeholder}
                value={formData[field.id]}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
              />
            </div>
          );
        })}
        <div className="flex justify-end pt-8 border-t border-gray-100 mt-8">
          {step === 2 ? (
            <button onClick={handlePhase1Check} disabled={loading} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 shadow-lg">
              {loading ? <Loader2 className="animate-spin"/> : <CheckCircle size={20}/>} 작성 완료 및 1,2단계 분석받기
            </button>
          ) : step === 3 ? (
            <button onClick={handleRunSimulation} disabled={loading} className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 flex items-center gap-2 shadow-lg">
              {loading ? <Loader2 className="animate-spin"/> : <PlayCircle size={20}/>} BM 시뮬레이션 실행
            </button>
          ) : step === 5 ? (
            <button onClick={handleFinalEval} disabled={loading} className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg">
              {loading ? <Loader2 className="animate-spin"/> : <CheckCircle size={20}/>} 최종 제출 및 평가
            </button>
          ) : (
            <button onClick={handleNextStepDirect} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg">
              다음 단계로 <ArrowRight size={20}/>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-sans">
      <div style={{ position: 'fixed', top: '-10000px', left: '-10000px' }}>
         <div ref={printRef} style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#ffffff', padding: '20mm', color: '#000000', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250mm', borderBottom: '2px solid #0f172a', marginBottom: '10mm' }}>
                <div style={{ fontSize: '36px', fontWeight: '900', marginBottom: '6mm', color: '#0f172a' }}>{formData['1-1'] || '사업계획서'}</div>
                <div style={{ fontSize: '20px', fontWeight: '500', color: '#64748b', marginBottom: '12mm' }}>Startup Mate Project Plan</div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>Created with 창업메이트 AI</div>
                <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2mm' }}>{new Date().toLocaleDateString()}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {STEPS.map((s) => (
                    <div key={s.id} style={{ pageBreakInside: 'avoid' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '24px' }}>{s.id}. {s.title}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {Object.entries(formData).filter(([k]) => k.startsWith(`${s.id}-`)).map(([k, v]) => (
                                <div key={k}>
                                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>{k}</h4>
                                    <p style={{ fontSize: '16px', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{v || '(내용 없음)'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {simulation && (
                <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '2px solid #0f172a', pageBreakInside: 'avoid' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>부록: BM 시뮬레이션 결과</h2>
                    <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px' }}>{simulation.status}</div>
                        <p style={{ fontSize: '14px', color: '#ef4444', fontWeight: 'bold' }}>⚠️ Risk: {simulation.riskFactor}</p>
                    </div>
                </div>
            )}
         </div>
      </div>

      <aside className="w-72 border-r bg-gray-50 flex flex-col flex-shrink-0">
          <div className="p-8 flex-1">
              <div onClick={() => navigate('/')} className="text-2xl font-black text-blue-600 flex items-center gap-1 cursor-pointer mb-12">
                  창업메이트<span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              </div>
              <nav className="space-y-2">
                  {STEPS.map(step => (
                      <button 
                        key={step.id} 
                        onClick={() => handleStepClick(step.id)} 
                        disabled={step.id > maxAllowedStep}
                        className={`w-full text-left p-4 rounded-2xl text-sm font-bold flex items-center justify-between ${activeStep === step.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-gray-100'}`}
                      >
                          <div className="flex items-center gap-3">{step.icon} {step.title}</div>
                          {step.id > maxAllowedStep && <Lock size={14}/>}
                      </button>
                  ))}
              </nav>
          </div>
          <div className="p-6 border-t border-gray-100 space-y-4">
             {finalEval && (
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Final Score</span>
                         <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     </div>
                     <div className="text-3xl font-black text-slate-800">{finalEval.score}<span className="text-sm text-gray-300 ml-1">/100</span></div>
                     
                     {finalEval.score >= 80 ? (
                         <button 
                            onClick={handleRecruitToggle}
                            className={`w-full mt-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all
                                ${isRecruiting 
                                    ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}
                            `}
                         >
                            {isRecruiting ? '공고 내리기' : '팀원 모집 공고 올리기'}
                         </button>
                     ) : (
                         <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                             <p className="text-[9px] text-gray-400 font-bold leading-tight">80점 이상 달성 시<br/>팀원 모집이 가능합니다.</p>
                         </div>
                     )}
                 </div>
             )}
             <button onClick={handleExportPDF} disabled={!finalEval} className={`w-full p-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 ${finalEval ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-300'}`}>
                <FileText size={18}/> PDF 내보내기
             </button>
          </div>
      </aside>

      <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-white border-r p-12">
              <div className="max-w-3xl mx-auto">{renderFields(activeStep)}</div>
          </div>
          <aside className="w-[420px] flex flex-col bg-white border-l shadow-xl z-10">
              {activeStep === 3 && (
                <div className="flex border-b">
                    <button onClick={() => setActiveTab('chat')} className={`flex-1 py-4 text-xs font-black ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>AI 챗봇 가이드</button>
                    <button onClick={() => setActiveTab('sim')} className={`flex-1 py-4 text-xs font-black ${activeTab === 'sim' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400'}`}>BM 시뮬레이션</button>
                </div>
              )}
              <div className="flex-1 overflow-y-auto bg-slate-50">
                  {activeTab === 'chat' ? (
                      <div className="h-full flex flex-col">
                          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                              {chatHistory.map((msg, idx) => (
                                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-800' : 'bg-blue-600'} text-white shadow-md font-bold text-[10px]`}>
                                              {msg.role === 'user' ? 'U' : 'AI'}
                                          </div>
                                          <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-gray-100'}`}>
                                              {msg.content}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                              {loading && (
                                  <div className="flex justify-start">
                                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
                                          <div className="flex gap-1">
                                              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                                              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                              <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                          </div>
                                          <span className="text-[10px] text-gray-400 font-bold tracking-tight">AI 답변 대기 중...</span>
                                      </div>
                                  </div>
                              )}
                              <div ref={chatEndRef} />
                          </div>
                          <div className="p-4 bg-white border-t flex gap-2">
                              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 p-3 bg-gray-50 rounded-xl text-sm outline-none font-medium" placeholder={`${STEPS[activeStep-1].title}에 대해 물어보세요...`} />
                              <button onClick={handleSendMessage} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg"><Send size={18}/></button>
                          </div>
                      </div>
                  ) : (
                      <div className="p-6 space-y-6">
                          {simulation ? (
                              <div className="animate-fade-in space-y-6 pb-20">
                                  <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden">
                                      <div className="relative z-10">
                                          <div className="flex justify-between items-center mb-6">
                                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BM Analysis Report</span>
                                              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] rounded-md font-black">{simulation.status}</span>
                                          </div>
                                          <div className="text-6xl font-black mb-4">{simulation.score} <span className="text-xl font-normal text-slate-500">점</span></div>
                                          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-bold leading-relaxed break-words">
                                              ⚠️ 리스크: {simulation.riskFactor}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-1 gap-4">
                                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                          <div className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">시장 규모 (SAM)</div>
                                          <div className="text-sm font-black text-slate-800 break-words">{simulation.simulation?.marketSize || '계산 중...'}</div>
                                      </div>
                                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                          <div className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">1차년도 매출</div>
                                          <div className="text-sm font-black text-blue-600 break-words">{simulation.simulation?.projection || '계산 중...'}</div>
                                      </div>
                                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                          <div className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">CAC (획득비용)</div>
                                          <div className="text-sm font-black text-slate-800 break-words">{simulation.simulation?.cac || '계산 중...'}</div>
                                      </div>
                                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                          <div className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-tighter">LTV (생애가치)</div>
                                          <div className="text-sm font-black text-slate-800 break-words">{simulation.simulation?.ltv || '계산 중...'}</div>
                                      </div>
                                  </div>
                                  <div className="bg-white border border-gray-100 rounded-[32px] p-6 space-y-6">
                                      <h4 className="text-sm font-black text-slate-800 border-b pb-4 flex items-center gap-2">
                                          <Zap size={16} className="text-yellow-500"/> BM Canvas 요약 분석
                                      </h4>
                                      <div className="space-y-4">
                                          <div>
                                              <div className="text-[10px] font-bold text-blue-500 mb-1">핵심 가치 제안 (UVP)</div>
                                              <p className="text-xs font-bold text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{simulation.bm?.valueProposition?.uvp}</p>
                                          </div>
                                          <div className="grid grid-cols-1 gap-4 pt-2">
                                              <div>
                                                  <div className="text-[10px] font-bold text-gray-400 mb-1">고객 세그먼트</div>
                                                  <p className="text-[11px] font-medium text-slate-600 whitespace-pre-wrap break-words">{simulation.bm?.customerSegments?.coreUser}</p>
                                              </div>
                                              <div>
                                                  <div className="text-[10px] font-bold text-gray-400 mb-1">수익원</div>
                                                  <p className="text-[11px] font-medium text-slate-600 whitespace-pre-wrap break-words">{simulation.bm?.revenueStreams?.priceModelType}</p>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="bg-gray-100/50 p-6 rounded-3xl border border-gray-200/50">
                                      <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">시뮬레이션 산출 근거 (가정)</h4>
                                      <ul className="space-y-2">
                                          {Array.isArray(simulation.simulation?.assumptions) && simulation.simulation.assumptions.map((item, i) => (
                                              <li key={i} className="text-[11px] text-slate-500 font-medium flex gap-2">
                                                  <div className="w-1 h-1 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
                                                  {item}
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              </div>
                          ) : (
                              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                                  <LineChart size={64} className="mb-6"/>
                                  <p className="text-sm font-black uppercase tracking-tighter">비즈니스 모델을 분석하여<br/>성공 가능성을 수치화합니다.</p>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </aside>
      </main>

       {showPhase1Modal && (
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
               <div className="bg-white rounded-[40px] max-w-lg w-full p-10 shadow-2xl animate-fade-in">
                   <h3 className="text-2xl font-black mb-6">중간 점검: {phase1Result?.score}점</h3>
                   <p className="text-sm bg-blue-50 p-4 rounded-2xl mb-8">{phase1Result?.feedback}</p>
                   <div className="flex gap-3">
                       {phase1Result?.passed && <button onClick={() => { setShowPhase1Modal(false); setMaxAllowedStep(3); setActiveStep(3); }} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold">3단계로 가기</button>}
                       <button onClick={() => setShowPhase1Modal(false)} className="flex-1 border py-4 rounded-xl font-bold text-gray-500">닫기</button>
                   </div>
               </div>
           </div>
       )}

       {showFinalModal && (
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
               <div className="bg-white rounded-[48px] max-w-xl w-full p-12 shadow-2xl animate-fade-in text-center">
                   <h2 className="text-3xl font-black mb-4">평가 완료: {finalEval?.score}점</h2>
                 <div className="p-5 bg-blue-50 rounded-2xl text-sm font-bold text-blue-700 mb-8">
                   <div>💡 {finalEval?.advice}</div>
                   <br></br>
                   {finalEval?.score < 80 && (
                       <div className="mt-2 text-red-500">⚠️ 공고를 올리기에는 아이디어 구체성이 조금 부족합니다. <br/>내용을 보완하여 80점 이상을 노려보세요!</div>
                   )}
                 </div>

                 {finalEval?.score >= 80 ? (
                       <button onClick={() => navigate(`/recruitment/new?projectId=${projectId}`)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all">팀원 모집 공고 올리기</button>
                   ) : (
                       <button disabled className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold text-lg cursor-not-allowed">80점 미만 모집 불가</button>
                   )}
                   
                   <button onClick={() => setShowFinalModal(false)} className="w-full bg-white border border-gray-200 text-gray-500 py-4 rounded-xl font-bold mt-3 hover:bg-gray-50">수정 계속하기</button>
               </div>
           </div>
       )}
    </div>
  );
};

export default PlanEditor;