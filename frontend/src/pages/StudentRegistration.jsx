import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../styles/companyRegistration.css";

const StudentRegistration = () => {
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [pessoas, setPessoas] = useState([]);
  const [student, setStudent] = useState({
    idPessoa: "",
    responsavelMesmo: false,
    responsavel: {
      nome: "",
      email: "",
      celular: ""
    },
    curso: "",
    progresso: "",
    exterior: false,
    foto: null
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/pessoas/")
      .then(res => setPessoas(res.data))
      .catch(err => console.error("Erro ao buscar pessoas:", err));
  }, []);

  const handleFileChange = (e) => {
    setStudent({ ...student, foto: e.target.files[0] });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("responsavel.")) {
      const field = name.split(".")[1];
      setStudent({
        ...student,
        responsavel: {
          ...student.responsavel,
          [field]: value
        }
      });
    } else {
      setStudent({ ...student, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(student).forEach((key) => {
      if (key === "responsavel") {
        Object.entries(student.responsavel).forEach(([k, v]) => {
          formData.append(`responsavel.${k}`, v);
        });
      } else {
        formData.append(key, student[key]);
      }
    });

    try {
      await axios.post("http://127.0.0.1:8000/alunos/", formData);
      alert("Aluno cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
    }
  };

  const pessoaSelecionada = pessoas.find(p => p.id === parseInt(student.idPessoa));

  return (
    <div className="main-layout">
      <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
      <div className="content">
        <div className="header-bar"></div>
        <div className="registration-container">
          <form className="form-box" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Cadastro de Aluno</h2>
            </div>

            <div className="form-step">
              <label>Selecionar Pessoa:</label>
              <select
                className="input"
                name="idPessoa"
                value={student.idPessoa}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome} - {p.cpf}</option>
                ))}
              </select>

              {pessoaSelecionada && (
                <div className="foto-preview">
                  <img src={`http://127.0.0.1:8000/imagens/${pessoaSelecionada.foto}`} alt="Foto" height="100" />
                  <p><strong>Email:</strong> {pessoaSelecionada.email}</p>
                  <p><strong>Celular:</strong> {pessoaSelecionada.celular}</p>
                </div>
              )}

              <label>
                <input
                  type="checkbox"
                  name="exterior"
                  checked={student.exterior}
                  onChange={handleChange}
                /> Aluno no exterior
              </label>

              <input
                className="input"
                placeholder="Progresso"
                name="progresso"
                value={student.progresso}
                onChange={handleChange}
              />

              <select
                className="input"
                name="curso"
                value={student.curso}
                onChange={handleChange}
              >
                <option value="">Selecione o curso</option>
                <option value="teens">Teens</option>
                <option value="fluency">Fluency</option>
                <option value="travel">Travel</option>
                <option value="vip">VIP</option>
                <option value="chatclub">Chatclub</option>
                <option value="kids">Kids</option>
                <option value="coorporate">Coorporate</option>
              </select>

              <label>Foto do aluno:</label>
              <input type="file" onChange={handleFileChange} />

              <hr />
              <h4>Responsável Financeiro</h4>
              <input
                className="input"
                name="responsavel.nome"
                placeholder="Nome"
                value={student.responsavel.nome}
                onChange={handleChange}
              />
              <input
                className="input"
                name="responsavel.email"
                placeholder="Email"
                value={student.responsavel.email}
                onChange={handleChange}
              />
              <input
                className="input"
                name="responsavel.celular"
                placeholder="Celular"
                value={student.responsavel.celular}
                onChange={handleChange}
              />

              <button className="btn submit" type="submit">Cadastrar Aluno</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
