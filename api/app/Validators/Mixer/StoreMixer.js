'use strict';

class StoreMixer {
  get rules() {
    return {
      nombre: 'required|unique:mixers'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'nombre.unique': 'El mixer ya se encuentra registrada.'
    };
  }
}

module.exports = StoreMixer;
