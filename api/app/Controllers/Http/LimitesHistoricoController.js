'use strict'

const { HasOne } = require('@adonisjs/lucid/src/Lucid/Relations');

const LimitesHistorico = use('App/Models/LimitesHistorico');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with limiteshistoricos
 */
class LimitesHistoricoController {
  /**
   * Show a list of all limiteshistoricos.
   * GET limiteshistoricos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, params: { id } }) {
    try{
      let { descending, page, perPage, sortBy, totalItems } = request.all();
      page = page || 1;
      perPage = perPage || 10

      let historico = await LimitesHistorico.query().where('id_actual', id).with('limite').orderBy('id_anterior', 'DESC').paginate(page, perPage)
      historico = historico.toJSON()
      const formated = {
        totalItems: historico.total,
        rowsPerPage:historico.perPage,
        page:historico.page,
        data:historico.data
      }
      console.log('HISTORICO', formated)
      return response.status(200).json(formated);
    }catch(error){
      console.log(error)
    }
  }

  /**
   * Render a form to be used for creating a new limiteshistorico.
   * GET limiteshistoricos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new limiteshistorico.
   * POST limiteshistoricos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single limiteshistorico.
   * GET limiteshistoricos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing limiteshistorico.
   * GET limiteshistoricos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update limiteshistorico details.
   * PUT or PATCH limiteshistoricos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a limiteshistorico with id.
   * DELETE limiteshistoricos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = LimitesHistoricoController
