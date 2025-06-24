/*  --------------------------------------------------------------------
    Todas as URLs da SPA centralizadas aqui.
    Assim, mudar um caminho futuramente vira questão de 1 arquivo só.
--------------------------------------------------------------------- */
export const ROUTES = {
    /* página de boas-vindas */
    WELCOME      : "/welcome",

    /* ───────── Cadastros ───────── */
    EMP_NEW      : "/cadastro-empresas",
    PERSON_NEW   : "/cadastro-pessoas",
    ROLE_NEW     : "/cadastro-cargos",
    ROOM_NEW     : "/cadastro-salas",
    STUD_NEW     : "/cadastro-aluno",
    EMPLOYEE_NEW : "/cadastro-funcionario",
    LESSON_NEW   : "/cadastro-aula",

    /* ───────── Listagens ───────── */
    EMP_LIST      : "/lista-empresas",
    PERSON_LIST   : "/lista-pessoas",
    ROLE_LIST     : "/lista-cargos",
    ROOM_LIST     : "/lista-salas",
    STUD_LIST     : "/lista-alunos",
    EMPLOYEE_LIST : "/lista-funcionarios",
    LESSON_LIST   : "/lista-aulas",

    /* ───────── Edição (com :id) ───*/
    EMP_EDIT      : "/editar-empresa/:id",
    PERSON_EDIT   : "/editar-pessoa/:id",
    ROLE_EDIT     : "/editar-cargo/:id",
    ROOM_EDIT     : "/editar-sala/:id",
    STUD_EDIT     : "/editar-aluno/:id",
    EMPLOYEE_EDIT : "/editar-funcionario/:id",
    LESSON_EDIT   : "/editar-aula/:id",
};
