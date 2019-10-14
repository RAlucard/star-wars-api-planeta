var app = require('./custom-express')();
require('./config/connection');
var server = app.listen(3001, function(){
  console.log('Servidor rodando na porta 3001');
});