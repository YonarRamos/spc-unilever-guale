'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class HistoricoSchema extends Schema {
  up() {
    this.create('historicos', table => {
      table.datetime('fecha');
      table.float('pv');
      table.float('sp');
      table.float('tk');
      table.float('codigo_producto');
      table.boolean('disparo_alarma');
      table.integer('tendencia_id').unsigned();
      table.integer('limite_id').unsigned();
    });
  }

  down() {
    this.drop('historicos');
  }
}

module.exports = HistoricoSchema;
