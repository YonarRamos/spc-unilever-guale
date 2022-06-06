'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LimitesHistorico extends Model {
    static get table() {
        return 'limites_historico';
      }
    static get createdAtColumn() {
        return null;
      }
    
      static get updatedAtColumn() {
        return null;
      }

      limite(){
        return this.hasOne('App/Models/Limite', 'id_anterior', 'id')
      }
}

module.exports = LimitesHistorico
