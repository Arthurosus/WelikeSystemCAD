// src/App.jsx
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
import PersonListing         from "./pages/PersonListing";
import RoleListing           from "./pages/RoleListing";
import RoomListing           from "./pages/RoomListing";
import StudentListing        from "./pages/StudentListing";
import EmployeeListing       from "./pages/EmployeeListing";
import LessonListing         from "./pages/LessonListing";

import CompanyEditing        from "./pages/CompanyEditing";
import PersonEditing         from "./pages/PersonEditing";
import RoleEditing           from "./pages/RoleEditing";
import RoomEditing           from "./pages/RoomEditing";
import StudentEditing        from "./pages/StudentEditing";
import EmployeeEditing       from "./pages/EmployeeEditing";
import LessonEditing         from "./pages/LessonEditing";

import WelcomePage           from "./pages/WelcomePage";

import { ROUTES } from "./routes";

export default function App() {
  return (
      <Router>
        <Routes>
          {/* landing */}
          <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
          <Route path={ROUTES.HOME} element={<WelcomePage />} />

          {/* ─── Empresas ─────────────────────────────────────────── */}
          <Route path={ROUTES.EMP_LIST} element={<CompanyListing />} />
          <Route path={ROUTES.EMP_NEW}  element={<CompanyRegistration />} />
          <Route path={ROUTES.EMP_EDIT} element={<CompanyEditing />} />

          {/* ─── Pessoas ──────────────────────────────────────────── */}
          <Route path={ROUTES.PESS_LIST} element={<PersonListing />} />
          <Route path={ROUTES.PESS_NEW}  element={<PersonRegistration />} />
          <Route path={ROUTES.PESS_EDIT} element={<PersonEditing />} />

          {/* ─── Cargos ───────────────────────────────────────────── */}
          <Route path={ROUTES.ROLE_LIST} element={<RoleListing />} />
          <Route path={ROUTES.ROLE_NEW}  element={<RoleRegistration />} />
          <Route path={ROUTES.ROLE_EDIT} element={<RoleEditing />} />

          {/* ─── Salas ────────────────────────────────────────────── */}
          <Route path={ROUTES.ROOM_LIST} element={<RoomListing />} />
          <Route path={ROUTES.ROOM_NEW}  element={<RoomRegistration />} />
          <Route path={ROUTES.ROOM_EDIT} element={<RoomEditing />} />

          {/* ─── Alunos ───────────────────────────────────────────── */}
          <Route path={ROUTES.ALUNO_LIST} element={<StudentListing />} />
          <Route path={ROUTES.ALUNO_NEW}  element={<StudentRegistration />} />
          <Route path={ROUTES.ALUNO_EDIT} element={<StudentEditing />} />

          {/* ─── Funcionários ─────────────────────────────────────── */}
          <Route path={ROUTES.FUNC_LIST} element={<EmployeeListing />} />
          <Route path={ROUTES.FUNC_NEW}  element={<EmployeeRegistration />} />
          <Route path={ROUTES.FUNC_EDIT} element={<EmployeeEditing />} />

          {/* ─── Aulas ────────────────────────────────────────────── */}
          <Route path={ROUTES.LESSON_LIST} element={<LessonListing />} />
          <Route path={ROUTES.LESSON_NEW}  element={<LessonRegistration />} />
          <Route path={ROUTES.LESSON_EDIT} element={<LessonEditing />} />
        </Routes>
      </Router>
  );
}
