import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import PlanOverviewPage from "./pages/plan/PlanOverviewPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PlanOverviewPage />} />
        <Route path="/plan" element={<PlanOverviewPage />} />
      </Routes>
    </div>
  );
}

export default App;
