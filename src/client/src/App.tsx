import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import StudyBoardPage from "./pages/studyboard/StudyBoardPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route path="/thinksession/:id" element={<StudyBoardPage />} />
        <Route path="/reviewset/:id" element={<div>Review Set Page</div>} />
      </Routes>
    </div>
  );
}

export default App;
