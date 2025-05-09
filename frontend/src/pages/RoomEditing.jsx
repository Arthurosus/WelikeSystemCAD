import React, { useEffect, useState } from "react";
import { useParams }       from "react-router-dom";
import axios               from "axios";

import Sidebar       from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import RoomForm      from "../components/RoomForm";

export default function RoomEditing() {
    const { id } = useParams();                // /editar-sala/:id
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [sala, setSala]                     = useState(null);

    useEffect(() => {
        (async () => {
            /* ─── MOCK ─── */
            setSala({
                id,
                nomeSala:     "Sala 101",
                limiteAlunos: 25,
                descricao:    "Sala do 1º andar",
                ativo:        true,
            });

            /* ─── real ───
            const { data } = await axios.get(`http://127.0.0.1:8000/salas/${id}`);
            setSala(data);
            */
        })();
    }, [id]);

    const handleUpdate = async (data) => {
        console.log("SALVAR (mock):", data);
        /* // real:
        await axios.put(`http://127.0.0.1:8000/salas/${id}`, data);
        */
        alert("Sala atualizada (mock)!");
    };

    if (!sala) return null;   // ou spinner

    return (
        <div className="main-layout">
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            <div className="content">
                <HeaderActions categoria="salas" />
                <div className="header-bar" />

                <div className="registration-container">
                    <RoomForm mode="edit" initialData={sala} onSubmit={handleUpdate} />
                </div>
            </div>
        </div>
    );
}
