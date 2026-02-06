import React from 'react';
import { Header, Footer } from '../components/Layout';
import { Landmark, Calendar, Award, ExternalLink, ArrowRight } from 'lucide-react';

const SUPPORT_PROGRAMS = [
  {
    id: 1,
    title: "2025년 예비창업패키지 (일반분야)",
    agency: "중소벤처기업부",
    target: "사업자 등록이 없는 예비창업자",
    benefit: "최대 1억 원 사업화 자금 (평균 5천만 원)",
    deadline: "2025.03.15 까지",
    status: "D-12",
    tags: ["자금지원", "교육", "멘토링"],
    url: "https://www.k-startup.go.kr"
  },
  {
    id: 2,
    title: "제15기 청년창업사관학교 입교생 모집",
    agency: "중소벤처기업진흥공단",
    target: "만 39세 이하, 창업 3년 이내 기업 대표",
    benefit: "사업비 70% 이내 최대 1억 원 지원 + 사무공간",
    deadline: "2025.02.28 까지",
    status: "접수중",
    tags: ["공간지원", "투자유치", "글로벌"],
    url: "https://www.kosmes.or.kr"
  },
  {
    id: 3,
    title: "생애최초 청년창업 지원사업",
    agency: "창업진흥원",
    target: "만 29세 이하 생애최초 창업자",
    benefit: "사업화 자금 최대 2천만 원 및 전담 멘토",
    deadline: "2025.04.10 까지",
    status: "모집예정",
    tags: ["청년특화", "초기자금"],
    url: "https://www.k-startup.go.kr"
  }
];

const GovSupport = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex justify-between items-end mb-16">
            <div>
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">정부지원사업 정보</h1>
                <p className="text-gray-400 font-medium">내 사업 아이템에 딱 맞는 지원사업을 놓치지 마세요.</p>
            </div>
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                <Landmark size={18}/> K-Startup 데이터 연동 중
            </div>
        </div>

        <div className="space-y-6">
            {SUPPORT_PROGRAMS.map((prog) => (
                <div key={prog.id} className="bg-white border border-gray-100 rounded-[32px] p-10 hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${prog.status === '접수중' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {prog.status}
                                </span>
                                <span className="text-xs font-bold text-gray-300 tracking-tight">{prog.agency}</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-6 group-hover:text-blue-600 transition-colors">
                                {prog.title}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-gray-400 uppercase">지원 대상</div>
                                    <p className="text-sm font-bold text-slate-600">{prog.target}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-gray-400 uppercase">지원 혜택</div>
                                    <p className="text-sm font-bold text-blue-600">{prog.benefit}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-8">
                                {prog.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg border border-gray-100">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="md:w-48 flex flex-col justify-between items-end">
                            <div className="text-right">
                                <div className="text-[10px] font-black text-gray-400 uppercase mb-1">마감일</div>
                                <div className="text-sm font-black text-slate-800 flex items-center gap-2">
                                    <Calendar size={14} className="text-gray-300"/> {prog.deadline}
                                </div>
                            </div>
                            <a 
                                href={prog.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg"
                            >
                                공고 상세보기 <ExternalLink size={14}/>
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-20 p-12 bg-blue-600 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full"></div>
            <div>
                <h3 className="text-2xl font-black mb-2 tracking-tight text-white">더 많은 지원사업을 알고 싶으신가요?</h3>
                <p className="text-blue-100 font-medium">창업메이트 AI가 당신의 기획안을 분석하여 최적의 사업을 찾아드립니다.</p>
            </div>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl whitespace-nowrap">
                AI 매칭 정기 알림 신청하기
            </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GovSupport;
