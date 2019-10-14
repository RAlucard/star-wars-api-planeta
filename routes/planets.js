const Planet = require('../bd/schema/Planet');
const https = require('https');

module.exports = function (app) {

  app.get('/planet', async function (req, res, next) {
    await Planet.find({}, function (err, planet) {
      if (err) {
        next(err);
      } else {
        //console.log('Buscando tudo', planet);
        res.jsonp(planet);
      }
    });
  });

  app.get('/planet/:name', async function (req, res, next) {
    const parmName = req.params.name;

    await Planet.find({ name: parmName }, function (err, planet) {
      if (err) {
        next(err);
      } else {
        //console.log('Buscando por', parmName, planet);
        res.json(planet);
      }
    });
  });

  app.post('/planet', async function (req, res, next) {
    const planet = req.body;
    let swApiAparitions = 0;

     https.get('https://swapi.co/api/planets/?search=' + planet.name, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        const retorno = JSON.parse(data);
        console.log('Fim busca wsapi', retorno);
        if (retorno.count >= 1) {
          console.log('qtdFilmes', retorno.results[0].films.length);
          swApiAparitions = retorno.results[0].films.length;
        }
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });

    console.log('antes setar planeta', swApiAparitions);

    const newPlanet = await Planet({
      name: planet.name,
      climate: planet.climate,
      terrain: planet.terrain,
      aparitions: swApiAparitions
    });
console.log('antes salvar', swApiAparitions);

    await newPlanet.save(function (err) {
      if (err) {
        if (err.code === 11000) { // Duplicado
          res
            .status(300)
            .send({ "code": 300, "message": "Planeta já cadastrado" });
          return;
        }
        next(err);
      } else {
        console.log('Planeta criado!');
        res
          .status(201)
          .send({ "code": 201, "message": "Planeta cadastrado com sucesso" });
      }
    });
  });

}
