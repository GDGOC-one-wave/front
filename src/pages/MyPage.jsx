import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Layout';
import { CheckCircle2, Users, Search, Wrench, ChevronRight, Share2 } from 'lucide-react';

const MyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">마이 페이지</h1>
                <p className="text-gray-400 font-medium">창업의 여정을 한눈에 확인하고 다음 단계를 준비하세요.</p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
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
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black">2단계 진행 중 (50%)</span>
            </div>

            <div className="flex justify-between items-start relative px-10">
                {/* Connection Lines */}
                <div className="absolute top-6 left-24 right-24 h-0.5 bg-gray-100 z-0">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: '40%' }}></div>
                </div>

                {[
                    { id: 1, title: '사업계획서 작성', status: '2025.01 완료', active: true, done: true },
                    { id: 2, title: '멤버 모집', status: '진행 중', active: true, done: false, icon: <Users size={20}/> },
                    { id: 3, title: '지원사업 공고 찾아보기', status: '대기', active: false, icon: <Search size={20}/> },
                    { id: 4, title: '모델 검증 및 유지보수', status: '개발 중', active: false, icon: <Wrench size={20}/> },
                ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 relative z-10 w-40 text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${step.done ? 'bg-blue-600 text-white' : step.active ? 'bg-white border-2 border-blue-600 text-blue-600 shadow-lg shadow-blue-100' : 'bg-gray-50 border-2 border-gray-100 text-gray-300'}`}>
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
            {/* Current Project Card */}
            <div className="lg:col-span-2">
                <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                    현재 진행 중인 작업
                </h3>
                <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <Users size={28}/>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">Step 02</span>
                                    <span className="text-[10px] text-gray-400 font-bold tracking-tight">최근 업데이트: 2025.02.14</span>
                                </div>
                                <h4 className="text-xl font-black text-slate-800">핵심 개발 멤버 및 디자이너 모집</h4>
                                <p className="text-gray-400 text-sm font-medium mt-1">현재 프론트엔드 개발자 1명, UI/UX 디자이너 1명 지원 중입니다.</p>
                            </div>
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2].map(n => (
                                <div key={n} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n + 10}`} alt="user" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">+2</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase">지원자 수</div>
                            <div className="text-2xl font-black text-slate-800">4명</div>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase">공고 조회수</div>
                            <div className="text-2xl font-black text-slate-800">1,248회</div>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase">남은 기간</div>
                            <div className="text-2xl font-black text-red-500 underline decoration-red-200 decoration-4 underline-offset-4">D-12</div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/plan')}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all group"
                    >
                        작업 페이지로 이동하기
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
                </div>

                <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full"></div>
                    <h4 className="text-lg font-black mb-4 leading-tight">맞춤 지원사업 추천</h4>
                    <p className="text-blue-100 text-xs font-medium mb-8 leading-relaxed">
                        창업님의 기술 스택에 맞는 신규 공고가 3건 올라왔어요.
                    </p>
                    <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-black text-xs hover:bg-blue-50 transition-all">
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