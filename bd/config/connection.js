const mongoose = require('mongoose');

// console.log(process.env.DB_HOST);
// console.log(process.env.DB_DATABASE_PARAM);

module.exports = mongoose.connect(process.env.DB_HOST +process.env.DB_DATABASE_PARAM, JSON.parse(process.env.DB_CONNECT_CONFIG));