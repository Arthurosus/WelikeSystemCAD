import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CompanyRegistration from "./pages/CompanyRegistration";
import PersonRegistration from "./pages/PersonRegistration";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<CompanyRegistration />} />
          <Route path="/cadastro-pessoas" element={<PersonRegistration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
