'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TecnologiaMixer extends Model {
  static get table() {
    return 'tecnologia_mixer';
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
  
}

module.exports = TecnologiaMixer;
