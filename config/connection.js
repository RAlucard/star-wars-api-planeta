const mongoose = require('mongoose');

//module.exports = mongoose.connect('mongodb://localhost:27017/starWars', {
module.exports = mongoose.connect('mongodb+srv://starwars:V5tDYliDDeX710hp@starwarsplanets-zskhj.mongodb.net/starwars?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});