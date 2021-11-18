'use strict';

class UpdateTecnologia {
  get rules() {
    const tecnologiaId = this.ctx.params.id;
    return {
      nombre: `unique:tecnologias,nombre,id,${tecnologiaId}`
    };
  }

  get messages() {
    return {
      'nombre.unique': 'La tecnologia ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateTecnologia;
