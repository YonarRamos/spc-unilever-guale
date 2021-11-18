'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TecnologiaSchema extends Schema {
  up() {
    this.create('tecnologias', table => {
      table.increments();
      table.string('nombre');
      table.string('descripcion');
    });
  }

  down() {
    this.drop('tecnologias');
  }
}

module.exports = TecnologiaSchema;
