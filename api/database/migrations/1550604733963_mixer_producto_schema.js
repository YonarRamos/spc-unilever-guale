'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MixerProductoSchema extends Schema {
  up() {
    this.create('mixer_producto', table => {
      table.increments();
      table.integer('mixer_id').unsigned();
      table.integer('producto_id').unsigned();
      table
        .foreign('mixer_id')
        .references('mixers.id')
        .onDelete('cascade');
      table
        .foreign('producto_id')
        .references('productos.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('mixer_producto');
  }
}

module.exports = MixerProductoSchema;
