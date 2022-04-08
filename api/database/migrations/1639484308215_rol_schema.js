'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RolSchema extends Schema {
  up () {
    this.create('rols', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('rols')
  }
}

module.exports = RolSchema
