const Planet = require('../bd/schema/Planet');
const axios = require('axios');

module.exports = function (app) {

  app.get('/planet', async (req, res, next) => {
    let busca = {};

    // Busca por queryString; Exemplo: '/planet/?name=Tatooine'
    if (req.query.name) busca.name = req.query.name;
    // if (req.query.climate) busca.climate = req.query.climate;
    // if (req.query.terrain) busca.terrain = req.query.terrain;

    //console.log('Antes da busca', busca);
    await Planet.find(busca, (err, planet, next) => {
      //console.log('Depois da busca', planet);
      if (err) {
        //next(err);
        res
          .status(404)
          .send({
            "code": 404,
            "message": "Nenhum planeta encontrado"
          });
      } else {
        //console.log('Buscando tudo', planet);
        res
          .status(200)
          .send(planet);
        //res.jsonp(planet);
      }
    }).catch(e => console.log(e));
  });

  app.get('/planet/:id', async (req, res, next) => {
    const parmId = req.params.id;

    await Planet.findById(parmId, (err, planet) => {
      if (err) {
        //console.log(err);
        next(err);
      } else {
        if (planet) res.json(planet);
        else
          res
          .status(300)
          .send({
            "code": 300,
            "message": "Planeta não encontrado"
          });
      }
    });
  });

  app.delete('/planet/:id', async (req, res, next) => {
    const parmId = req.params.id;
    // console.log('parmId', parmId);

    await Planet.deleteOne({
      _id: parmId
    }, (err, status) => {
      if (err) next(err);
      // console.log('erro:', err);
      // console.log('status:', status);
      if (status.deletedCount >= 1) {
        res
          .status(200)
          .send({
            "code": 200,
            "message": "Planeta removido com sucesso"
          });
      } else {
        res
          .status(404)
          .send({
            "code": 404,
            "message": "Nenhum planeta encontrado para remoção"
          });
      }
    });
  });

  async function getPlanetSWApi(name) {
    const res = await axios.get(process.env.API_SW_PLANET_URL + '?search=' + name)
      .catch((error) => {
        console.log('Error return swapi', error);
        return error;
      });

    return res.data;
  }

  app.options('/planet', (req, res) => {
    res.end();
  });

  app.post('/planet', async (req, res, next) => {
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

    newPlanet.save((err) => {
      //console.log('depois de salvar');

      if (err) {
        if (err.code === 11000) { // Duplicado
          res
            .status(300)
            .send({
              "code": 300,
              "message": "Planeta já cadastrado"
            });
        } else if (err.errors) {
          res
            .status(400)
            .send({
              "code": 400,
              "message": "Erro no preenchimento dos dados",
              "detalhes:": err
            });
        } else
          next(err);
      } else { // Criado
        res
          .status(201)
          .send({
            "code": 201,
            "message": "Planeta cadastrado com sucesso"
          });
      }
    });
  });

}