const Planet = require('../bd/schema/Planet');
const axios = require('axios');
const { check, validationResult } = require('express-validator');

module.exports = function (app) {

  app.get('/planet', async function (req, res, next) {
    let busca = {};

    // Busca por queryString; Exemplo: '/planet/?name=Tatooine'
    if (req.query.name) busca.name = req.query.name;
    // if (req.query.climate) busca.climate = req.query.climate;
    // if (req.query.terrain) busca.terrain = req.query.terrain;

    await Planet.find(busca, function (err, planet) {
      if (err) {
        next(err);
      } else {
        //console.log('Buscando tudo', planet);
        res.jsonp(planet);
      }
    });
  });

  app.get('/planet/:id', async function (req, res, next) {
    const parmId = req.params.id;

    await Planet.findById(parmId, function (err, planet) {
      if (err) {
        //console.log(err);
        next(err);
      } else {
        if (planet) res.json(planet);
        else
          res
            .status(300)
            .send({ "code": 300, "message": "Planeta não encontrado" });
      }
    });
  });

  app.delete('/planet/:id', async function (req, res, next) {
    const parmId = req.params.id;
    console.log('parmId', parmId);

    await Planet.deleteOne({ _id: parmId }, function (err) {
      if (err)
        next(err);
    });
  });

  async function getPlanetSWApi(name) {
    //const returnApi = await axios.get('https://swapi.co/api/planets/?search=' + name);
    const res = await axios.get('https://swapi.co/api/planets/?search=' + name)
      .catch(function (error) {
        console.log('Error return swapi', error);
        return error;
      });

    return res.data;
  }

  app.options('/planet', function (req, res) {
    res.end();
  });

  app.post('/planet', async function (req, res, next) {
    const planet = req.body;
    let swApiAparitions = 0;

    const planetSW = await getPlanetSWApi(planet.name);

    if (planetSW.count >= 1) {
      swApiAparitions = planetSW.results[0].films.length;
    }

    const newPlanet = Planet({
      name: planet.name,
      climate: planet.climate,
      terrain: planet.terrain,
      aparitions: swApiAparitions
    });

    newPlanet.save(function (err) {
      if (err) {
        if (err.code === 11000) { // Duplicado
          res
            .status(300)
            .send({ "code": 300, "message": "Planeta já cadastrado" });
          return;
        }
        next(err);
      } else { // Criado
        res
          .status(201)
          .send({ "code": 201, "message": "Planeta cadastrado com sucesso" });
      }
    });
  });

}
