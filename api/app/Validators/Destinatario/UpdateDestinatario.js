'use strict';

class UpdateDestinatario {
  get rules() {
    const destinatarioId = this.ctx.params.id;
    return {
      email: `unique:destinatarios,email,id,${destinatarioId}`
    };
  }

  get messages() {
    return {
      'email.unique': 'El email ya se encuentra registrado.'
    };
  }
}

module.exports = UpdateDestinatario;
