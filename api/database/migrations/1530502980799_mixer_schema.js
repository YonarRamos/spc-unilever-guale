'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class MixerSchema extends Schema {
  up() {
    this.create('mixers', table => {
      table.increments();
      table.string('nombre');
      table.string('descripcion');
    });
  }

  down() {
    this.drop('mixers');
  }
}

module.exports = MixerSchema;
