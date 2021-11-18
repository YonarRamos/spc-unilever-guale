'use strict';

class StoreTanque {
  get rules() {
    return {
      numero: 'required|unique:tanques',
      nombre: 'required|unique:tanques'
    };
  }

  get messages() {
    return {
      'numero.required': 'El campo numero es requerido.',
      'nombre.unique': 'El nombre ya se encuentra registrada.'
    };
  }
}

module.exports = StoreTanque;
