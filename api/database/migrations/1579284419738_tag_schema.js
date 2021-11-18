'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TagSchema extends Schema {
  up () {
    this.create('tags', (table) => {
      table.increments('id').primary();
      table.string('tag_name',255);
      table.integer('tipo');
      table.boolean('filtrado');
    })
  }

  down () {
    this.drop('tags')
  }
}

module.exports = TagSchema
