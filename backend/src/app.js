// app.js
//
// Responsabilidade deste arquivo: MONTAR a aplicacao Express.
// Ele define O QUE a aplicacao e (middlewares, rotas, tratamento de erro),
// mas nao abre nenhuma porta de rede - isso e responsabilidade do server.js.
//
// Ordem dos middlewares importa: cada requisicao passa por eles em sequencia,
// de cima para baixo, ate chegar na rota correspondente.

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const corsOptions = require("./config/cors");
const routes = require("./routes");
const errorHandlerMiddleware = require("./middlewares/errorHandler.middleware");

const app = express();

// 1. Helmet: adiciona um conjunto de headers HTTP relacionados a seguranca
//    (ex: evita que o navegador tente "adivinhar" o tipo de um arquivo,
//    desabilita certas informacoes que poderiam ajudar um ataque).
//    E "configuracao zero" - nao precisamos escolher nada manualmente
//    para o escopo deste projeto.
app.use(helmet());

// 2. CORS: libera requisicoes vindas apenas do FRONTEND_URL configurado no .env
//    (nunca "*", ver src/config/cors.js para o motivo).
app.use(cors(corsOptions));

// 3. Parser de JSON: permite que req.body seja lido como objeto JavaScript
//    quando o cliente envia Content-Type: application/json.
app.use(express.json());

// 4. Pasta de uploads servida como arquivos estaticos.
//    Isso significa que uma imagem salva em backend/uploads/foto.jpg
//    fica acessivel publicamente em http://localhost:3333/uploads/foto.jpg
//    Usado APENAS em desenvolvimento (ver Bloco 14 do briefing sobre
//    a solucao de producao, ainda a ser definida).
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// 5. Rotas da API, todas sob o prefixo /api
//    (o /health, por exemplo, fica acessivel em GET /api/health)
app.use("/api", routes);

// 6. Rota "catch-all" para qualquer caminho nao encontrado
app.use((req, res) => {
  res.status(404).json({ error: "Rota nao encontrada." });
});

// 7. Tratamento global de erros - DEVE ser o ultimo middleware registrado.
app.use(errorHandlerMiddleware);

module.exports = app;
