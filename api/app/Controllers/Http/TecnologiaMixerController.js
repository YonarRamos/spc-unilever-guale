'use strict';

const TecnologiaMixer = use('App/Models/TecnologiaMixer');
const Query = require('../../Utils/Query');
const Database = use('Database');

class TecnologiaMixerController {
  async index({ request, response }) {
    let query = TecnologiaMixer.query();
    const tecnologiaMixers = await Query.builder(query, request);
    response.status(200).json(tecnologiaMixers);
  }

  async store({ request, response }) {
    const data = request.only(['mixer_id', 'tecnologia_id', 'tecnologias_mixers']);

    if (data.tecnologias_mixers.length > 0) {
      await Database.from('tecnologia_mixer').insert(data.tecnologias_mixers);

      response.status(201).json({ status: 'OK', message: 'Registro exitoso!' });
    } else {
      const tecnologiaMixer = await TecnologiaMixer.create({
        mixer_id: data.mixer_id,
        tecnologia_id: data.tecnologia_id
      });

      response.status(201).json(tecnologiaMixer);
    }
  }

  async show({ request, response, params: { id } }) {
    const tecnologiaMixer = await TecnologiaMixer.findOrFail(id);

    if (!tecnologiaMixer) {
      response.status(404).json({
        message: 'Tecnologia Mixer no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(tecnologiaMixer);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['mixer_id', 'tecnologia_id']);
    const tecnologiaMixer = await TecnologiaMixer.find(id);

    if (!tecnologiaMixer) {
      response.status(404).json({
        message: 'Tecnologia Mixer no encontrada.',
        id
      });
      return;
    }
    tecnologiaMixer.mixer_id = data.mixer_id || tecnologiaMixer.mixer_id;
    tecnologiaMixer.producto_id = data.producto_id || tecnologiaMixer.producto_id;
    await tecnologiaMixer.save();

    response.status(200).json(tecnologiaMixer);
  }

  async destroy({ request, response, params: { id } }) {
    const tecnologiaMixer = await TecnologiaMixer.find(id);

    if (!tecnologiaMixer) {
      response.status(404).json({
        message: 'Tecnologia Mixer no encontrada.',
        id
      });
      return;
    }
    await tecnologiaMixer.delete();

    response.status(200).json(tecnologiaMixer);
  }
}

module.exports = TecnologiaMixerController;
