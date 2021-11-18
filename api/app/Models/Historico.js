'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Historico extends Model {
 
  static get incrementing () {
    return false
  }
  static get primaryKey () {
    return null
  }
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  static get dates() {
    return super.dates.concat(['fecha'])
  }
  
  static castDates(field, value) {
    if (field === 'fecha') {
      return value.format('YYYY-MM-DD HH:mm:ss')
    }
  }

  tendencia(){
    return this.belongsTo('App/Models/Tendencia', 'id', 'tendecia_id')
  }
  limite(){
    return this.belongsTo('App/Models/Limite', 'id', 'limite_id')
  }
}

module.exports = Historico;
