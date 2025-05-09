// src/components/HeaderActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderActions = ({ categoria }) => {
    const navigate = useNavigate();

    const actions = {
        pessoas: [
            { label: "Novo Cadastro", onClick: () => navigate("/cadastro-pessoas") },
            { label: "Listar Pessoas", onClick: () => navigate("/lista-pessoas") },
        ],
        empresas: [
            { label: "Nova Empresa", onClick: () => navigate("/cadastro-empresas") },
            { label: "Listar Empresas", onClick: () => navigate("/lista-empresas")  },

        ],
        alunos: [
            { label: "Novo Aluno", onClick: () => navigate("/cadastro-aluno") },
            { label: "Alunos Cadastrados", onClick: () => navigate("/lista-alunos") },
        ],
        cargos: [
            { label: "Novo Cargo", onClick: () => navigate("/cadastro-cargos") },
            { label: "Listar Cargos", onClick: () => navigate("/lista-cargos") },
        ],
        salas: [
            { label: "Nova Sala de Aula", onClick: () => navigate("/cadastro-salas") },
            { label: "Listar Salas", onClick: () => navigate("/lista-salas") },
        ],
        funcionarios: [
            { label: "Novo Funcionário", onClick: () => navigate("/cadastro-funcionario") },
            { label: "Funcionários Cadastrados", onClick: () => navigate("/lista-funcionarios") },
        ],
        aulas: [
            { label: "Nova Aula", onClick: () => navigate("/cadastro-aula") },
            { label: "Aulas Cadastradas", onClick: () => navigate("/lista-aulas") },
        ],
    };

    return (
        <div className="header-actions">
            {actions[categoria]?.map((action, index) => (
                <button key={index} className="btn header-btn" onClick={action.onClick}>
                    {action.label}
                </button>
            ))}
        </div>
    );
};

export default HeaderActions;
