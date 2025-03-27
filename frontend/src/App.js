import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CompanyRegistration from "./pages/CompanyRegistration";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<CompanyRegistration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
