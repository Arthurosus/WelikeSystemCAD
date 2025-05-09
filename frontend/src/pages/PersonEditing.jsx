import React, { useEffect, useState } from "react";
import { useParams }  from "react-router-dom";
import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import PersonForm     from "../components/PersonForm";   // ← Form genérico p/ pessoa
import axios          from "axios";

export default function PersonEditing() {
  const { id } = useParams();                     // /editar‑pessoa/:id
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [pessoa, setPessoa]               = useState(null);

  /* ────────────────────────────────────────────────
     1. Carregar dados da pessoa   (mock ou backend)
  ──────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      /* ——— MOCK ——— */
      setPessoa({
        id,
        nome: "Ana Beatriz da Silva",
        dtNascimento: "2000‑05‑10",
        sexo: "F",
        mae: "Maria da Silva",
        email: "ana@email.com",
        cpf: "123.456.789‑01",
        rg: "12.345.678‑9",
        ativo: true,

        telefones: [
          { codigo_pais: "+55", numero: "11999991234", whatsapp: true, tipo:"Celular" }
        ],

        enderecoMoradia: {
          formato: "brasil",
          cep: "01001‑000",
          endereco: "Av. Paulista",
          numero: "1234",
          complemento: "Ap 101",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          regiao: "",
          pais: "Brasil"
        },
        enderecoCorrespondencia: {
          formato: "brasil",
          cep: "01001‑000",
          endereco: "Av. Paulista",
          numero: "1234",
          complemento: "Ap 101",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          regiao: "",
          pais: "Brasil"
        }
      });

      /* ——— PRODUÇÃO ———
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/pessoas/${id}`);
        setPessoa(data);
      } catch (err) {
        console.error("Erro ao buscar pessoa:", err);
      }
      */
    })();
  }, [id]);

  /* ────────────────────────────────────────────────
     2. Salvar alterações
  ──────────────────────────────────────────────── */
  const handleUpdate = async (data) => {
    console.log("SALVAR (mock):", data);
    /* ——— PRODUÇÃO ———
    try {
      await axios.put(`http://127.0.0.1:8000/pessoas/${id}`, data);
      // toast de sucesso…
    } catch (err) {
      console.error("Falha ao atualizar pessoa:", err);
    }
    */
  };

  if (!pessoa) return null;            // ou <Spinner />

  /* ────────────────────────────────────────────────
     3. JSX
  ──────────────────────────────────────────────── */
  return (
      <div className="main-layout">
        <Sidebar
            cadastroAberto={cadastroAberto}
            setCadastroAberto={setCadastroAberto}
        />
        <div className="content">
          <HeaderActions categoria="pessoas" />
          <div className="header-bar" />
          <div className="registration-container">
            <PersonForm          /* mesmo form usado no cadastro */
                mode="edit"
                initialData={pessoa}
                onSubmit={handleUpdate}
            />
          </div>
        </div>
      </div>
  );
}
