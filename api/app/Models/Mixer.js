'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Mixer extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  tecnologias() {
    return this.belongsToMany('App/Models/Tecnologia')
      .pivotModel('App/Models/TecnologiaMixer')
      .withPivot(['id']);
  }

  productos() {
    return this.belongsToMany('App/Models/Producto')
      .pivotModel('App/Models/MixerProducto')
      .withPivot(['id']);
  }

  tendencia() {
    return this.hasMany('App/Models/Tendencia');
  }
}

module.exports = Mixer;
