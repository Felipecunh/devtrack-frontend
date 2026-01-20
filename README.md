

# DevTrack API

DevTrack API é uma API REST para gerenciamento de projetos e tarefas, desenvolvida em .NET (C#) como projeto de portfólio.  
A aplicação fornece autenticação segura com JWT e endpoints protegidos para controle completo de projetos e tarefas.

--- 

## Stack

* **.NET (C#)**
* **ASP.NET Core**
* **Entity Framework Core**
* **JWT (Bearer)**
* **BCrypt**
* **Swagger / OpenAPI**

---

## Visão Geral

* API REST desenvolvida em ASP.NET Core
* Autenticação stateless utilizando JWT
* Persistência de dados com Entity Framework Core
* Endpoints protegidos por autenticação
* Estrutura organizada, preparada para evolução

---

## Funcionalidades

### Autenticação
* Cadastro de usuários
* Login com geração de token JWT
* Validação de token em rotas protegidas

### Projetos
* Listagem, criação, atualização e exclusão (CRUD)
* Paginação, busca e ordenação

### Tarefas
* Criação de tarefas vinculadas a projetos
* Atualização de status: *Pendente, Em andamento, Concluída*
* Listagem por projeto e exclusão

---

## Autenticação

A API utiliza autenticação JWT no formato **Bearer Token**.

```http
Authorization: Bearer {seu_token_aqui}

```

> **Nota:** Todas as rotas de projetos e tarefas exigem o token no cabeçalho da requisição.

---

## Endpoints Principais

### Auth
 
* `POST /api/auth/register` - Criar nova conta
* `POST /api/auth/login` - Autenticar e obter token

### Projetos

* `GET /api/projects` - Listar todos os projetos
* `POST /api/projects` - Criar novo projeto
* `GET /api/projects/{id}` - Obter detalhes de um projeto
* `PUT /api/projects/{id}` - Atualizar projeto existente
* `DELETE /api/projects/{id}` - Remover projeto

### Tarefas

* `POST /api/tasks` - Criar tarefa em um projeto
* `GET /api/tasks/by-project/{projectId}` - Listar tarefas de um projeto específico
* `PUT /api/tasks/{id}` - Editar informações da tarefa
* `PATCH /api/tasks/{id}/status` - Alterar apenas o status da tarefa
* `DELETE /api/tasks/{id}` - Remover tarefa

---

## Como Executar o Projeto

1. Certifique-se de ter o SDK do .NET instalado.
2. Clone o repositório.
3. Restaure as dependências:
```bash
dotnet restore

```


4. Execute a aplicação:
```bash
dotnet run

```



A API estará disponível por padrão em: `http://localhost:5273`

---

## Documentação

A documentação interativa da API (Swagger) pode ser acessada em:
`http://localhost:5273/swagger`

---

## Estrutura de Pastas

```text
DevTrack.API/
├── Controllers/   
├── Data/          
├── DTOs/          
├── Models/        
├── Services/      
├── Program.cs     
└── appsettings.json

```

---

## Boas Práticas Aplicadas

* **Separação de Responsabilidades:** Arquitetura limpa e organizada.
* **DTOs:** Proteção das entidades de domínio contra exposição direta.
* **Segurança:** Hash de senhas com BCrypt e autenticação via JWT.
* **Padrões REST:** Uso correto de verbos HTTP e códigos de status.
* **Clean Code:** Código legível, comentado e de fácil manutenção.

```
