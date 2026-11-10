# 🎯 TechDesk QA Target (`techdesk-qa-challenge`)

Aplicação Fullstack (Monorepo) construída como **sistema-alvo (SUT - System Under Test)** para treinamento prático de **QA, Testes Integrados de API e Automação E2E com IA**.

> **Nota:** Este repositório **não possui nenhum pacote ou suíte de testes instalada** (sem Jest, Vitest, Supertest, Playwright ou Cypress). O objetivo do treinamento é que os alunos configurem a estratégia de testes e escrevam os testes automatizados do zero utilizando IA para encontrar e provar os bugs existentes.

---

## 🏗 Estrutura do Monorepo

```text
techdesk-qa-challenge/
├── backend/                  # API REST em Node.js + Express + TypeScript + better-sqlite3
│   ├── src/
│   │   ├── controllers/      # TicketController (Regras e handlers HTTP)
│   │   ├── database/         # Conexão SQLite (techdesk-qa.db) e script de seed
│   │   ├── routes/           # Rotas de /tickets
│   │   ├── types/            # Contratos TypeScript
│   │   └── server.ts         # Ponto de entrada da API (porta 3001)
│   └── package.json
├── frontend/                 # SPA em React 18 + Vite + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── components/       # TicketForm e TicketList (com data-testid prontos)
│   │   ├── services/         # Cliente HTTP (fetch) apontando para a API
│   │   ├── types/            # Interfaces TypeScript
│   │   └── App.tsx           # Tela principal (porta 5173)
│   └── package.json
└── package.json              # Scripts utilitários na raiz
```

---

## 🚀 Como Subir o Ambiente Localmente

### Pré-requisitos
- **Node.js** 18+ e **npm**

### 1. Instalar as dependências (Backend e Frontend)

Na raiz do projeto, execute:

```bash
npm run install:all
```

*(Ou entre manualmente em `backend/` e `frontend/` e rode `npm install` em cada pasta).*

### 2. Inicializar / Resetar o Banco de Dados SQLite

O banco SQLite (`backend/techdesk-qa.db`) é criado e populado automaticamente na primeira vez que o servidor Backend sobe. Caso queira resetar os dados para o estado original a qualquer momento entre execuções de testes:

```bash
npm run db:reset
```

### 3. Subir o Backend (Porta `3001`)

Em um terminal:

```bash
npm run dev:backend
```

A API estará disponível em `http://localhost:3001` (Healthcheck em `GET http://localhost:3001/health`).

### 4. Subir o Frontend (Porta `5173`)

Em um segundo terminal:

```bash
npm run dev:frontend
```

Acesse a interface web em: **`http://localhost:5173`**

---

## 🔌 Endpoints da API (`http://localhost:3001`)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/health` | Verifica se o servidor está ativo |
| `GET` | `/tickets?page=1&limit=5&search=...` | Lista os chamados cadastrados |
| `GET` | `/tickets/:id` | Obtém detalhes de um chamado por ID |
| `POST` | `/tickets` | Cria um novo chamado (`{ title, description, priority }`) |
| `PATCH` | `/tickets/:id/status` | Atualiza o status do chamado (`{ status: 'OPEN' \| 'CLOSED' }`) |
| `DELETE` | `/tickets/:id` | Remove um chamado do banco |
