require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParse = require("./app/helpers/bodyParse.js");
const allowedOrigins = require("./app/helpers/allowerOrigin.js");
const corsOptions = require("./app/util/corsOptions.js");
const limiter = require("./app/util/limiter.js");
const transporter = require("./app/util/transporter.js");
const pc = require("picocolors");
const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors(corsOptions(allowedOrigins)));

app.use(async (req, res, next) => {
  const {
    method,
    url,
    headers: { origin },
  } = req;
  try {
    console.log(" ");
    console.log(`${pc.bgCyan("ORIGIN:")} ${pc.green(origin)}`);
    console.log(`${pc.bgCyan("URL:")} ${pc.green(url)}`);
    console.log(`${pc.bgCyan("METHOD:")} ${pc.green(method)}`);
    console.log(
      `${pc.bgCyan("DATE:")} ${pc.green(new Date().toLocaleString())}`
    );
    next();
  } catch (error) {
    console.error(error)
    console.log('Manejando error en primer middleware');
    next(error)
  }
});
app.use(limiter);
app.post("/api/jpaz/sendmail", bodyParse);
app.post("/api/jpaz/sendmail", async (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  const data = {};
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: asunto,
    text: `Mensaje de ${nombre}
      Correo Electronico: ${correo}
      Fecha: ${new Date().toLocaleString()}
      Asunto: ${asunto}
      Mensaje: ${mensaje}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    data.url = req.url;
    data.timestamp = Date.now();
    data.message = "Correo enviado correctamente!";
    data.statusCode = 200;
    console.log(`${pc.bgGreen("Request Complete")}`);
    console.log(`${pc.bgGreen("Status Code:")} ${pc.green(data.statusCode)}`);
    console.log(`${pc.bgGreen("Message:")} ${pc.green(data.message)}`);
    res.status(200).json(data);
  } catch (error) {
    console.log('El error ocurre aca?');
    console.error(error)
    const errorMail = {};
    errorMail.url = req.url;
    errorMail.timestamp = Date.now();
    errorMail.message =
      "Ocurrio un error enviado el correo electronico: " + error.message;
    errorMail.statusCode = 500;
    next(errorMail);
  }
});

app.use((req, res, next) => {
  const errorUrl = {};
  errorUrl.url = req.url;
  errorUrl.timestamp = Date.now();
  errorUrl.message = "URL Inexistente";
  errorUrl.statusCode = 404;
  next(errorUrl);
});

app.use((err, req, res, next) => {
  console.log(`${pc.bgRed("Request Invalid")}`);
  console.log(`${pc.bgRed("Status Code:")} ${pc.red(err.statusCode)}`);
  console.log(`${pc.bgRed("Message:")} ${pc.red(err.message)}`);
  res.status(err.statusCode).json(err);
});

app.listen(PORT, () => {
  console.log(pc.bgBlue("Servidor en el puerto:") + " " + pc.blue(`${PORT}`));
});
