import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Layout';
import { getRecruitments } from '../services/storage';
import { Search, SlidersHorizontal, Heart, MessageCircle, Briefcase, X } from 'lucide-react';

const CATEGORIES = ["전체", "기획자", "디자이너", "개발자", "마케터"];

const Home = () => {
  const navigate = useNavigate();
  const [recruitments, setRecruitments] = useState([]);
  const [filter, setFilter] = useState('전체');
  const [selectedRecruit, setSelectedRecruit] = useState(null);

  useEffect(() => {
    setRecruitments(getRecruitments());
  }, []);

  // 필터링 로직
  const filteredList = recruitments.filter(item => {
    if (filter === '전체') return true;
    return item.roles.some(role => role.includes(filter));
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 text-center bg-white border-b border-gray-50">
           <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6">
             Connecting Visionaries
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
             당신의 아이디어를 현실로 만들<br/>
             <span className="text-blue-600">완벽한 파트너</span>를 만나보세요
           </h1>
           <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium font-bold">
             단순한 구인이 아닌, 가치를 공유하고 함께 성장할 동료를 찾는 곳.<br/>
             검증된 12,400명의 전문가들이 당신의 제안을 기다리고 있습니다.
           </p>
           <button 
             onClick={() => navigate('/plan')}
             className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
           >
             지금 시작하기
           </button>
        </section>

        {/* Filter Bar */}
        <div className="sticky top-16 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100 py-6 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
             <div className="flex gap-2">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${filter === cat ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                <button className="flex items-center gap-2 hover:text-blue-600"><SlidersHorizontal size={16}/> 상세 필터</button>
                <button className="hover:text-blue-600">인기순</button>
             </div>
          </div>
        </div>

        {/* Project Grid */}
        <section className="max-w-7xl mx-auto py-16 px-6">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredList.map(project => (
                <div 
                    key={project.id} 
                    onClick={() => setSelectedRecruit(project)}
                    className="group bg-white border border-gray-100 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer relative overflow-hidden"
                >
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-2">
                         {project.tags?.map(tag => (
                           <span key={tag} className="px-3 py-1 bg-gray-50 text-blue-500 text-[10px] font-black rounded-md uppercase tracking-wider">
                             {tag}
                           </span>
                         ))}
                      </div>
                      <Heart className="text-gray-200 hover:text-red-500 transition-colors" size={20}/>
                   </div>
                   <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                      {project.title}
                   </h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2 font-medium">
                      {project.summary}
                   </p>
                   
                   <div className="space-y-3 mb-8">
                        {project.roles.map((role, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-gray-50 p-2 rounded-lg">
                                <Briefcase size={14} className="text-blue-500"/> {role}
                            </div>
                        ))}
                    </div>

                   <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                         <div>
                            <div className="text-xs font-bold text-slate-700">{project.author}</div>
                            <div className="text-[10px] text-gray-300 font-medium">{project.createdAt}</div>
                         </div>
                      </div>
                   </div>
                </div>
              ))}

              {/* Recruitment Promo Card */}
              <div className="bg-slate-900 rounded-[32px] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group border border-slate-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full"></div>
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
                     <Search size={28}/>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">당신의 프로젝트를<br/>시작해보세요</h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium font-bold">
                    생각만 하던 아이디어를<br/>최고의 팀원들과 함께 실현하세요.
                  </p>
                  <button onClick={() => navigate('/plan')} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl">
                    프로젝트 등록하기
                  </button>
              </div>
           </div>
        </section>

        {/* Detail Modal */}
        {selectedRecruit && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={() => setSelectedRecruit(null)}>
                <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 animate-fade-in relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setSelectedRecruit(null)} className="absolute right-8 top-8 p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition-all"><X size={20}/></button>
                    <h2 className="text-3xl font-black text-slate-900 mb-6">{selectedRecruit.title}</h2>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                        <span className="font-bold text-slate-700">{selectedRecruit.author}</span>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-black text-gray-400 uppercase mb-2">프로젝트 소개</h4>
                            <p className="text-slate-600 leading-relaxed font-medium">{selectedRecruit.summary}</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-gray-400 uppercase mb-2">모집 포지션</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedRecruit.roles.map(r => (
                                    <span key={r} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">{r}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            const applied = JSON.parse(localStorage.getItem('appliedProjects') || '[]');
                            if (applied.includes(selectedRecruit.id)) {
                                alert("이미 지원했습니다.");
                            } else {
                                applied.push(selectedRecruit.id);
                                localStorage.setItem('appliedProjects', JSON.stringify(applied));
                                alert("지원되었습니다.");
                            }
                        }}
                        className="w-full mt-10 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                        <MessageCircle size={20}/> 지원하기 / 커피챗 요청
                    </button>
                </div>
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
