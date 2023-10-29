import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import StudyBoardPage from "./pages/ThinkSession/StudyBoardPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/plan" element={<AppLayout active_tab="plan" />} />
        <Route path="/study" element={<AppLayout active_tab="study" />} />
        <Route path="/review" element={<AppLayout active_tab="review" />} />
        <Route path="/thinksession/:id" element={<StudyBoardPage />} />
        <Route path="/reviewset/:id" element={<div>Review Set Page</div>} />
        <Route path="/" element={<AppLayout active_tab="plan" />} />
      </Routes>
    </div>
  );
}

export default App;
