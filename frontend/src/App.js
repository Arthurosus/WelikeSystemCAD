import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CompanyRegistration from "./pages/CompanyRegistration";
import CompanyList from "./pages/CompanyList";  // Importa a página de listagem

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Cadastro</Link> |  
          <Link to="/empresas"> Lista de Empresas</Link>
        </nav>
        <Routes>
          <Route path="/" element={<CompanyRegistration />} />
          <Route path="/empresas" element={<CompanyList />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App;
