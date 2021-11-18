'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class LimiteSchema extends Schema {
  up() {
    this.create('limites', table => {
      table.increments();
      table.boolean('ultimo');
      table.float('lh_1sigma');
      table.float('ll_1sigma');
      table.float('lh_2sigma');
      table.float('ll_2sigma');
      table.float('lh_3sigma');
      table.float('ll_3sigma');
      table.float('usl');
      table.float('lsl');
      table.float('usl_rango');
      table.float('lsl_rango');
      table.float('media');
      table.float('media_rango');
      table.float('codigo_producto');
      table.integer('tendencia_id').unsigned();
      table.datetime('ini');
      table.datetime('end');
    });
  }

  down() {
    this.drop('limites');
  }
}

module.exports = LimiteSchema;
