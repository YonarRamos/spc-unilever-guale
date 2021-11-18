'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TendenciaSchema extends Schema {
  up() {
    this.create('tendencias', table => {
      
      table.integer('id').primary();
      table.string('nombre', 255);
      table.string('tipo', 255);
      table.string('descripcion', 255);
      table.string('tag', 255);
      table.integer('tag_codigo_producto');
      table.datetime('ultima_actualizacion').defaultTo(this.fn.now());
      table.integer('tv');
      table.boolean('tiempo_real').defaultTo(false);
      table.integer('mixer_id').unsigned();
      table.string('codigo_producto_actual', 255);
      table.integer('tag_sp').unsigned();
      table.integer('tag_pv').unsigned();
      table.integer('tago_filtro').unsigned()
    });
  }

  down() {
    this.drop('tendencias');
  }
}

module.exports = TendenciaSchema;
