'use strict';

class UpdateTanque {
  get rules() {
    const tanqueId = this.ctx.params.id;
    return {
      numero: `unique:tanques,numero,id,${tanqueId}`
    };
  }

  get messages() {
    return {
      'numero.unique': 'El tanque ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateTanque;
