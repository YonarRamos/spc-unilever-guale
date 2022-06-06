'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Tendencia extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
  static get dates() {
    return super.dates.concat(['ultima_actualizacion'])
  }
  
  static castDates(field, value) {
    if (field === 'ultima_actualizacion') {
      return value.format('YYYY-MM-DD HH:mm:ss')
    }
  }
  alarmas() {
    return this.hasMany('App/Models/Alarmas', 'id', 'tendecia_id')
  }
  limites(){
    return this.hasMany('App/Models/Limite', 'id', 'tendencia_id')
  }
  historicos() {
   return this.hasMany('App/Models/Historico', 'id', 'tendencia_id')
  }
  productos() {
    return this.belongsTo('App/Models/Producto')
  }
  producto_actual() {
    return this.hasMany('App/Models/ProductoActual', 'codigo_producto_actual', 'codigo_producto')
  }
  mixer() { 
    return this.belongsTo('App/Models/Mixer')
  }
  sp() { 
    return this.belongsTo('App/Models/Tag', 'tag_sp','id')
  }
  pv() { 
    return this.belongsTo('App/Models/Tag', 'tag_pv','id')
  }
  codigo_producto() { 
    return this.belongsTo('App/Models/Tag', 'tag_codigo_producto','id')
  }
  filtro() { 
    return this.belongsTo('App/Models/Tag', 'tag_filtro','id')
  }

}

module.exports = Tendencia;
