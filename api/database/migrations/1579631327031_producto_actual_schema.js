'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductoActualSchema extends Schema {
  up () {
    this.create('producto_actual', (table) => {
     table.datetime('fecha');
     table.integer('archive_id');
     table.string('codigo_producto', 255)
      
    })
  }

  down () {
    this.drop('producto_actual')
  }
}

module.exports = ProductoActualSchema
