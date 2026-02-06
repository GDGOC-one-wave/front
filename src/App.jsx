import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlanEditor from './pages/PlanEditor';
import Recruitment from './pages/Recruitment';
import MyPage from './pages/MyPage';

import ProjectLounge from './pages/ProjectLounge';
import RecruitmentForm from './pages/RecruitmentForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<PlanEditor />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/recruitment/new" element={<RecruitmentForm />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/lounge" element={<ProjectLounge />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;