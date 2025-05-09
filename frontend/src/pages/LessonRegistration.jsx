import React, { useState, useMemo, useCallback } from "react";
import axios                 from "axios";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import LessonForm     from "../components/LessonForm";

import "../styles/companyRegistration.css";

export default function LessonRegistration() {
    const [cadastroAberto, setCadastroAberto] = useState(false);

    /* objeto “vazio” estável (impede re‑renders do formulário) */
    const blankLesson = useMemo(
        () => ({
            codEmpresa: "", codigo: "", descricao: "", tipo: "",
            preRequisito: "", observacao: "", estagio: "", codTipo: "",
            ativo: true, alias: "", codEstagio: "", flgOnline: false,
        }),
        []
    );

    /* submit (mock) */
    const handleCreate = useCallback(async (data) => {
        console.log("ENVIAR (mock):", data);
        /* // integração real:
        await axios.post("http://127.0.0.1:8000/aulas/", data);
        */
        alert("Aula cadastrada (mock)!");
    }, []);

    return (
        <div className="main-layout">
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            <div className="content">
                <HeaderActions categoria="aulas" />
                <div className="header-bar" />

                <div className="registration-container">
                    <LessonForm
                        mode="create"
                        initialData={blankLesson}
                        onSubmit={handleCreate}
                    />
                </div>
            </div>
        </div>
    );
}
