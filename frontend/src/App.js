// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import CompanyRegistration  from "./pages/CompanyRegistration";
import PersonRegistration   from "./pages/PersonRegistration";
import RoleRegistration     from "./pages/RoleRegistration";
import RoomRegistration     from "./pages/RoomRegistration";
import StudentRegistration  from "./pages/StudentRegistration";
import StudentEditing  from "./pages/StudentEditing";
import StudentListing from "./pages/StudentListing";
import EmployeeEditing from "./pages/EmployeeEditing";
import EmployeeRegistration from "./pages/EmployeeRegistration";
import EmployeeListing from "./pages/EmployeeListing";
import LessonRegistration   from "./pages/LessonRegistration";
import CompanyListing       from "./pages/CompanyListing";
import PersonListing        from "./pages/PersonListing";
import CompanyEditing       from "./pages/CompanyEditing";
import PersonEditing from "./pages/PersonEditing";
import RoleEditing from "./pages/RoleEditing";
import RoleListing from "./pages/RoleListing";
import RoomEditing from "./pages/RoomEditing";
import RoomListing from "./pages/RoomListing";
import LessonEditing from "./pages/LessonEditing";
import LessonListing from "./pages/LessonListing";
import WelcomePage from "./pages/WelcomePage";




function App() {
  return (
      <Router>
        <Routes>
          {/* rota padrão */}
          <Route path="/"   element={<Navigate to="/welcome" replace />} />

          {/* Página Inicial */}
          <Route path="/welcome"   element={<WelcomePage />} />

          {/* cadastros */}
          <Route path="/cadastro-empresas"    element={<CompanyRegistration />} />
          <Route path="/cadastro-pessoas"     element={<PersonRegistration />} />
          <Route path="/cadastro-cargos"      element={<RoleRegistration />} />
          <Route path="/cadastro-salas"       element={<RoomRegistration />} />
          <Route path="/cadastro-aluno"       element={<StudentRegistration />} />
          <Route path="/cadastro-funcionario" element={<EmployeeRegistration />} />
          <Route path="/cadastro-aula"        element={<LessonRegistration />} />

          {/* listagens */}
          <Route path="/lista-empresas" element={<CompanyListing />} />
          <Route path="/lista-pessoas"  element={<PersonListing />} />
          <Route path="/lista-cargos" element={<RoleListing />} />
          <Route path="/lista-salas" element={<RoomListing />} />
          <Route path="/lista-alunos" element={<StudentListing />} />
          <Route path="/lista-funcionarios" element={<EmployeeListing />} />
          <Route path="/lista-aulas" element={<LessonListing />} />



          {/* >>> edição :id <<< */}
          <Route path="/editar-empresa/:id" element={<CompanyEditing />} />
          <Route path="/editar-pessoa/:id" element={<PersonEditing />} />
          <Route path="/editar-cargo/:id" element={<RoleEditing />} />
          <Route path="/editar-sala/:id" element={<RoomEditing />} />
          <Route path="/editar-aluno/:id" element={<StudentEditing />}   />
          <Route path="/editar-funcionario/:id" element={<EmployeeEditing />}   />
          <Route path="/editar-aula/:id" element={<LessonEditing />}   />

        </Routes>
      </Router>
  );
}

export default App;
