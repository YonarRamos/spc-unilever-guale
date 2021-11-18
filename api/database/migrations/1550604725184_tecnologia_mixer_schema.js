'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class TecnologiaMixerSchema extends Schema {
  up() {
    this.create('tecnologia_mixer', table => {
      table.increments();
      table.integer('tecnologia_id').unsigned();
      table.integer('mixer_id').unsigned();
      table
        .foreign('tecnologia_id')
        .references('tecnologias.id')
        .onDelete('cascade');
      table
        .foreign('mixer_id')
        .references('mixers.id')
        .onDelete('cascade');
    });
  }

  down() {
    this.drop('tecnologia_mixer');
  }
}

module.exports = TecnologiaMixerSchema;
