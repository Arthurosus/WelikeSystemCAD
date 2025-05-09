import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import StudentForm    from "../components/StudentForm";
import "../styles/companyRegistration.css";

const USE_MOCK = true;

export default function StudentEditing() {
    const { id } = useParams();
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [aluno, setAluno]                   = useState(null);

    useEffect(() => {
        (async () => {
            if (USE_MOCK) {
                setAluno({
                    id,
                    codEmpresa: "EMP001",
                    nomeEmpresa: "Empresa Teste LTDA",
                    cargo: "Estagiário",
                    referencia: "Indicação",
                    codCurso: "CURS001",
                    dtContrato: "2025-05-20",
                    nomeCTR: "João Carlos",
                    cpfCTR: "123.456.789-01",
                    telefoneCTR: "(11) 99999‑0000",
                    emailCTR: "joao@example.com",
                    nivelamento: true,
                    emancipadoCTR: false,
                    aprovado: true,
                    taxaMatricula: "200",
                    materialDidatico: "150",
                    numeroParcelas: "6",
                    valorParcela: "300",
                    valorParcelaDesconto: "270",
                    regrasDesconto: "10 % até dia 5.",
                });
                return;
            }
            // const { data } = await axios.get(`/alunos/${id}`);
            // setAluno(data);
        })();
    }, [id]);

    /* callback estável */
    const handleUpdate = useCallback((data) => {
        console.log("UPDATE (mock):", data);
        alert("Alterações salvas (mock)!");
    }, []);

    if (!aluno) return null;      // ou spinner

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
                        mode="edit"
                        initialData={aluno}
                        onSubmit={handleUpdate}
                    />
                </div>
            </div>
        </div>
    );
}
