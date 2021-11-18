'use strict';

class StoreDestinatario {
  get rules() {
    return {
      email: 'required|unique:destinatarios'
    };
  }

  get messages() {
    return {
      'email.required': 'El campo email es requerido.',
      'email.unique': 'El email ya se encuentra registrado.'
    };
  }
}

module.exports = StoreDestinatario;
