'use strict';

class UpdateTendencia {
  get rules() {
    const tendenciaId = this.ctx.params.id;
    return {
      nombre: `unique:tendencias,nombre,id,${tendenciaId}`
    };
  }

  get messages() {
    return {
      'nombre.unique': 'La tendencia ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateTendencia;
