const corsOptions = (ao) => {
  return {
    origin: (origin, callback)=> {
      if (!origin) return callback(null, true);
      if (ao.includes(origin)) {
        callback(null, true);
      } else {
        const errorCors = {};
        errorCors.timestamp = Date.now();
        errorCors.message = "Acceso denegado por CORS.";
        errorCors.statusCode = 403;
        callback(errorCors);
      }
    },
    method:'POST',
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  };
};

module.exports = corsOptions