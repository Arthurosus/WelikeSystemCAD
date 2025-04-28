// src/components/HeaderActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderActions = ({ categoria }) => {
    const navigate = useNavigate();

    const actions = {
        pessoas: [
            { label: "Novo Cadastro", onClick: () => navigate("/cadastro-pessoas") },
            { label: "Listar Pessoas", onClick: () => {} }, // futuras ações
        ],
        empresas: [
            { label: "Nova Empresa", onClick: () => navigate("/cadastro-empresas") },
            { label: "Relatórios", onClick: () => {} },
        ],
        alunos: [
            { label: "Novo Aluno", onClick: () => navigate("/cadastro-aluno") },
            { label: "Gerenciar Matrículas", onClick: () => {} },
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
