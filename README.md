# Little Ville — Registro de Avistamentos

Aplicação web para moradores registrarem, visualizarem e interagirem com avistamentos de criaturas místicas na cidade fictícia de Little Ville. Trabalho final da disciplina de Desenvolvimento de Sistemas Integrados.

> **Status deste documento:** cobre a instalação e execução **local** (frontend + backend + PostgreSQL). As instruções de deploy em produção serão adicionadas em uma etapa posterior do projeto, quando as decisões de hospedagem (backend/banco) e armazenamento de imagens forem confirmadas.

---

## Funcionalidades

- Cadastro e login com JWT, senhas protegidas com bcrypt
- CRUD completo de avistamentos (criar, listar, visualizar, editar, excluir)
- Mapa interativo (OpenStreetMap + Leaflet, sem chave de API) com marcação manual ou geolocalização
- Comentários e curtidas em avistamentos
- Sistema de denúncias com fila de moderação para administradores
- Notificações internas (novo comentário, nova curtida, avistamento relevante, eventos administrativos)
- Dashboard administrativo com estatísticas reais (gráficos via Recharts)
- Ranking de criaturas mais avistadas
- Moderação de status dos avistamentos (Pendente → Em análise → Verificado/Rejeitado)
- Upload de imagens (armazenamento local em desenvolvimento)
- Tema claro/escuro, visual retrô inspirado no Windows 95
- Interface responsiva (mobile, tablet, desktop)

## Tecnologias

**Frontend:** React, Vite, React Router, Axios, Leaflet/React-Leaflet, Recharts, CSS puro (sem biblioteca de UI)

**Backend:** Node.js, Express, Prisma ORM, PostgreSQL, JWT, bcrypt, Zod, Multer, Helmet

## Arquitetura

```
little-ville/
├── backend/    # API REST (routes → controllers → services → Prisma)
└── frontend/   # SPA React consumindo a API via Axios
```

Documentação técnica completa (entidades, relacionamentos, decisões técnicas) em `docs/` (a ser adicionada na Etapa 8 do desenvolvimento).

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [PostgreSQL](https://www.postgresql.org/download/) 14 ou superior (local ou via Docker)
- npm (já vem com o Node.js)

---

## 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd little-ville
```

---

## 2. Configurar o banco de dados PostgreSQL

**Opção A — instalação nativa**, após instalar o PostgreSQL:
```bash
psql -U postgres
CREATE DATABASE littleville;
\q
```

**Opção B — via Docker** (não faz parte da arquitetura do projeto, é só uma forma prática de rodar o Postgres localmente):
```bash
docker run --name littleville-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=littleville \
  -p 5432:5432 \
  -d postgres:16
```

---

## 3. Configurar e rodar o backend

```bash
cd backend
cp .env.example .env
```

Edite o `backend/.env` e preencha, no mínimo:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/littleville"
JWT_SECRET="troque_por_um_valor_seguro_e_aleatorio"
ADMIN_NAME="Administrador"
ADMIN_EMAIL="admin@littleville.local"
ADMIN_PASSWORD="troque_por_uma_senha_segura"
FRONTEND_URL="http://localhost:5173"
```

Instale as dependências, rode a migration e o seed:

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

Isso cria as tabelas no banco, popula as 5 criaturas oficiais e cria o administrador padrão com os dados do `.env`.

Suba o servidor:

```bash
npm run dev
```

O backend deve responder em `http://localhost:3333`. Teste rapidamente:

```bash
curl http://localhost:3333/api/health
```

Resposta esperada: `{"status":"ok","service":"little-ville-backend",...}`

---

## 4. Configurar e rodar o frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env
```

Confirme que `frontend/.env` aponta para o backend local:
```
VITE_API_URL="http://localhost:3333/api"
```

Instale e rode:

```bash
npm install
npm run dev
```

O frontend deve abrir em `http://localhost:5173`.

---

## 5. Login inicial

Use as credenciais definidas em `ADMIN_EMAIL` / `ADMIN_PASSWORD` no `.env` do backend para entrar como administrador, ou crie uma conta comum pela tela de Cadastro.

---

## 6. Verificações úteis durante o desenvolvimento

```bash
# Ver os dados no navegador (Prisma Studio)
cd backend && npx prisma studio

# Reaplicar o seed (idempotente - seguro rodar de novo)
npx prisma db seed

# Resetar o banco do zero (⚠️ apaga todos os dados - só em desenvolvimento)
npx prisma migrate reset
```

---

## Como testar

Não há testes automatizados neste projeto (fora do escopo definido). A validação é manual, cobrindo: cadastro/login, CRUD de avistamentos, mapa (marcação manual e geolocalização), comentários, curtidas, denúncias, notificações, dashboard administrativo e responsividade. Um roteiro de testes detalhado será adicionado na Etapa 7 do desenvolvimento.

---

## Limitações conhecidas (documentadas para a defesa)

- **Logout stateless:** o JWT não possui blacklist/revogação — o "logout" apenas remove o token do navegador. O token tecnicamente continua válido até expirar (`JWT_EXPIRES_IN`, padrão 7 dias). Decisão aceita para o escopo acadêmico deste projeto.
- **Upload local:** em desenvolvimento, as imagens ficam em `backend/uploads/`. Isso não persiste em produção (ex: Netlify) — uma solução de armazenamento externo será definida antes do deploy.

---

## Estrutura do projeto

```
backend/src/
├── routes/        endpoints da API
├── controllers/   tradução HTTP ↔ service
├── services/       regras de negócio
├── middlewares/    autenticação, autorização, upload, erros
├── validators/      schemas Zod
├── config/          env, cors, prisma, notificações
└── utils/           JWT, bcrypt, AppError

frontend/src/
├── pages/           telas da aplicação
├── components/       componentes reutilizáveis (layout, ui, sighting, map)
├── contexts/          AuthContext, ThemeContext
├── services/           chamadas Axios por recurso
├── routes/             ProtectedRoute
└── styles/              CSS retrô (claro/escuro)
```
