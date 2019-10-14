const express = require('express');
const load = require('express-load');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');

module.exports = function () {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  load('routes')
    .into(app);

  app.use(function (req, res) {
    console.log('Recurso não encontrado: ' + req.originalUrl);
    res.status(404);
    res.json({ error: 'recurso não encontrado' });
  });

  app.use(function (error, req, res, next) {
    console.error('Erro no middleware');
    console.error(error);
    res.status(500);
    res.json({ error: 'erro interno do servidor' });
  });

  return app;
};
