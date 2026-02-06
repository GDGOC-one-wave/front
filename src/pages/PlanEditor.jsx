import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyPhase1, simulateBM, evaluatePlan, chatWithMentor } from '../services/ai';
import { 
  Loader2, ArrowRight, MessageSquare, LineChart, Send, 
  LayoutGrid, Users, Target, Zap, DollarSign,
  CheckCircle, Lock, AlertCircle, RefreshCw, PlayCircle, Bot, User
} from 'lucide-react';

const STEPS = [
  { id: 1, title: '사업 개요', icon: <LayoutGrid size={18}/> },
  { id: 2, title: '시장 및 경쟁 분석', icon: <Target size={18}/> },
  { id: 3, title: '비즈니스 모델', icon: <Zap size={18}/> },
  { id: 4, title: '마케팅 전략', icon: <Users size={18}/> },
  { id: 5, title: '재무 계획', icon: <DollarSign size={18}/> },
];

const PlanEditor = () => {
  const navigate = useNavigate();
  
  // State
  const [activeStep, setActiveStep] = useState(1);
  const [maxAllowedStep, setMaxAllowedStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'sim' (only for Step 3)
  
  // Chat State
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

  // Analysis State
  const [phase1Result, setPhase1Result] = useState(null); 
  const [showPhase1Modal, setShowPhase1Modal] = useState(false); // Controls modal visibility
  const [simulation, setSimulation] = useState(null);
  const [finalEval, setFinalEval] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // --- Navigation Logic ---
  const handleStepClick = (stepId) => {
    if (stepId <= maxAllowedStep) {
      setActiveStep(stepId);
      // If moving away from Step 3, reset tab to chat
      if (stepId !== 3) setActiveTab('chat');
    } else {
      alert("이전 단계를 완료해야 접근할 수 있습니다.");
    }
  };

  const validateCurrentStep = () => {
    const currentFields = Object.keys(formData).filter(k => k.startsWith(`${activeStep}-`));
    const isEmpty = currentFields.some(k => formData[k].trim().length < 2); // Less strict for demo
    if (isEmpty) {
      alert("항목을 조금 더 작성해주세요.");
      return false;
    }
    return true;
  };

  const handleNextStepDirect = () => {
    if (!validateCurrentStep()) return;
    const nextStep = activeStep + 1;
    setMaxAllowedStep(Math.max(maxAllowedStep, nextStep));
    setActiveStep(nextStep);
    if (nextStep !== 3) setActiveTab('chat');
  };

  // --- AI Actions ---

  // Chat
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { role: 'user', content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setLoading(true);

    try {
      const response = await chatWithMentor(activeStep, formData, chatInput);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "죄송합니다. 오류가 발생했습니다." }]);
    } finally {
      setLoading(false);
    }
  };

  // Phase 1 Verification (Triggered at end of Step 2)
  const handlePhase1Check = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    try {
      const step1Data = { '1-1': formData['1-1'], '1-2': formData['1-2'], '1-3': formData['1-3'] };
      const step2Data = { '2-1': formData['2-1'], '2-2': formData['2-2'], '2-3': formData['2-3'] };
      
      const result = await verifyPhase1(step1Data, step2Data);
      setPhase1Result(result);
      setShowPhase1Modal(true); // Show Modal

      if (result.passed) {
        setMaxAllowedStep(Math.max(maxAllowedStep, 3));
      }
    } catch (e) {
      alert("검사 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 Simulation
  const handleRunSimulation = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    setActiveTab('sim');
    try {
      const result = await simulateBM(formData);
      setSimulation(result);
      setMaxAllowedStep(Math.max(maxAllowedStep, 4));
    } catch (e) {
      alert("시뮬레이션 오류");
    } finally {
      setLoading(false);
    }
  };

  // Final Eval
  const handleFinalEval = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    try {
      const result = await evaluatePlan(formData);
      setFinalEval(result);
    } catch (e) {
      alert("평가 실패");
    } finally {
      setLoading(false);
    }
  };

  // --- Renderers ---

  const renderFields = (step) => {
       const fieldConfigs = {
          1: [
              { id: '1-1', label: '1-1. 창업 아이템의 명칭', placeholder: "예: 창업메이트" },
              { id: '1-2', label: '1-2. 아이템의 핵심 기능 및 가치', placeholder: "예: AI 기반 자동 사업계획서 생성", rows: 4 },
              { id: '1-3', label: '1-3. 타겟 고객 및 시장 페르소나', placeholder: "예: 초기 예비 창업자, 대학생 창업 동아리", rows: 4 }
          ],
          2: [
              { id: '2-1', label: '2-1. 시장 현황 및 규모', placeholder: "예: 국내 창업 교육 시장 5천억원 규모 성장 중", rows: 4 },
              { id: '2-2', label: '2-2. 경쟁사 분석', placeholder: "예: 기존 컨설팅은 비용이 비싸고 접근성이 낮음", rows: 4 },
              { id: '2-3', label: '2-3. 차별화 전략', placeholder: "예: 24시간 실시간 피드백 및 저렴한 구독료", rows: 4 }
          ],
          3: [
              { id: '3-1', label: '3-1. 수익 구조 (Revenue Model)', placeholder: "월 구독료 (SaaS)", rows: 2 },
              { id: '3-2', label: '3-2. 가격 정책', placeholder: "Basic: 무료, Pro: 월 9,900원", rows: 2 },
              { id: '3-3', label: '3-3. 핵심 파트너십', placeholder: "대학 창업지원단 제휴", rows: 2 }
          ],
          4: [
              { id: '4-1', label: '4-1. 홍보 및 마케팅 방안', placeholder: "SNS 타겟 광고 진행", rows: 4 },
              { id: '4-2', label: '4-2. 초기 고객 확보 전략', placeholder: "무료 베타 테스트 진행", rows: 4 }
          ],
          5: [
              { id: '5-1', label: '5-1. 예상 매출 추정', placeholder: "1년차: 1억원 예상", rows: 4 },
              { id: '5-2', label: '5-2. 초기 자본 조달 계획', placeholder: "청년창업사관학교 지원금 활용", rows: 4 }
          ]
      };

      return (
          <div className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-xl">{STEPS[step-1].icon}</span>
                  {STEPS[step-1].title}
              </h2>
              {fieldConfigs[step].map(field => (
                  <div key={field.id} className="space-y-2">
                      <label className="block text-sm font-bold text-slate-600">{field.label}</label>
                      <textarea 
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700 shadow-sm resize-none"
                        rows={field.rows || 2}
                        placeholder={field.placeholder}
                        value={formData[field.id]}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                  </div>
              ))}
              
              <div className="flex justify-end pt-8 border-t border-gray-100 mt-8">
                  {step === 2 ? (
                      <button 
                        onClick={handlePhase1Check}
                        disabled={loading}
                        className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                      >
                         {loading ? <Loader2 className="animate-spin"/> : <CheckCircle size={20}/>}
                         작성 완료 및 1,2단계 분석받기
                      </button>
                  ) : step === 3 ? (
                      <button 
                        onClick={handleRunSimulation}
                        disabled={loading}
                        className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg flex items-center gap-2"
                      >
                         {loading ? <Loader2 className="animate-spin"/> : <PlayCircle size={20}/>}
                         BM 시뮬레이션 실행
                      </button>
                  ) : step === 5 ? (
                      <button 
                        onClick={handleFinalEval}
                        disabled={loading}
                        className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
                      >
                         {loading ? <Loader2 className="animate-spin"/> : <CheckCircle size={20}/>}
                         최종 제출 및 평가
                      </button>
                  ) : (
                      <button 
                        onClick={handleNextStepDirect}
                        className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
                      >
                         다음 단계로 <ArrowRight size={20}/>
                      </button>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-72 border-r bg-gray-50 flex flex-col flex-shrink-0">
          <div className="p-8">
              <div onClick={() => navigate('/')} className="text-2xl font-black text-blue-600 flex items-center gap-1 cursor-pointer mb-12">
                  창업메이트<span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              </div>
              <nav className="space-y-2">
                  {STEPS.map(step => {
                      const isLocked = step.id > maxAllowedStep;
                      const isActive = activeStep === step.id;
                      return (
                          <button 
                            key={step.id}
                            onClick={() => handleStepClick(step.id)}
                            disabled={isLocked}
                            className={`w-full text-left p-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between
                                ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-gray-100'}
                                ${isLocked ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
                            `}
                          >
                              <div className="flex items-center gap-3">
                                  {step.icon}
                                  {step.title}
                              </div>
                              {isLocked && <Lock size={14} className="text-gray-400"/>}
                          </button>
                      );
                  })}
              </nav>
          </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-white border-r p-12">
              <div className="max-w-3xl mx-auto">
                 {/* Progress Indicator */}
                 <div className="mb-8 flex items-center gap-2 text-xs font-bold text-gray-400">
                    <span className={`px-2 py-1 rounded ${activeStep <= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>Phase 1: 기획</span>
                    <ArrowRight size={12}/>
                    <span className={`px-2 py-1 rounded ${activeStep === 3 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}>Phase 2: BM</span>
                    <ArrowRight size={12}/>
                    <span className={`px-2 py-1 rounded ${activeStep >= 4 ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}>Phase 3: 전략</span>
                 </div>
                 
                 {renderFields(activeStep)}
              </div>
          </div>

          {/* Right Panel: Chat & Simulation */}
          <aside className="w-[420px] flex flex-col bg-white border-l shadow-xl z-10">
              {/* Tab Header (Only for Step 3) */}
              {activeStep === 3 && (
                <div className="flex border-b">
                    <button 
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 py-4 text-xs font-black uppercase tracking-wider transition-colors ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        AI 챗봇 가이드
                    </button>
                    <button 
                        onClick={() => setActiveTab('sim')}
                        className={`flex-1 py-4 text-xs font-black uppercase tracking-wider transition-colors ${activeTab === 'sim' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        BM 시뮬레이션
                    </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto bg-slate-50 relative">
                  {activeTab === 'chat' ? (
                      <div className="h-full flex flex-col">
                          {/* Chat Messages */}
                          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                              {chatHistory.map((msg, idx) => (
                                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-800' : 'bg-blue-600'} text-white shadow-md`}>
                                              {msg.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
                                          </div>
                                          <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                              msg.role === 'user' 
                                              ? 'bg-slate-800 text-white rounded-tr-none' 
                                              : 'bg-white text-slate-700 rounded-tl-none border border-gray-100'
                                          }`}>
                                              {msg.content}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                              {loading && (
                                  <div className="flex justify-start">
                                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                                          <Loader2 size={16} className="animate-spin text-blue-600"/>
                                          <span className="text-xs text-gray-400 font-bold">답변 생성 중...</span>
                                      </div>
                                  </div>
                              )}
                              <div ref={chatEndRef} />
                          </div>

                          {/* Chat Input */}
                          <div className="p-4 bg-white border-t">
                              <div className="relative">
                                  <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={`${STEPS[activeStep-1].title}에 대해 물어보세요...`}
                                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100"
                                  />
                                  <button 
                                    onClick={handleSendMessage}
                                    disabled={loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                                  >
                                      <Send size={16}/>
                                  </button>
                              </div>
                          </div>
                      </div>
                  ) : (
                      // Simulation Tab Content (Only visible in Step 3)
                      <div className="p-6 space-y-6">
                          {simulation ? (
                              <div className="animate-fade-in space-y-4">
                                  <div className="bg-white p-6 rounded-[32px] shadow-xl border border-purple-100">
                                      <div className="flex items-center justify-between mb-6">
                                          <span className="text-xs font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase">Result</span>
                                          <span className="text-sm font-bold text-gray-400">AI Est.</span>
                                      </div>
                                      <h3 className="text-2xl font-black text-slate-800 mb-2">{simulation.status}</h3>
                                      <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                          {simulation.analysis}
                                      </p>
                                      
                                      <div className="space-y-3">
                                          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                              <span className="text-xs font-bold text-gray-400">예상 시장 규모</span>
                                              <span className="text-sm font-black text-slate-800">{simulation.metrics.marketSize}</span>
                                          </div>
                                          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                              <span className="text-xs font-bold text-gray-400">1차년도 매출</span>
                                              <span className="text-sm font-black text-blue-600">{simulation.metrics.projection}</span>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                      <div className="text-xs font-bold text-blue-400 mb-2 uppercase">Next Step</div>
                                      <p className="text-sm font-bold text-blue-800 mb-3">시뮬레이션 결과가 만족스럽다면 다음 단계로 넘어가세요.</p>
                                      <button 
                                        onClick={() => {
                                            setMaxAllowedStep(4);
                                            setActiveStep(4);
                                        }}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                                      >
                                          4단계(마케팅)로 이동
                                      </button>
                                  </div>
                              </div>
                          ) : (
                              <div className="text-center py-20 opacity-40">
                                  <LineChart size={48} className="mx-auto mb-4"/>
                                  <p className="text-xs font-black uppercase">Step 3 작성 후<br/>시뮬레이션을 실행하세요.</p>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </aside>
      </main>

       {/* Phase 1 Verification Modal */}
       {showPhase1Modal && phase1Result && (
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
               <div className="bg-white rounded-[40px] max-w-lg w-full p-10 shadow-2xl animate-fade-in relative">
                   <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-black text-slate-800">1, 2단계 중간 점검</h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-black text-white ${phase1Result.passed ? 'bg-green-500' : 'bg-orange-400'}`}>
                            {phase1Result.passed ? 'PASS (통과)' : 'RETRY (보완 필요)'}
                        </span>
                   </div>
                   
                   <div className="text-center mb-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="text-5xl font-black text-slate-900 mb-2">{phase1Result.score}점</div>
                        <p className="text-sm font-medium text-gray-500">AI 투자자 평가 점수</p>
                   </div>

                   <div className="space-y-4 mb-8">
                       <div className="space-y-2">
                           <span className="text-xs font-black text-gray-400 uppercase">피드백</span>
                           <p className="text-sm font-medium text-slate-700 bg-blue-50 p-4 rounded-2xl leading-relaxed">
                               {phase1Result.feedback}
                           </p>
                       </div>
                       
                       {!phase1Result.passed && (
                           <div className="space-y-2">
                               <span className="text-xs font-black text-gray-400 uppercase">보완 제안</span>
                               {phase1Result.suggestions.map((s, i) => (
                                   <div key={i} className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 p-3 rounded-xl">
                                       <AlertCircle size={14}/> {s}
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>

                   <div className="flex gap-3">
                       {phase1Result.passed && (
                           <button 
                             onClick={() => {
                                 setShowPhase1Modal(false);
                                 setMaxAllowedStep(3);
                                 setActiveStep(3);
                             }}
                             className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                           >
                               3단계로 넘어가기
                           </button>
                       )}
                       <button 
                         onClick={() => setShowPhase1Modal(false)}
                         className={`flex-1 py-4 rounded-xl font-bold border transition-colors ${phase1Result.passed ? 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                       >
                           {phase1Result.passed ? '더 수정하기' : '닫고 수정하기'}
                       </button>
                   </div>
               </div>
           </div>
       )}

       {/* Final Modal */}
       {finalEval && (
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
           <div className="bg-white rounded-[48px] max-w-xl w-full p-12 shadow-2xl animate-fade-in relative overflow-hidden">
               <div className="text-center mb-8">
                   <div className="inline-block p-4 bg-green-50 text-green-500 rounded-full mb-4">
                       <CheckCircle size={40}/>
                   </div>
                   <h2 className="text-3xl font-black text-slate-800">최종 평가 완료</h2>
                   <div className="text-6xl font-black text-blue-600 my-4">{finalEval.score}점</div>
               </div>
               <div className="space-y-4 mb-8">
                   <div className="p-5 bg-gray-50 rounded-2xl text-sm font-medium text-slate-600">
                       {finalEval.feedback}
                   </div>
                   <div className="p-5 bg-blue-50 rounded-2xl text-sm font-bold text-blue-700">
                       💡 멘토 조언: {finalEval.advice}
                   </div>
               </div>
               <button 
                 onClick={() => navigate('/recruitment')}
                 className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all"
               >
                   팀원 모집하러 가기
               </button>
               <button onClick={() => setFinalEval(null)} className="w-full py-3 text-gray-400 font-bold text-sm">닫기</button>
           </div>
       </div>
      )}
    </div>
  );
};

export default PlanEditor;
