import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
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
    </MantineProvider>
  );
}

export default App;
