import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Layout';
import { Search, SlidersHorizontal, Heart, MessageCircle } from 'lucide-react';

const CATEGORIES = ["전체", "기획자", "디자이너", "개발자", "마케터"];

const PROJECT_CARDS = [
  {
    id: 1,
    tags: ["AI TECH", "SIDE PROJECT"],
    title: "개인 맞춤형 식단 추천 AI 서비스 프론트엔드 파트너",
    desc: "단순한 식단 기록을 넘어 사용자의 건강 상태와 기호에 맞는 최적의 레시피를 제안합니다.",
    author: "미니멀리스트",
    date: "2025.05",
    members: 3,
  },
  {
    id: 2,
    tags: ["PET CARE", "CO-FOUNDER"],
    title: "반려동물 장례 서비스 '무지개너머' 공동 창업자",
    desc: "성숙한 반려동물 문화를 위해 투명하고 진정성 있는 장례 서비스를 기획하고 있습니다.",
    author: "라이언킴",
    date: "2025.05",
    members: 1,
  },
  {
    id: 3,
    tags: ["COMMUNITY", "IDEA"],
    title: "대학생 중고 교재 직거래 플랫폼 '캠퍼스북'",
    desc: "매 학기 반복되는 교재 구매 부담을 줄이기 위한 대학별 인증 기반 직거래 서비스입니다.",
    author: "캠퍼스라이프",
    date: "2025.05",
    members: 2,
  },
  {
    id: 4,
    tags: ["FINTECH", "MOBILE APP"],
    title: "Flutter 기반 개인 자산 관리 앱 파트너 모집",
    desc: "MZ세대를 위한 쉽고 재미있는 자산 관리 경험을 제공하고자 합니다.",
    author: "코딩하는곰",
    date: "2025.04",
    members: 2,
  },
  {
    id: 5,
    tags: ["O2O", "SERVICE"],
    title: "로컬 전통시장 당일 배송 플랫폼 파트너 찾기",
    desc: "전통시장의 신선한 식재료를 집앞까지 빠르게 배송하는 상생 플랫폼입니다.",
    author: "마켓히어로",
    date: "2025.04",
    members: 1,
  }
];

const Home = () => {
  const navigate = useNavigate();

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
           <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
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
                  <button key={cat} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${cat === '전체' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
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
              {PROJECT_CARDS.map(project => (
                <div key={project.id} className="group bg-white border border-gray-100 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer relative overflow-hidden">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-2">
                         {project.tags.map(tag => (
                           <span key={tag} className="px-3 py-1 bg-gray-50 text-blue-500 text-[10px] font-black rounded-md uppercase tracking-wider">
                             {tag}
                           </span>
                         ))}
                      </div>
                      <Heart className="text-gray-200 hover:text-red-500 transition-colors" size={20}/>
                   </div>
                   <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                      {project.title}
                   </h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2 font-medium">
                      {project.desc}
                   </p>
                   
                   <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author}`} alt="author" />
                         </div>
                         <div>
                            <div className="text-xs font-bold text-slate-700">{project.author}</div>
                            <div className="text-[10px] text-gray-300 font-medium">{project.date}</div>
                         </div>
                      </div>
                      <div className="text-[10px] font-bold text-blue-400 bg-blue-50 px-2 py-1 rounded">
                         현재 {project.members}명 참여 중
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
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                    생각만 하던 아이디어를<br/>최고의 팀원들과 함께 실현하세요.
                  </p>
                  <button onClick={() => navigate('/plan')} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl">
                    프로젝트 등록하기
                  </button>
              </div>
           </div>

           {/* Pagination (Dummy) */}
           <div className="flex justify-center gap-4 mt-16">
              {[1, 2, 3, '...', 12].map((n, i) => (
                <button key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${n === 1 ? 'bg-slate-900 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
                  {n}
                </button>
              ))}
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;