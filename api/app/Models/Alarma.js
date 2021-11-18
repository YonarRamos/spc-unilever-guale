'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Alarma extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  tendencia() {
    return this.belongsTo('App/Models/Tendencia');
  }
}

module.exports = Alarma;
