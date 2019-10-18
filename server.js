require('./envs/loadDotenv');
require('./bd/config/connection');
const app = require('./custom-express')();

const server = app.listen(process.env.SERVER_PORT || 3001, function () {
  console.log('Servidor rodando na porta ' + process.env.SERVER_PORT);
});