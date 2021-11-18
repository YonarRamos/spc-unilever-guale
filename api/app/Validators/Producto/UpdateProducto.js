'use strict';

class UpdateProducto {
  get rules() {
    const productoId = this.ctx.params.id;
    return {
      codigo: `unique:productos,codigo,id,${productoId}`
    };
  }

  get messages() {
    return {
      'codigo.unique': 'El producto ya se encuentra registrada.'
    };
  }
}

module.exports = UpdateProducto;
