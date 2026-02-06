import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header, Footer } from '../components/Layout';
import { getProjectById, saveRecruitment, updateProjectStatus } from '../services/storage';
import { suggestRoles } from '../services/ai';
import { Loader2, ArrowLeft, CheckCircle, Sparkles, LayoutGrid } from 'lucide-react';

const RecruitmentForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const [, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiRoles, setAiRoles] = useState([]);
  
  // 기본 고정 직군
  const BASIC_ROLES = [
    { role: "프론트엔드 개발자", reason: "웹/앱 사용자 화면 개발" },
    { role: "백엔드 개발자", reason: "서버 및 데이터베이스 구축" },
    { role: "UI/UX 디자이너", reason: "브랜드 및 화면 디자인" },
    { role: "서비스 기획자 (PM)", reason: "상세 기능 정의 및 일정 관리" },
    { role: "마케터", reason: "사용자 확보 및 브랜딩 홍보" }
  ];

  const [form, setForm] = useState({
    title: '',
    summary: '',
    selectedRoles: [],
    tags: []
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        alert("프로젝트 정보가 없습니다.");
        navigate('/lounge');
        return;
      }
      
      const p = getProjectById(projectId);
      if (!p) {
        alert("프로젝트를 찾을 수 없습니다.");
        navigate('/lounge');
        return;
      }
      
      setProject(p);
      setForm(prev => ({ 
        ...prev, 
        title: `[팀원 모집] ${p.title} 함께 하실 분!`,
        summary: `${p.formData['1-2']} (저희 서비스는...)`
      }));

      try {
        const roles = await suggestRoles(p.formData);
        setAiRoles(roles);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [projectId]);

  const toggleRole = (roleName) => {
    setForm(prev => {
      const exists = prev.selectedRoles.includes(roleName);
      return {
        ...prev,
        selectedRoles: exists 
          ? prev.selectedRoles.filter(r => r !== roleName)
          : [...prev.selectedRoles, roleName]
      };
    });
  };

  const handleSubmit = () => {
    if (form.selectedRoles.length === 0) {
      alert("최소 한 개의 모집 직군을 선택해주세요.");
      return;
    }
    
    saveRecruitment({
      projectId: Number(projectId),
      title: form.title,
      summary: form.summary,
      roles: form.selectedRoles,
      author: "나(User)",
      tags: ["PROJECT", "RECRUIT"]
    });

    // 프로젝트 상태 업데이트 (모집 중으로 변경)
    updateProjectStatus(projectId, { isRecruiting: true });
    
    alert("공고가 등록되었습니다!");
    navigate(`/plan?id=${projectId}`); // 에디터로 돌아가기
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48}/></div>;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <main className="max-w-3xl mx-auto py-16 px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-slate-800 transition-colors">
            <ArrowLeft size={20}/> 뒤로가기
        </button>
        
        <h1 className="text-3xl font-black text-slate-900 mb-2">팀원 모집 공고 등록</h1>
        <p className="text-gray-500 font-medium mb-10">기본 직군과 AI 추천 직무를 조합하여 공고를 완성하세요.</p>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-10">
            {/* 1. 기본 정보 */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">공고 제목</label>
                    <input 
                        type="text" 
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full p-4 bg-gray-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">서비스 한 줄 소개</label>
                    <textarea 
                        value={form.summary}
                        onChange={e => setForm({...form, summary: e.target.value})}
                        rows={3}
                        className="w-full p-4 bg-gray-50 rounded-xl font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                    />
                </div>
            </div>

            {/* 2. 직군 선택 */}
            <div className="space-y-8">
                {/* 기본 직군 */}
                <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100">
                    <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <LayoutGrid size={16} className="text-blue-500"/> 핵심 모집 분야 (공통)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {BASIC_ROLES.map((item, idx) => (
                            <div 
                                key={idx}
                                onClick={() => toggleRole(item.role)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                                    ${form.selectedRoles.includes(item.role) 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-white bg-white hover:border-gray-200 shadow-sm'}
                                `}
                            >
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center
                                    ${form.selectedRoles.includes(item.role) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}
                                `}>
                                    {form.selectedRoles.includes(item.role) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                                <div className="font-bold text-slate-800 text-sm">{item.role}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI 추천 직군 */}
                <div className="p-6 rounded-[24px] border-2 border-dashed border-purple-100 bg-purple-50/30">
                    <label className="block text-sm font-bold text-purple-700 mb-4 flex items-center gap-2">
                        <Sparkles size={16} className="text-purple-500"/> AI 추천 특화 직무
                    </label>
                    <div className="space-y-3">
                        {aiRoles.map((item, idx) => (
                            <div 
                                key={idx}
                                onClick={() => toggleRole(item.role)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3
                                    ${form.selectedRoles.includes(item.role) 
                                        ? 'border-purple-500 bg-white shadow-md' 
                                        : 'border-transparent bg-white/50 hover:border-purple-200 shadow-sm'}
                                `}
                            >
                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${form.selectedRoles.includes(item.role) ? 'border-purple-600 bg-purple-600' : 'border-gray-200'}
                                `}>
                                    {form.selectedRoles.includes(item.role) && <CheckCircle size={14} className="text-white"/>}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">{item.role}</div>
                                    <div className="text-xs text-purple-400 font-bold mt-1">추천 이유: {item.reason}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSubmit}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl"
            >
                공고 등록하기
            </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecruitmentForm;