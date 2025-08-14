function bodyValidator(body) {
  let _body = JSON.parse(body);

  //Primero verificamos que los 3 campos existan.
  try {
    if (!_body.nombre || !_body.correo || !_body.mensaje) {
      throw new Error("Error con el cuerpo de la solicitud. Faltan los campos nombre, correo o mensaje.");
    }

    if (!_body.nombre.trim() || !_body.correo.trim() || !_body.mensaje.trim()) {
      throw new Error("Error con el cuerpo de la solicitud. Los campos nombre, correo o mensaje llegaron vacios");
    }

    return _body
  } catch (error) {
    const err = {statusCode:400, message: error.message}

    return err
  }
}

module.exports = bodyValidator