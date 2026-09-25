// Middleware de AUTORIZACAO POR ROLE (diferente de autenticacao - ver auth.middleware.js).
//
// Pressuposto: este middleware SEMPRE roda depois do auth.middleware.js
// na cadeia de uma rota, porque depende de req.user ja estar preenchido.
// Ele nao verifica identidade (isso ja foi feito antes) - so decide se
// a role de quem esta autenticado tem permissao para aquela rota.
//
// Uso:
//   router.get("/dashboard", authMiddleware, authorize("ADMIN"), dashboardController.get)
//   router.get("/algo", authMiddleware, authorize("ADMIN", "USER"), controller.get) // varias roles permitidas
//
// IMPORTANTE (ponto de atencao pedido pelo usuario):
// este middleware so cobre autorizacao POR ROLE (ex: "e admin?").
// Ele NAO cobre autorizacao POR PROPRIEDADE DO RECURSO (ex: "e o dono
// deste avistamento?") - essa segunda regra continua sendo tratada
// dentro do service/controller do proprio recurso (ex: sighting.service.js),
// comparando req.user.id com o userId salvo no registro do banco.
// Sao duas checagens diferentes, resolvendo problemas diferentes.

const AppError = require("../utils/AppError");

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      // Se isso acontecer, e erro de configuracao da rota (authorize usado
      // sem authMiddleware antes) - mas tratamos com seguranca mesmo assim.
      return next(new AppError("Usuario nao autenticado.", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Voce nao tem permissao para acessar este recurso.", 403));
    }

    next();
  };
}

module.exports = authorize;
