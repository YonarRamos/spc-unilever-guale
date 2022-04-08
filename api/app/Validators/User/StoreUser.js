'use strict';

class StoreUser {
  get rules() {
    return {
      email: 'required',
      nombre: 'required',
      apellido : 'required',
      password: 'required',
      rol_id: 'required'
    };
  }

  get messages() {
    return {
      'email.required': 'El campo email es requerido.',
      'nombre.required': 'El campo username es requerido.',
      'password.required': 'El campo password es requerido.',
      'rol_id.required': 'El campo password es requerido.',
      'apellido.required': 'El campo password es requerido.'
    };
  }
}

module.exports = StoreUser;
