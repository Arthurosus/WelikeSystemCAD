import React, { useState, useCallback, useMemo } from "react";
import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import StudentForm    from "../components/StudentForm";
import "../styles/companyRegistration.css";

export default function StudentRegistration() {
  const [cadastroAberto, setCadastroAberto] = useState(false);

  /* fun‑submit estável (useCallback → 1 única referência) */
  const handleCreate = useCallback((data) => {
    console.log("SALVAR (mock):", data);
    alert("Aluno cadastrado (mock)!");
  }, []);

  /* initialData jamais muda em “create”, mas memorizo só p/ demo */
  const emptyData = useMemo(() => ({}), []);

  return (
      <div className="main-layout">
        <Sidebar
            cadastroAberto={cadastroAberto}
            setCadastroAberto={setCadastroAberto}
        />

        <div className="content">
          <HeaderActions categoria="alunos" />
          <div className="header-bar" />

          <div className="registration-container">
            <StudentForm
                mode="create"
                initialData={emptyData}
                onSubmit={handleCreate}
            />
          </div>
        </div>
      </div>
  );
}
