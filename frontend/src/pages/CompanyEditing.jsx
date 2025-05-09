import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import CompanyForm from "../components/CompanyForm";
import axios from "axios";

export default function CompanyEditing() {
  const { id } = useParams();
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    (async () => {
      // ‑‑ MOCK ‑‑ use dados fixos
      setEmpresa({
        id,
        codigo:"EMP123", cnpj:"12.345.678/0001‑00", sigla:"EMP",
        razaoSocial:"Empresa Exemplo", nomeFantasia:"Exemplo LTDA",
        tipoEmpresa:"1", regimeEmpresarial:"1", estadoEmpresa:"1",
        telefones:[{codigo_pais:"+55",numero:"11999990000",principal:true,whatsapp:true}],
        redesSociais:{email:"contato@exemplo.com"},
        endereco:{formato:"brasil",cidade:"São Paulo",estado:"SP",pais:"Brasil"}
      });

      /* // real:
      const { data } = await axios.get(`http://127.0.0.1:8000/empresas/${id}`);
      setEmpresa(data);
      */
    })();
  }, [id]);

  const handleUpdate = async (data) => {
    console.log("SALVAR (mock):", data);
    /* // real:
    await axios.put(`http://127.0.0.1:8000/empresas/${id}`, data);
    */
  };

  if (!empresa) return null;   // ou um spinner

  return (
      <div className="main-layout">
        <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
        <div className="content">
          <HeaderActions categoria="empresas" />
          <div className="header-bar" />
          <div className="registration-container">
            <CompanyForm
                mode="edit"
                initialData={empresa}
                onSubmit={handleUpdate}
            />
          </div>
        </div>
      </div>
  );
}
