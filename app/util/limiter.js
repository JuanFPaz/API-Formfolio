const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //60 * 1000 = 1 minuto -> 15 * 1 = 15 minutos
  max: 5, // Maximo 5 peticiones
	handler: (req, res, next) =>{
    const erroMail = {};
    erroMail.url = req.url;
    erroMail.timestamp = Date.now();
    erroMail.message = "Excediste el limite de solicitudes. Por favor, intenta más tarde.";
    erroMail.statusCode = 429;
    next(erroMail)
  }
});

module.exports = limiter;
