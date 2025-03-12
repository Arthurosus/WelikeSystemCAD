import React, { useEffect, useState } from "react";
import axios from "axios";

const CompanyList = () => {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/empresas/")
      .then(response => setEmpresas(response.data))
      .catch(error => console.error("Erro ao buscar empresas:", error));
  }, []);

  return (
    <div className="container">
      <h2>Lista de Empresas Cadastradas</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Razão Social</th>
            <th>Nome Fantasia</th>
            <th>CNPJ</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((empresa) => (
            <tr key={empresa.id}>
              <td>{empresa.id}</td>
              <td>{empresa.razao_social}</td>
              <td>{empresa.nome_fantasia}</td>
              <td>{empresa.cnpj}</td>
              <td>{empresa.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyList;
