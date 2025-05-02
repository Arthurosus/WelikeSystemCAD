// src/components/HeaderActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderActions = ({ categoria }) => {
    const navigate = useNavigate();

    const actions = {
        pessoas: [
            { label: "Novo Cadastro", onClick: () => navigate("/cadastro-pessoas") },
            { label: "Listar Pessoas", onClick: () => {} }, // futuras ações
            { label: "Editar Cadastro de Pessoa", onClick: () => {} }, // futuras ações
        ],
        empresas: [
            { label: "Nova Empresa", onClick: () => navigate("/cadastro-empresas") },
            { label: "Listar Empresas", onClick: () => navigate("/lista-empresas")    },
            { label: "Editar Cadastro de Empresa", onClick: () => {} }, // futuras ações
        ],
        alunos: [
            { label: "Novo Aluno", onClick: () => navigate("/cadastro-aluno") },
            { label: "Listar Alunos", onClick: () => {} },
            { label: "Editar Cadastro de Aluno", onClick: () => {} }, // futuras ações
        ],
        // adicionar mais categorias conforme for expandindo
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
