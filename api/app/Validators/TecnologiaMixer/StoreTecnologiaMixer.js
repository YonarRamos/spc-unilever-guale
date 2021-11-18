'use strict';

class StoreTecnologiaMixer {
  get rules() {
    return {
      tecnologia_id: 'required',
      mixer_id: 'required'
    };
  }

  get messages() {
    return {
      'tecnologia_id.required': 'La relacion debe estar referenciada con una tecnologia.',
      'mixer_id.required': 'La relacion debe estar referenciada con un mixer.'
    };
  }
}

module.exports = StoreTecnologiaMixer;
