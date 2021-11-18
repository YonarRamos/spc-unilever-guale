'use strict';

class StoreProducto {
  get rules() {
    return {
      codigo: 'required|unique:productos'
    };
  }

  get messages() {
    return {
      'codigo.required': 'El campo codigo es requerido.',
      'codigo.unique': 'El producto ya se encuentra registrada.'
    };
  }
}

module.exports = StoreProducto;
