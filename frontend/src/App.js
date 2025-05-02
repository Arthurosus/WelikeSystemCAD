// src/App.jsx (ou App.js)
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import CompanyRegistration   from "./pages/CompanyRegistration";
import PersonRegistration    from "./pages/PersonRegistration";
import RoleRegistration      from "./pages/RoleRegistration";
import RoomRegistration      from "./pages/RoomRegistration";
import StudentRegistration   from "./pages/StudentRegistration";
import EmployeeRegistration  from "./pages/EmployeeRegistration";
import LessonRegistration    from "./pages/LessonRegistration";
import CompanyListing        from "./pages/CompanyListing";

function App() {
  return (
      <Router>
        <Routes>
          {/* fallback */}
          <Route path="/" element={<Navigate to="/cadastro-empresas" replace />} />

          {/* demais rotas */}
          <Route path="/cadastro-empresas"    element={<CompanyRegistration />} />
          <Route path="/cadastro-pessoas"     element={<PersonRegistration />} />
          <Route path="/cadastro-cargos"      element={<RoleRegistration />} />
          <Route path="/cadastro-salas"       element={<RoomRegistration />} />
          <Route path="/cadastro-aluno"       element={<StudentRegistration />} />
          <Route path="/cadastro-funcionario" element={<EmployeeRegistration />} />
          <Route path="/lista-empresas"       element={<CompanyListing />} />
          <Route path="/cadastro-aula"        element={<LessonRegistration />} />
        </Routes>
      </Router>
  );
}

export default App;
