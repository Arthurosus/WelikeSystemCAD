import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CompanyRegistration from "./pages/CompanyRegistration";
import PersonRegistration from "./pages/PersonRegistration";
import RoleRegistration from "./pages/RoleRegistration";
import RoomRegistration from "./pages/RoomRegistration"; // import novo
import StudentRegistration from "./pages/StudentRegistration";
import EmployeeRegistration from "./pages/EmployeeRegistration";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<CompanyRegistration />} />
          <Route path="/cadastro-pessoas" element={<PersonRegistration />} />
          <Route path="/cadastro-cargos" element={<RoleRegistration />} />
          <Route path="/cadastro-salas" element={<RoomRegistration />} />
          <Route path="/cadastro-aluno" element={<StudentRegistration />} />
          <Route path="/cadastro-funcionario" element={<EmployeeRegistration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
