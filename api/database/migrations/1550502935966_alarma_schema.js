'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AlarmaSchema extends Schema {
  up() {
    this.create('alarmas', table => {
      table.increments();
      table.string('descripcion');
      table.string('codigo_producto');
      table.integer('tendencia_id');
      table.integer('tipo');
      table.integer('prioridad');
      table.boolean('reconocida').defaultTo(false);
      table.string('usuario');
      table.string('detalle');
      table.datetime('fecha_creada');
      table.datetime('fecha_reconocida');
    });
  }

  down() {
    this.drop('alarmas');
  }
}

module.exports = AlarmaSchema;
