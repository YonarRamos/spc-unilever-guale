'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Tag extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
  sp() { 
    return this.hasMany('App/Models/Tendencia', 'id', 'tag_sp')
  }
  pv() { 
    return this.hasMany('App/Models/Tendencia', 'id', 'tag_pv')
  }
  codigo_producto() { 
    return this.hasMany('App/Models/Tendencia', 'id', 'tag_codigo_producto')
  }
  filtro() { 
    return this.hasMany('App/Models/Tendencia', 'id', 'tag_filtro')
  }
}

module.exports = Tag;
