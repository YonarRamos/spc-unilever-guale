'use strict';

class StoreTecnologia {
  get rules() {
    return {
      nombre: 'required|unique:tecnologias'
    };
  }

  get messages() {
    return {
      'nombre.required': 'El campo nombre es requerido.',
      'nombre.unique': 'La tecnologia ya se encuentra registrada.'
    };
  }
}

module.exports = StoreTecnologia;
