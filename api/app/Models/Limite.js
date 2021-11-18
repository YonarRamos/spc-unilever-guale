'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Limite extends Model {
  static get createdAtColumn() {
    return null;
  }
  
  static get updatedAtColumn() {
    return null;
  }

  static get dates() {
    return super.dates.concat(['ini', 'end'])
  }
  
  static castDates(field, value) {
    if (field === 'ini' || field === 'end') {
      return value.format('YYYY-MM-DD HH:mm:ss')
    }
  }

  tendencia() {
    return this.hasMany('App/Models/Tendencia', 'id', 'tendencia_id')
  }
  historico() {
    return this.hasMany('App/Models/Historico', 'id', 'limite_id')
  } 
}

module.exports = Limite;
