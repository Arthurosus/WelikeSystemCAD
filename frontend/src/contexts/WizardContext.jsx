import React, { createContext, useContext, useState } from "react";

/** Mantém os dados digitados em cada etapa do formulário de empresa. */
const WizardContext = createContext(null);

export const WizardProvider = ({ children }) => {
    const [wizardData, setWizardData] = useState({
        empresa : {},
        endereco: {},
        redes   : {},
    });

    /** funde o patch recebido com o objeto já existente */
    const mergeWizardData = (patch) =>
        setWizardData((prev) => ({ ...prev, ...patch }));

    return (
        <WizardContext.Provider value={{ wizardData, mergeWizardData }}>
            {children}
        </WizardContext.Provider>
    );
};

export const useWizard = () => useContext(WizardContext);
