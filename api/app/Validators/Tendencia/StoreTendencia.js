'use strict';

class StoreTendencia {
  get rules() {
    return {
      nombre: 'required|unique:tendencias'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'nombre.unique': 'La tendencia ya se encuentra registrada.'
    };
  }
}

module.exports = StoreTendencia;
