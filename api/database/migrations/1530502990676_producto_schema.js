'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ProductoSchema extends Schema {
  up() {
    this.create('productos', table => {
      table.increments().primary();
      table.string('codigo', 255);
      table.string('descripcion',255);
    });
  }

  down() {
    this.drop('productos');
  }
}

module.exports = ProductoSchema;
