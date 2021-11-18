'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Tecnologia extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  mixers() {
    return this.belongsToMany('App/Models/Mixer')
      .pivotModel('App/Models/TecnologiaMixer')
      .withPivot(['id']);
  }

  productos() {
    return this.manyThrough('App/Models/MixerProducto', 'productos', 'mixer_id', 'producto_id');
  }
}

module.exports = Tecnologia;
