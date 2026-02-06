import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Layout';
import { getProjects } from '../services/storage';
import { CheckCircle2, Users, Search, Wrench, ChevronRight, Share2, FileBox } from 'lucide-react';

const MyPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, recruiting: 0 });

  useEffect(() => {
    const projects = getProjects();
    const recruitingCount = projects.filter(p => p.isRecruiting).length;
      // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats({
      total: projects.length,
      recruiting: recruitingCount
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">마이 페이지</h1>
                <p className="text-gray-400 font-medium font-bold">창업의 여정을 한눈에 확인하고 다음 단계를 준비하세요.</p>
            </div>
            <button 
                onClick={() => navigate('/support')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
            >
                <Search size={18}/> 지원사업 모아보기
            </button>
        </div>

        {/* Roadmap Roadmap */}
        <section className="bg-white border border-gray-100 rounded-[32px] p-10 mb-10 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
            <div className="flex items-center justify-between mb-12">
                <h3 className="flex items-center gap-2 font-black text-slate-800">
                    <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Share2 size={18}/></span>
                    창업 로드맵 진행 현황
                </h3>
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black tracking-tight">서비스 이용 활성화 중</span>
            </div>

            <div className="flex justify-between items-start relative px-10">
                {/* Connection Lines */}
                <div className="absolute top-6 left-24 right-24 h-0.5 bg-gray-100 z-0">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: '40%' }}></div>
                </div>

                {[
                    { id: 1, title: '사업계획서 작성', status: '완료 및 저장', active: true, done: true },
                    { id: 2, title: '멤버 모집', status: '공고 관리', active: true, done: false, icon: <Users size={20}/> },
                    { id: 3, title: '지원사업 찾아보기', status: '대기', active: false, icon: <Search size={20}/> },
                    { id: 4, title: '모델 검증', status: '개발 예정', active: false, icon: <Wrench size={20}/> },
                ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 relative z-10 w-40 text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${step.done ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : step.active ? 'bg-white border-2 border-blue-600 text-blue-600 shadow-lg shadow-blue-100' : 'bg-gray-50 border-2 border-gray-100 text-gray-300'}`}>
                            {step.done ? <CheckCircle2 size={24}/> : step.icon || <span className="font-black text-lg">{step.id}</span>}
                        </div>
                        <div>
                            <div className={`text-sm font-black mb-1 ${step.active ? 'text-slate-800' : 'text-gray-300'}`}>{step.title}</div>
                            <div className={`text-[10px] font-bold ${step.active ? 'text-blue-500' : 'text-gray-300'}`}>{step.status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
                <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                    현재 진행 중인 작업
                </h3>
                <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <FileBox size={28}/>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">My Workspace</span>
                                    <span className="text-[10px] text-gray-400 font-bold tracking-tight uppercase">전체 대시보드</span>
                                </div>
                                <h4 className="text-xl font-black text-slate-800">나의 프로젝트 현황 보러가기</h4>
                                <p className="text-gray-400 text-sm font-medium mt-1 font-bold">지금까지 작성한 모든 사업계획서와 파트너 모집 공고를 한눈에 관리하세요.</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50/50 p-8 rounded-[24px] border border-gray-100 flex flex-col items-center justify-center text-center">
                            <div className="text-[10px] text-gray-400 font-black mb-2 uppercase tracking-widest">작성된 프로젝트 수</div>
                            <div className="text-4xl font-black text-slate-800">{stats.total} <span className="text-sm font-bold text-gray-300">개</span></div>
                        </div>
                        <div className="bg-blue-50/30 p-8 rounded-[24px] border border-blue-100 flex flex-col items-center justify-center text-center">
                            <div className="text-[10px] text-blue-400 font-black mb-2 uppercase tracking-widest">공고 중인 프로젝트 수</div>
                            <div className="text-4xl font-black text-blue-600">{stats.recruiting} <span className="text-sm font-bold text-blue-200">개</span></div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/lounge')}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all group"
                    >
                        작업 목록으로 이동하기
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20}/>
                    </button>
                </div>
            </div>

            {/* Profile Side */}
            <div className="space-y-8">
                <div className="bg-white border border-gray-100 rounded-[32px] p-8 text-center shadow-sm">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-50 p-1 mx-auto mb-6 relative">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                        </div>
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>
                    <h4 className="text-xl font-black text-slate-800 mb-1">김창업</h4>
                    <p className="text-sm text-gray-400 font-bold mb-6">창업을 꿈꾸는 열정적인 기획자</p>
                    
                    <div className="space-y-4 pt-6 border-t border-gray-50 text-left">
                        <div>
                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 font-bold">My Main Role</div>
                            <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> 서비스 기획 및 PM
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 font-bold">Core Skills</div>
                            <div className="flex flex-wrap gap-2">
                                {["Figma", "Strategy", "Analysis"].map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-gray-50 text-slate-500 text-[10px] font-black rounded-md border border-gray-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full"></div>
                    <h4 className="text-lg font-black mb-4 leading-tight">맞춤 지원사업 추천</h4>
                    <p className="text-blue-100 text-xs font-medium mb-8 leading-relaxed font-bold">
                        창업님의 기술 스택에 맞는 신규 공고가 3건 올라왔어요.
                    </p>
                    <button 
                        onClick={() => navigate('/support')}
                        className="w-full bg-white text-blue-600 py-3 rounded-xl font-black text-xs hover:bg-blue-50 transition-all"
                    >
                        공고 확인하러 가기
                    </button>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPage;
