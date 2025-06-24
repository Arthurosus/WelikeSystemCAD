import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES }      from "../routes";

const HeaderActions = ({ categoria }) => {
    const navigate = useNavigate();

    const actions = {
        pessoas: [
            { label: "Novo Cadastro", onClick: () => navigate(ROUTES.PERSON_NEW) },
            { label: "Listar Pessoas", onClick: () => navigate(ROUTES.PERSON_LIST) },
        ],
        empresas: [
            { label: "Nova Empresa",   onClick: () => navigate(ROUTES.EMP_NEW)  },
            { label: "Listar Empresas",onClick: () => navigate(ROUTES.EMP_LIST) },
        ],
        alunos: [
            { label: "Novo Aluno",     onClick: () => navigate(ROUTES.STUD_NEW)  },
            { label: "Alunos Cadastrados", onClick: () => navigate(ROUTES.STUD_LIST) },
        ],
        cargos: [
            { label: "Novo Cargo",     onClick: () => navigate(ROUTES.ROLE_NEW)  },
            { label: "Listar Cargos",  onClick: () => navigate(ROUTES.ROLE_LIST) },
        ],
        salas: [
            { label: "Nova Sala de Aula", onClick: () => navigate(ROUTES.ROOM_NEW) },
            { label: "Listar Salas",      onClick: () => navigate(ROUTES.ROOM_LIST) },
        ],
        funcionarios: [
            { label: "Novo Funcionário",     onClick: () => navigate(ROUTES.EMPLOYEE_NEW) },
            { label: "Funcionários Cadastrados", onClick: () => navigate(ROUTES.EMPLOYEE_LIST) },
        ],
        aulas: [
            { label: "Nova Aula",       onClick: () => navigate(ROUTES.LESSON_NEW)  },
            { label: "Aulas Cadastradas",onClick: () => navigate(ROUTES.LESSON_LIST) },
        ],
    };

    return (
        <div className="header-actions">
            {actions[categoria]?.map((a, idx) => (
                <button key={idx} className="btn header-btn" onClick={a.onClick}>
                    {a.label}
                </button>
            ))}
        </div>
    );
};

export default HeaderActions;
