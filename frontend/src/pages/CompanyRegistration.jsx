import React, { useState } from 'react';

const CompanyRegistration = () => {
    const [form, setForm] = useState({
        name: '',
        cnpj: '',
        email: '',
        sigla: '',
        site: '',
        tipo_empresa: 'Própria',
        regime_empresarial: 'Simples',
        estado_empresa: 'Ativa',
        address: '',
        google_maps_link: '',
        phones: [{ number: '', is_primary: false, is_whatsapp: false }],
        social_media: [{ platform: '', link: '' }],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/companies/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await response.json();
        console.log(data);
    };

    return (
        <div>
            <h1>Cadastro de Empresa</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nome" onChange={handleInputChange} required />
                <input type="text" name="cnpj" placeholder="CNPJ" onChange={handleInputChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
                <input type="text" name="sigla" placeholder="Sigla" onChange={handleInputChange} required />
                <input type="text" name="site" placeholder="Nome do Site" onChange={handleInputChange} required />
                <input type="text" name="address" placeholder="Endereço" onChange={handleInputChange} required />
                <input type="text" name="google_maps_link" placeholder="Link do Google Maps" onChange={handleInputChange} />

                <h3>Redes Sociais</h3>
                <input type="text" name="social_media[0].platform" placeholder="Plataforma (Instagram, Twitter, etc.)" onChange={handleInputChange} />
                <input type="text" name="social_media[0].link" placeholder="Link" onChange={handleInputChange} />

                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
};

export default CompanyRegistration;
