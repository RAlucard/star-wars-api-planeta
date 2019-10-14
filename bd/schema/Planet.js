const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planetSchema = new Schema({
  name: { type: String, required: true, unique: true },
  climate: { type: String, required: true },
  terrain: { type: String, required: true },
  aparitions: { type: Number, required: false, default: 0 }
});

var Planet = mongoose.model('Planet', planetSchema);

module.exports = Planet;
