import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route
          path="/thinksession/:id"
          element={<div>Think Session Page</div>}
        />
        <Route path="/reviewset/:id" element={<div>Review Set Page</div>} />
      </Routes>
    </div>
  );
}

export default App;
