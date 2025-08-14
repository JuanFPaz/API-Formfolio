const bodyValidator = require('./bodyValidator.js')

const bodyParse = (req, res, next) => {
  let body = ''

  req.on('data', chunk => {
    body += chunk
  })

  req.on('end', () => {
    try {
      if (bodyValidator(body).statusCode === 400) {
        throw bodyValidator(body)
      }
      req.body = bodyValidator(body)
      next();
    } catch (err) {
      console.log('El error ocurre en el  catch del error?');
      const error = { 
        url: req.url,
        timestamp: Date.now(),
        message: err.message,
        statusCode: err.statusCode
      };
      next(error); 
    }
  })
}

module.exports = bodyParse