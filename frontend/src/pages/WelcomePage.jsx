import React from "react";
import Sidebar       from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";   // se quiser manter a faixa azul
import "../styles/companyRegistration.css";

export default function WelcomePage() {
    /* se você já usa “cadastroAberto” para abrir/fechar o menu: */
    const [cadastroAberto, setCadastroAberto] = React.useState(false);

    return (
        <div className="main-layout">
            <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />

            <div className="content">
                {/* opcional: faixa azul com nenhum botão ativo */}
                <HeaderActions categoria="home" />
                <div className="header-bar" />

                <div className="welcome-wrapper">
                    <h1 className="welcome-title">👋 Seja bem‑vindo à Welike System!</h1>
                    <p className="welcome-text">
                        Use o menu à esquerda para navegar entre cadastros e listagens.
                    </p>
                </div>
            </div>
        </div>
    );
}
