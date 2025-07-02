// src/index.js
import React      from "react";
import ReactDOM   from "react-dom/client";
import App        from "./App";
import "./index.css";

/* ——— React Query ——— */
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/* cria uma instância global do client */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // evita refetch ao trocar de aba
            retry: 1,                    // tenta só 1× se falhar
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        {/* disponibiliza o client para TODA a árvore */}
        <QueryClientProvider client={queryClient}>
            <App />

            {/* DevTools (somente em dev, remova em produção se quiser) */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);
