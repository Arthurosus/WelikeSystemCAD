import React, { useEffect, useState, useCallback } from "react";
import { useParams }          from "react-router-dom";
import axios                  from "axios";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import LessonForm     from "../components/LessonForm";

import "../styles/companyRegistration.css";

export default function LessonEditing() {
    const { id } = useParams();          // /editar-aula/:id
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [lesson, setLesson] = useState(null);

    /* uma única carga (mock ou back‑end real) */
    useEffect(() => {
        (async () => {
            // ── MOCK ─────────────────────────────────────────────
            setLesson({
                id,
                codEmpresa:  "EMP123",
                codigo:      "AUL001",
                descricao:   "Inglês Básico",
                tipo:        "Presencial",
                preRequisito:"Nenhum",
                observacao:  "Trazer material",
                estagio:     "Inicial",
                codTipo:     "01",
                ativo:       true,
                alias:       "EN‑BASIC",
                codEstagio:  "E1",
                flgOnline:   false,
            });

            /* // integração real:
            try {
              const { data } = await axios.get(`http://127.0.0.1:8000/aulas/${id}`);
              setLesson(data);
            } catch (err) {
              console.error("Erro ao buscar aula:", err);
            }
            */
        })();
    }, [id]);

    /* salvar alterações */
    const handleUpdate = useCallback(async (data) => {
        console.log("SALVAR (mock):", data);
        /* // integração real:
        await axios.put(`http://127.0.0.1:8000/aulas/${id}`, data);
        */
        alert("Alterações salvas (mock)!");
    }, [id]);

    if (!lesson) return null;   // poderia exibir um spinner

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
                        mode="edit"
                        initialData={lesson}
                        onSubmit={handleUpdate}
                    />
                </div>
            </div>
        </div>
    );
}
