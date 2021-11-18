'use strict';

class StoreTag {
  get rules() {
    return {
      archive_id: 'required|unique:tendencias',
      tag_name: 'required|unique:tendencias',
      tendencia_id: 'required'
    };
  }

  get messages() {
    return {
      'archive_id.required': 'El campo archive_id es requerido.',
      'archive_id.unique': 'El tag con archive_id ya se encuentra registrada.',
      'tag_name.required': 'El campo tag_name es requerido.',
      'tag_name.unique': 'El tag con tag_name ya se encuentra registrada.',
      'tendencia_id.required': 'El tag debe estar referenciada a una tendencia.'
    };
  }
}

module.exports = StoreTag;
