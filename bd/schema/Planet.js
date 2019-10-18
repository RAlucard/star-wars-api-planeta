const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planetSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Favor informar um nome'],
    unique: true
  },
  climate: {
    type: String,
    required: [true, 'Campo climate não informado']
  },
  terrain: {
    type: String,
    required: [true, 'Favor informar um terreno']
  },
  aparitions: {
    type: Number,
    required: false,
    default: 0
  }
});

var Planet = mongoose.model('Planet', planetSchema);

module.exports = Planet;