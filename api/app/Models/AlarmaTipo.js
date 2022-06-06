'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AlarmaTipo extends Model {
    static get table() {
        return 'alarma_tipo';
      }
    static get createdAtColumn() {
        return null;
      }
    
      static get updatedAtColumn() {
        return null;
      }
}

module.exports = AlarmaTipo
