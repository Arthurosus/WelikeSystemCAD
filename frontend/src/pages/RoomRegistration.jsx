import React, { useState } from "react";
import axios                 from "axios";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import RoomForm       from "../components/RoomForm";

import "../styles/companyRegistration.css";


export default function RoomRegistration() {
    const [cadastroAberto, setCadastroAberto] = useState(false);

    const handleCreate = async (data) => {
        console.log("ENVIAR (mock):", data);  //  ← troque pelo back‑end real
        /* // integração real:
           await axios.post("http://127.0.0.1:8000/salas/", data);
        */
        alert("Sala cadastrada (mock)!");
    };

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
                    <RoomForm mode="create" onSubmit={handleCreate} />
                </div>
            </div>
        </div>
    );
}
