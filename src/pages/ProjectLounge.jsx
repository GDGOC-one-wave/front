import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Layout';
import { getProjects } from '../services/storage';
import { FileText, Calendar, ArrowRight, Trash2, Plus } from 'lucide-react';

const ProjectLounge = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjects(getProjects());
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("이 프로젝트를 삭제하시겠습니까?")) {
      const updated = projects.filter(p => p.id !== id);
      localStorage.setItem('myProjects', JSON.stringify(updated));
      setProjects(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">프로젝트 라운지</h1>
                <p className="text-gray-400 font-medium font-bold">작성 완료된 사업계획서를 관리하고 수정할 수 있습니다.</p>
            </div>
            <button 
                onClick={() => navigate('/plan')}
                className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
            >
                <Plus size={20}/> 새 프로젝트 시작
            </button>
        </div>

        {projects.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-[40px] py-32 text-center">
                <FileText size={64} className="mx-auto text-gray-200 mb-6"/>
                <p className="text-gray-400 font-bold text-lg">아직 작성된 프로젝트가 없습니다.<br/>첫 번째 사업계획서를 작성해보세요!</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div 
                        key={project.id}
                        onClick={() => navigate(`/plan?id=${project.id}`)}
                        className="group bg-white border border-gray-100 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-2 items-center">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <FileText size={24}/>
                                </div>
                                {project.isRecruiting && (
                                    <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-full animate-pulse shadow-lg shadow-green-200 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span> 공고 중
                                    </span>
                                )}
                            </div>
                            <button 
                                onClick={(e) => handleDelete(project.id, e)}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18}/>
                            </button>
                        </div>
                        
                        <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                            {project.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 mb-8 uppercase tracking-widest">
                            <div className="flex items-center gap-1">
                                <Calendar size={12}/> {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-blue-500">진행률 {project.progress}%</div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <span className="text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">다시 수정하기</span>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <ArrowRight size={18}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProjectLounge;
