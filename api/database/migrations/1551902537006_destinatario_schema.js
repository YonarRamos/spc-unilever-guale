'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DestinatarioSchema extends Schema {
  up() {
    this.create('destinatarios', table => {
      table.increments();
      table.string('nombre').defaultTo('');
      table.string('apellido').defaultTo('');
      table.string('email').notNullable();
      table.boolean('envio').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('destinatarios');
  }
}

module.exports = DestinatarioSchema;
