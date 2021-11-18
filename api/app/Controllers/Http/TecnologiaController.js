'use strict';

const Tecnologia = use('App/Models/Tecnologia');
const Database = use('Database');
const Query = require('../../Utils/Query');

class TecnologiaController {
  async index({ request, response }) {
    let query = Tecnologia.query();
    const tegnologias = await Query.builder(query, request);
    response.status(200).json(tegnologias);
  }

  async store({ request, response }) {
    const data = request.only(['nombre', 'descripcion']);
    const tecnologia = await Tecnologia.create(data);

    response.status(201).json(tecnologia);
  }

  async show({ request, response, params: { id } }) {
    const tecnologia = await Tecnologia.findOrFail(id);

    if (!tecnologia) {
      response.status(404).json({
        message: 'Tecnologia no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(tecnologia);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['nombre', 'descripcion']);
    const tecnologia = await Tecnologia.find(id);

    if (!tecnologia) {
      response.status(404).json({
        message: 'Tecnologia no encontrada.',
        id
      });
      return;
    }
    tecnologia.nombre = data.nombre || tecnologia.nombre;
    tecnologia.descripcion = data.descripcion || tecnologia.descripcion;
    await tecnologia.save();

    response.status(200).json(tecnologia);
  }

  async destroy({ request, response, params: { id } }) {
    const tecnologia = await Tecnologia.find(id);

    if (!tecnologia) {
      response.status(404).json({
        message: 'Tecnologia no encontrada.',
        id
      });
      return;
    }
    await tecnologia.delete();

    response.status(200).json(tecnologia);
  }

  async relationsMixers({ request, response, params: { id } }) {
    const data = request.only(['mixers']);

    const transaction = await Database.transaction(async trx => {
      await trx
        .table('tecnologia_mixer')
        .where('tecnologia_id', id)
        .delete();

      const tecnologiaMixers = data.mixers.map(mixer_id => {
        return {
          tecnologia_id: id,
          mixer_id: mixer_id
        };
      });
      await Database.from('tecnologia_mixer').insert(tecnologiaMixers);
      return tecnologiaMixers;
    });

    response.status(200).json(transaction);
  }

  async indexMixers({ request, response, params: { id } }) {
    const tecnologia = await Tecnologia.findOrFail(id);

    if (!tecnologia) {
      response.status(404).json({
        message: 'Tecnologia no encontrada.',
        id
      });
      return;
    }

    let query = tecnologia.mixers();
    const mixers = await Query.builder(query, request);
    response.status(200).json(mixers);
  }
}

module.exports = TecnologiaController;
