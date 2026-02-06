import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Footer } from '../components/Layout';
import { getRecruitments } from '../services/storage';
import { Search, Briefcase, X, Heart } from 'lucide-react';

const Recruitment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recruitments, setRecruitments] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedRecruit, setSelectedRecruit] = useState(null);

  useEffect(() => {
    setRecruitments(getRecruitments());
  }, [location]);

  const filteredList = recruitments.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) || 
    item.roles.some(r => r.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-16 px-6">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-slate-900 mb-4">함께 성장할 파트너를 찾으세요</h1>
            <p className="text-gray-400 font-medium">검증된 아이디어와 열정적인 팀원들이 기다리고 있습니다.</p>
        </div>

        <div className="max-w-2xl mx-auto mb-16 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                placeholder="포지션, 프로젝트명 검색..." 
                className="w-full pl-14 pr-6 py-5 rounded-full border border-gray-200 shadow-sm focus:ring-4 focus:ring-blue-100 outline-none text-slate-700 font-bold"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredList.map(item => (
                <div 
                    key={item.id} 
                    onClick={() => setSelectedRecruit(item)}
                    className="group bg-white border border-gray-100 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-2">
                            {item.tags?.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-lg uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <Heart className="text-gray-200 hover:text-red-500 transition-colors" size={20}/>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-8 leading-relaxed">
                        {item.summary}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                        {item.roles.map((role, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-gray-50 p-2 rounded-lg">
                                <Briefcase size={14} className="text-blue-500"/> {role}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                            <span className="text-xs font-bold text-slate-700">{item.author}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-300">{item.createdAt}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Modal (Same as Home) */}
        {selectedRecruit && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={() => setSelectedRecruit(null)}>
                <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 animate-fade-in relative flex flex-col" onClick={e => e.stopPropagation()}>
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

export default Recruitment;
