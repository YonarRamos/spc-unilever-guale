'use strict';

class StoreLimite {
  get rules() {
    return {
      lh_1sigma: 'required',
      ll_1sigma: 'required',
      lh_2sigma: 'required',
      ll_2sigma: 'required',
      lh_3sigma: 'required',
      ll_3sigma: 'required',
      usl: 'required',
      lsl: 'required',
      usl_rango: 'required',
      lsl_rango: 'required',
      media: 'required',
      media_rango: 'required',
      tendencia_id: 'required'
    };
  }

  get messages() {
    return {
      'lh_1sigma.required': 'El campo lh_1sigma es requerido.',
      'll_1sigma.required': 'El campo ll_1sigma es requerido.',
      'lh_2sigma.required': 'El campo lh_2sigma es requerido.',
      'll_2sigma.required': 'El campo ll_2sigma es requerido.',
      'lh_3sigma.required': 'El campo lh_3sigma es requerido.',
      'll_3sigma.required': 'El campo ll_3sigma es requerido.',
      'usl.required': 'El campo usl es requerido.',
      'lsl.required': 'El campo lsl es requerido.',
      'usl_rango.required': 'El campo usl_rango es requerido.',
      'lsl_rango.required': 'El campo lsl_rango es requerido.',
      'media.required': 'El campo media es requerido.',
      'media_rango.required': 'El campo media_rango es requerido.',
      'tendencia_id.required': 'El limite debe estar referenciado a una tendencia.'
    };
  }
}

module.exports = StoreLimite;
