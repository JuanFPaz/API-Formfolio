const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //60 * 1000 = 1 minuto -> 15 * 1 = 15 minutos
  max: 5, // Maximo 5 peticiones
  handler: (req, res, next) => {
    const errorLimit = {};
    try {
      errorLimit.url = req.url;
      errorLimit.timestamp = Date.now();
      errorLimit.message =
        "Excediste el limite de solicitudes. Por favor, intenta más tarde.";
      errorLimit.statusCode = 429;
      next(errorLimit);
    } catch (error) {
    console.error(error)
    console.log('Manejando error en handler Limiter');
    next(error)
    }
  },
});

module.exports = limiter;
