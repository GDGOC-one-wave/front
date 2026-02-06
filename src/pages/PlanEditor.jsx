import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPhase1, simulateBM, evaluatePlan, chatWithMentor } from '../services/ai';
import { saveProject, getProjectById } from '../services/storage';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Loader2, ArrowRight, MessageSquare, LineChart, Send, 
  LayoutGrid, Users, Target, Zap, DollarSign,
  CheckCircle, Lock, AlertCircle, RefreshCw, PlayCircle, Bot, User, FileText, PlusCircle
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

  const [phase1Result, setPhase1Result] = useState(null); 
  const [showPhase1Modal, setShowPhase1Modal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [finalEval, setFinalEval] = useState(null);

  useEffect(() => {
    if (projectId) {
      const savedProject = getProjectById(projectId);
      if (savedProject) {
        setFormData(savedProject.formData);
        setMaxAllowedStep(5);
        setPhase1Result(savedProject.phase1Result);
        setSimulation(savedProject.simulation);
        setFinalEval(savedProject.finalEval);
      }
    }
  }, [projectId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleExportPDF = async () => {
    if (!printRef.current) {
      alert("출력할 내용을 찾을 수 없습니다.");
      return;
    }
    setLoading(true);
    console.log("PDF 내보내기 시작...");
    
    try {
      const element = printRef.current;
      
      // html2canvas 옵션 최적화
      const canvas = await html2canvas(element, {
        scale: 1.5, // 2에서 1.5로 하향하여 메모리 부하 감소
        useCORS: true,
        logging: true, // 디버깅을 위해 로깅 활성화
        backgroundColor: "#ffffff",
        // 캡처 시점에만 임시로 위치 조정이 필요할 수 있음
      });

      console.log("Canvas 캡처 성공:", canvas.width, "x", canvas.height);

      const imgData = canvas.toDataURL('image/jpeg', 0.8); // PNG 대신 JPEG(품질 0.8) 사용하여 용량 최적화
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true // PDF 압축 활성화
      });

      const imgWidth = 210; 
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 페이지 분할 로직
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
      console.log("PDF 저장 완료");
      
    } catch (e) {
      console.error("상세 PDF 에러:", e);
      alert(`PDF 생성 중 오류가 발생했습니다: ${e.message}`);
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
    } catch (e) { alert("오류 발생"); } finally { setLoading(false); }
  };

  const handleFinalEval = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);
    try {
      const result = await evaluatePlan(formData);
      setFinalEval(result);
      setShowFinalModal(true);
      saveProject({
        id: projectId ? Number(projectId) : Date.now(),
        title: formData['1-1'] || '제목 없는 프로젝트',
        formData,
        phase1Result,
        simulation,
        finalEval: result,
        progress: 100
      });
    } catch (e) { alert("평가 실패"); } finally { setLoading(false); }
  };

  const renderFields = (step) => {
    const fieldConfigs = {
      1: [
        { id: '1-1', label: '1-1. 창업 아이템의 명칭', placeholder: "예: 창업메이트" },
        { id: '1-2', label: '1-2. 아이템의 핵심 기능 및 가치', placeholder: "예: AI 기반 가이드", rows: 4 },
        { id: '1-3', label: '1-3. 타겟 고객 및 시장 페르소나', placeholder: "예: 대학생 창업자", rows: 4 }
      ],
      2: [
        { id: '2-1', label: '2-1. 시장 현황 및 규모', placeholder: "내용을 입력하세요", rows: 4 },
        { id: '2-2', label: '2-2. 경쟁사 분석', placeholder: "내용을 입력하세요", rows: 4 },
        { id: '2-3', label: '2-3. 차별화 전략', placeholder: "내용을 입력하세요", rows: 4 }
      ],
      3: [
        { id: '3-1', label: '3-1. 수익 구조', placeholder: "내용을 입력하세요", rows: 2 },
        { id: '3-2', label: '3-2. 가격 정책', placeholder: "내용을 입력하세요", rows: 2 },
        { id: '3-3', label: '3-3. 핵심 파트너십', placeholder: "내용을 입력하세요", rows: 2 }
      ],
      4: [
        { id: '4-1', label: '4-1. 홍보 및 마케팅 방안', placeholder: "내용을 입력하세요", rows: 4 },
        { id: '4-2', label: '4-2. 초기 고객 확보 전략', placeholder: "내용을 입력하세요", rows: 4 }
      ],
      5: [
        { id: '5-1', label: '5-1. 예상 매출 추정', placeholder: "내용을 입력하세요", rows: 4 },
        { id: '5-2', label: '5-2. 초기 자본 조달 계획', placeholder: "내용을 입력하세요", rows: 4 }
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
              className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700 shadow-sm"
              rows={field.rows || 2}
              placeholder={field.placeholder}
              value={formData[field.id]}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        ))}
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
      {/* Hidden PDF Template */}
      <div style={{ position: 'fixed', top: '-10000px', left: '-10000px' }}>
         <div ref={printRef} style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#ffffff', padding: '20mm', color: '#000000', fontFamily: 'sans-serif' }}>
            {/* Cover Page */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250mm', borderBottom: '2px solid #0f172a', marginBottom: '10mm' }}>
                <div style={{ fontSize: '36px', fontWeight: '900', marginBottom: '6mm', color: '#0f172a' }}>{formData['1-1'] || '사업계획서'}</div>
                <div style={{ fontSize: '20px', fontWeight: '500', color: '#64748b', marginBottom: '12mm' }}>Startup Mate Project Plan</div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>Created with 창업메이트 AI</div>
                <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2mm' }}>{new Date().toLocaleDateString()}</div>
            </div>

            {/* Content Pages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {STEPS.map((s) => (
                    <div key={s.id} style={{ pageBreakInside: 'avoid' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '24px' }}>
                            {s.id}. {s.title}
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {Object.entries(formData)
                                .filter(([k]) => k.startsWith(`${s.id}-`))
                                .map(([k, v]) => (
                                <div key={k}>
                                    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>{k}</h4>
                                    <p style={{ fontSize: '16px', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                        {v || '(내용 없음)'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
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
          <div className="p-8 border-t border-gray-100">
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
                                      <div className={`p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 border border-gray-100'}`}>
                                          {msg.content}
                                      </div>
                                  </div>
                              ))}
                              <div ref={chatEndRef} />
                          </div>
                          <div className="p-4 bg-white border-t flex gap-2">
                              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 p-3 bg-gray-50 rounded-xl text-sm outline-none" placeholder="질문하세요..." />
                              <button onClick={handleSendMessage} className="p-3 bg-blue-600 text-white rounded-xl"><Send size={18}/></button>
                          </div>
                      </div>
                  ) : (
                      <div className="p-8">
                          {simulation && <div className="bg-white p-6 rounded-3xl shadow-lg border border-purple-100">
                              <h3 className="text-xl font-black mb-4">{simulation.status}</h3>
                              <p className="text-sm text-gray-500 mb-6">{simulation.analysis}</p>
                              <div className="p-4 bg-gray-50 rounded-xl text-sm">
                                  <div>매출: {simulation.metrics.projection}</div>
                              </div>
                          </div>}
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
                   <p className="p-5 bg-blue-50 rounded-2xl text-sm mb-8">{finalEval?.advice}</p>
                   <button onClick={() => setShowFinalModal(false)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">수정 계속하기</button>
               </div>
           </div>
       )}
    </div>
  );
};

export default PlanEditor;
