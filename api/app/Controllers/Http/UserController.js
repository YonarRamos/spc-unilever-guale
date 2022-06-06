'use strict';

const User = use('App/Models/User');
const Rol = use('App/Models/Rol');
const Query = require('../../Utils/Query');

class UserController {
  async index({ request, response }) {
    let query = User.query();
    const users = await Query.builder(query, request);
    response.status(200).json(users);
  }

  async store({ request, response }) {
    try {
      const data = request.only(['nombre', , 'apellido', 'email', 'password', 'rol_id']);
      
      const user = await User.create(data);

      response.status(201).json(user);
    } catch (error) {
      console.log(error)
    }

  }
  async login({ request, response, auth }) {
    try {
      const { email, password } = request.all();
      const token = await auth.attempt(email, password)
      let user = await User.findBy('email', email)
      user = user.toJSON()
      delete user.password
      console.log(user)
      
      return response.status(200).json({ message: 'logueado con exito!', token: token.token, user})
    } catch (error) {
      console.log(error.message)
      var resCustom = ''
      if (error.message.includes('Cannot verify user password')) {
        return response.status(401).json({ message: 'Contraseña incorrecta' });
      } else if (error.message.includes('Cannot find user')) {
        return response.status(401).json({ message: 'Usuario no encontrado' });
      } else {
        return response.status(401).json({ message: 'Error al procesar la solicitud' });
      }
    }
  }
  async loginAutomatico({ auth, response }) {
    try {
      const user = await auth.getUser();
      if (user) {
        let data = { email: user.email, password: user.password }
        return response.status(200).json(data)
      }
    } catch (error) {
      console.log(error)
      response.status(400).json({ menssage: 'Hubo un error al realizar la operación' })
    }

}

  async show({ request, response, params: { id } }) {
    const user = await User.findOrFail(id);

    if (!user) {
      response.status(404).json({
        message: 'User no encontrada.',
        id
      });
      return;
    }
    response.status(200).json(user);
  }

  async update({ request, response, params: { id } }) {
    const data = request.only(['nombre','apellido' ,'email', 'password']);
    const user = await User.find(id);

    if (!user) {
      response.status(404).json({
        message: 'User no encontrada.',
        id
      });
      return;
    }
    user.nombre = data.nombre || user.nombre;
    user.apellido = data.apellido || user.apellido;
    user.email = data.email || user.email;
    user.password = data.password || user.password;
    await user.save();

    response.status(200).json(user);
  }

  async destroy({ request, response, params: { id } }) {
    const user = await User.find(id);

    if (!user) {
      response.status(404).json({
        message: 'User no encontrada.',
        id
      });
      return;
    }
    await user.delete();

    response.status(200).json(user);
  }
  async rols({request , response,}){
    let query = Rol.query();
    const rol = await Query.builder(query, request);
    response.status(200).json(rol);
  }
}

module.exports = UserController;
