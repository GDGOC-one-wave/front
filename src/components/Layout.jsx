import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black text-blue-600 flex items-center gap-1">
             창업메이트<span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-500">
            <Link to="/recruitment" className="hover:text-blue-600">파트너 찾기</Link>
            <Link to="/lounge" className="hover:text-blue-600">내 프로젝트</Link>
            <Link to="#" className="hover:text-blue-600">인사이트</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/plan')} className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors">
            새 프로젝트 등록
          </button>
          <div onClick={() => navigate('/mypage')} className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer border border-gray-100">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" />
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-gray-50 border-t py-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="text-xl font-black text-gray-800 mb-4">창업메이트<span className="text-blue-600">.</span></div>
          <p className="text-sm text-gray-400 leading-relaxed">
            꿈을 현실로 만드는 가장 세련된 방법.<br/>
            우리는 열정 있는 사람들이 만나 더 큰 가치를 만들 수 있도록 돕습니다.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Platform</h4>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>파트너 찾기</li>
            <li>프로젝트 라운지</li>
            <li>인사이트</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Support</h4>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>공지사항</li>
            <li>가이드</li>
            <li>문의하기</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Legal</h4>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>이용약관</li>
            <li>개인정보처리방침</li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <p>© 2025 StartupMate. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-gray-600 cursor-pointer">Instagram</span>
          <span className="hover:text-gray-600 cursor-pointer">Github</span>
          <span className="hover:text-gray-600 cursor-pointer">LinkedIn</span>
        </div>
      </div>
    </div>
  </footer>
);

export { Header, Footer };
