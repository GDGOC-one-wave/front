import React, { useState } from 'react';
import { Header, Footer } from '../components/Layout';
import { BookOpen, TrendingUp, DollarSign, Lightbulb, Users, X, Clock, Calendar, ArrowLeft } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    category: "Trend",
    title: "2025년 스타트업 트렌드: AI와 하이퍼로컬",
    summary: "생성형 AI가 모든 산업에 스며드는 가운데, 초개인화된 로컬 서비스가 새로운 기회로 떠오르고 있습니다.",
    content: `
      2025년 스타트업 시장의 핵심은 '융합'입니다. 단순히 AI 기술을 가진 것만으로는 부족합니다. 
      이제는 AI를 얼마나 우리 일상에 밀착시키느냐가 성패를 가릅니다. 
      
      특히 '하이퍼로컬(Hyper-local)' 시장이 다시 주목받고 있습니다. 
      슬세권(슬리퍼 생활권) 내에서의 모든 경제 활동을 AI가 최적화해주는 서비스들이 투자자들의 관심을 끌고 있습니다. 
      
      핵심 키워드:
      - 버티컬 AI 솔루션
      - 로컬 커뮤니티 기반 비즈니스
      - 탄소 중립 기술의 일상화
    `,
    author: "김트렌드",
    date: "2025.05.20",
    readTime: "5 min read",
    icon: <TrendingUp className="text-blue-500" size={24}/>
  },
  {
    id: 2,
    category: "Funding",
    title: "초기 창업자를 위한 시드 투자 유치 가이드",
    summary: "엔젤 투자자부터 액셀러레이터(AC)까지, 우리 팀에 맞는 투자자를 찾고 IR 자료를 준비하는 완벽 가이드.",
    content: `
      첫 투자를 유치하는 과정은 단순히 돈을 빌리는 과정이 아닙니다. 
      우리 팀의 비전을 믿어줄 '동반자'를 찾는 과정입니다. 
      
      1. IR 피칭의 핵심: 문제 해결 능력을 보여주세요.
      2. 수치로 증명하세요: 초기 유저 지표나 시장 조사 결과가 중요합니다.
      3. 투자자 네트워킹: 링크드인이나 창업 커뮤니티를 적극 활용하세요.
      
      투자 유치 시 가장 많이 하는 실수는 '너무 높은 기업가치'를 고집하는 것입니다. 
      초기 단계에서는 적절한 밸류에이션으로 빠르게 자금을 확보해 실행력을 높이는 것이 최우선입니다.
    `,
    author: "이투자",
    date: "2025.05.18",
    readTime: "8 min read",
    icon: <DollarSign className="text-green-500" size={24}/>
  },
  {
    id: 3,
    category: "Team Building",
    title: "실패하지 않는 공동 창업자 구하기",
    summary: "지분 분배부터 역할 정의까지, 공동 창업자와의 갈등을 미리 예방하고 시너지를 내는 방법을 알아봅니다.",
    content: `
      혼자 가면 빨리 가지만, 함께 가면 멀리 갑니다. 
      스타트업 실패 원인 중 상위권을 차지하는 것이 '팀 불화'입니다. 
      
      공동 창업자를 구할 때 고려할 3가지:
      - 가치관의 일치: 돈인가 가치인가, 목표 지점이 같아야 합니다.
      - 역량의 상보성: 내가 못하는 것을 잘하는 사람을 찾으세요.
      - 헌신도: 주말을 반납할 준비가 된 열정이 필요합니다.
      
      지분 분배는 감정이 아닌 기여도와 리스크 부담을 기준으로 냉정하게 결정해야 합니다. 
      베스팅(Vesting) 조항을 넣는 것도 잊지 마세요.
    `,
    author: "박팀장",
    date: "2025.05.15",
    readTime: "6 min read",
    icon: <Users className="text-purple-500" size={24}/>
  },
  {
    id: 4,
    category: "Idea",
    title: "아이디어 검증: MVP 제작 전 해야 할 3가지",
    summary: "코드를 짜기 전에 고객을 먼저 만나라. 랜딩 페이지와 인터뷰만으로 시장 수요를 검증하는 린 스타트업 방식.",
    content: `
      가장 큰 낭비는 아무도 원하지 않는 제품을 완벽하게 만드는 것입니다. 
      
      아이디어 검증 3단계:
      1. 인터뷰: 잠재 고객 10명을 만나 불편함을 직접 들으세요.
      2. 페이크 도어(Fake Door): 간단한 소개 페이지를 만들고 버튼 클릭률을 보세요.
      3. 사전 예약: 실제 결제가 발생하거나 이메일 구독이 일어나는지 확인하세요.
      
      이 과정을 거치지 않은 개발은 도박과 같습니다. 
      AI 창업메이트의 시뮬레이터를 활용해 시장 논리를 먼저 점검하는 것도 좋은 방법입니다.
    `,
    author: "최검증",
    date: "2025.05.10",
    readTime: "4 min read",
    icon: <Lightbulb className="text-yellow-500" size={24}/>
  },
  {
    id: 5,
    category: "Guide",
    title: "예비창업패키지 합격 사업계획서 분석",
    summary: "정부지원사업 합격률을 높이는 PSST 작성법과 심사위원들이 눈여겨보는 평가 포인트를 분석했습니다.",
    author: "정멘토",
    date: "2025.05.05",
    readTime: "10 min read",
    icon: <BookOpen className="text-red-500" size={24}/>
  }
];

const Insights = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const openArticle = (article) => {
    setSelectedArticle(article);
    // eslint-disable-next-line react-hooks/immutability
    document.body.style.overflow = 'hidden'; // 스크롤 방지
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-16 px-6">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Startup Insights</h1>
            <p className="text-gray-400 font-medium">실전 창업가들의 생생한 인사이트를 만나보세요.</p>
        </div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTICLES.map(article => (
                <div 
                    key={article.id} 
                    onClick={() => openArticle(article)}
                    className="bg-white border border-gray-100 rounded-[32px] p-8 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                            {article.icon}
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-lg uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {article.category}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-8 leading-relaxed">
                        {article.summary}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                        <div className="flex items-center gap-2">
                            <span>{article.author}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{article.date}</span>
                        </div>
                        <span className="text-blue-400">{article.readTime}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* --- Article Detail Modal (Redesigned) --- */}
        {selectedArticle && (
            <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-lg z-[100] flex justify-center items-center p-4" onClick={closeArticle}>
                <div 
                    className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-fade-in flex flex-col relative" 
                    onClick={e => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="px-10 py-6 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
                            {selectedArticle.category}
                        </span>
                        <button 
                            onClick={closeArticle}
                            className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            <X size={20}/>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="flex-1 overflow-y-auto p-10 md:p-14 text-left">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-[1.3] tracking-tight">
                            {selectedArticle.title}
                        </h2>
                        
                        <div className="flex items-center gap-4 text-sm font-bold text-gray-400 mb-12 pb-8 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                {selectedArticle.author[0]}
                            </div>
                            <div>
                                <div className="text-slate-800 font-black">{selectedArticle.author}</div>
                                <div className="text-[11px] text-gray-300 uppercase tracking-wider flex gap-2">
                                    <span>{selectedArticle.date}</span>
                                    <span>•</span>
                                    <span className="text-blue-400">{selectedArticle.readTime}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="space-y-8">
                            <div className="bg-slate-50 p-8 rounded-3xl border-l-4 border-blue-600">
                                <p className="text-lg text-slate-800 font-bold leading-relaxed italic">
                                    "{selectedArticle.summary}"
                                </p>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <p className="text-base md:text-lg text-slate-600 leading-[1.8] whitespace-pre-wrap font-medium">
                                    {selectedArticle.content?.trim()}
                                </p>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="mt-16 p-8 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-100">
                            <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                                <Lightbulb size={20}/> 관련 인사이트 더보기
                            </h4>
                            <p className="text-blue-100 text-sm font-medium mb-6">
                                창업메이트 AI가 추천하는 다른 아티클도 확인해보세요.
                            </p>
                            <button onClick={closeArticle} className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all">
                                리스트로 돌아가기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Insights;