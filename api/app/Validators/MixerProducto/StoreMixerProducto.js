'use strict';

class StoreMixerProducto {
  get rules() {
    return {
      producto_id: 'required',
      mixer_id: 'required'
    };
  }

  get messages() {
    return {
      'producto_id.required': 'La relacion debe estar referenciada con un producto.',
      'mixer_id.required': 'La relacion debe estar referenciada con un mixer.'
    };
  }
}

module.exports = StoreMixerProducto;
