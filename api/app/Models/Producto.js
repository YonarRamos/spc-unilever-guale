'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Producto extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
  tendencias(){
    return this.hasMany('App/Models/Tendecia', 'id', 'tag_codigo_producto')
  }
  mixer_producto() {
    return this.belongsToMany('App/Models/Mixer')
      .pivotModel('App/Models/MixerProducto')
      .withPivot(['id']);
  }

}

module.exports = Producto;
