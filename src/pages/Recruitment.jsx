import React, { useState } from 'react';
import { Search, Briefcase, MapPin } from 'lucide-react';

// Dummy Data
const CANDIDATES = [
  { id: 1, name: "Lee Design", role: "UI/UX Designer", skills: ["Figma", "React"], location: "Seoul" },
  { id: 2, name: "Park Code", role: "Backend Developer", skills: ["Node.js", "Python"], location: "Remote" },
  { id: 3, name: "Choi Growth", role: "Marketer", skills: ["SEO", "Content"], location: "Busan" },
  { id: 4, name: "Kim Frontend", role: "Frontend Developer", skills: ["React", "Vue"], location: "Seoul" },
  { id: 5, name: "Jung Manage", role: "Project Manager", skills: ["Agile", "Jira"], location: "Seoul" },
];

const Recruitment = () => {
  const [filter, setFilter] = useState('');

  const filteredCandidates = CANDIDATES.filter(c => 
    c.role.toLowerCase().includes(filter.toLowerCase()) || 
    c.skills.some(s => s.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Teammates</h1>
            <p className="text-gray-500">Based on your business plan, here are the recommended talents.</p>
        </header>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search by role or skill..." 
                className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>

        {/* List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map(candidate => (
                <div key={candidate.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4 flex items-center justify-center text-xl font-bold text-blue-600">
                        {candidate.name[0]}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{candidate.name}</h3>
                    <div className="text-blue-600 text-sm font-medium mb-1 flex items-center">
                        <Briefcase size={14} className="mr-1" /> {candidate.role}
                    </div>
                    <div className="text-gray-400 text-xs mb-4 flex items-center">
                        <MapPin size={12} className="mr-1" /> {candidate.location}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {candidate.skills.map(skill => (
                            <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                {skill}
                            </span>
                        ))}
                    </div>
                    <button className="mt-auto w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                        View Profile
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
