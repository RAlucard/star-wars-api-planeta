require('../../envs/loadDotenv');
const express = require('../../custom-express')();
const request = require('supertest')(express);
const Planet = require('../../bd/schema/Planet');

require('../../bd/config/connection');

describe('#PlanetasController', function () {
  const planeta = {
    name: 'PlanetaTeste',
    climate: 'ClimaTeste',
    terrain: 'TerrenoTeste',
    inexistente: 'PLANETA INEXISTENTE'
  }

  before('Apagando dados dos planetas', async function () {
    console.log('Before: Apagando dados de testes');
    return await Planet.deleteMany({}, function (err, retorno) {
      if (err) return new Error(err);
    });
  });

  it('Cadastrando planeta teste', async function () {
    const data = {
      name: planeta.name,
      climate: planeta.climate,
      terrain: planeta.terrain
    }

    return await request
      .post('/planet')
      .send(data)
      .set('Accept', 'application/json')
      .expect(201);
  });

  it('Cadastrando planeta teste para forçar duplicidade', async function () {
    const data = {
      name: 'PlanetaTeste',
      climate: 'ClimaTeste',
      terrain: 'TerrenoTeste',
    }

    return await request
      .post('/planet')
      .send(data)
      .set('Accept', 'application/json')
      .expect(300);
  });

  it('Cadastrando sem dados preenchido', async function () {
    const data = {
      name: '',
      climate: '',
      terrain: ''
    }

    return await request
      .post('/planet')
      .send(data)
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('Listar todos os planetas - JSON', async function () {
    return await request
      .get('/planet')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('Listar planeta Cadastrado no teste - JSON', async function () {
    return await request
      .get('/planet?name=' + planeta.name)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function (res) {
        const body = res.body[0];
        if (body.name !== planeta.name)
          return new Error('Nome do planeta retornado diferente: ' + body.name);

        if (body.climate !== planeta.climate)
          return new Error('Clima do planeta retornado diferente: ' + body.climate);

        if (body.terrain !== planeta.terrain)
          return new Error('Terreno do planeta retornado diferente: ' + body.terrain);
      });
  });

  it('Tentando listar planeta inexistente - JSON', async function () {
    return await request
      .get('/planet?name=' + planeta.inexistente)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });

});