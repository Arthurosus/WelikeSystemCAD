import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Sidebar       from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import RoleForm      from "../components/RoleForm";

import "../styles/companyRegistration.css";

const USE_MOCK = true; // troque para false quando ligar ao back‑end

export default function RoleEditing() {
    const { id } = useParams();
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [role, setRole] = useState(null);

    /* carrega o cargo (mock ou API) */
    useEffect(() => {
        if (USE_MOCK) {
            setRole({
                id,
                codEmpresa: "EMP001",
                codCargo: "CG001",
                professor: true,
                descricao: "Professor de Inglês",
                ativo: true,
            });
            return;
        }

        (async () => {
            try {
                const { data } = await axios.get(`http://127.0.0.1:8000/cargos/${id}`);
                setRole(data);
            } catch (err) {
                console.error("Erro ao buscar cargo:", err);
            }
        })();
    }, [id]);

    /* submit */
    const handleUpdate = async (data) => {
        console.log("SALVAR CARGO (mock):", data);
        if (!USE_MOCK) {
            await axios.put(`http://127.0.0.1:8000/cargos/${id}`, data);
        }
        alert("Cargo salvo (mock)!");
    };

    if (!role) return null; // ou spinner

    /* layout padrão */
    return (
        <div className="main-layout">
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            <div className="content">
                <HeaderActions categoria="cargos" />
                <div className="header-bar" />

                <div className="registration-container">
                    <RoleForm mode="edit" initialData={role} onSubmit={handleUpdate} />
                </div>
            </div>
        </div>
    );
}
