'use strict';

const User = use('App/Models/User');
const Query = require('../../Utils/Query');

class UserController {
  async index({ request, response }) {
    let query = User.query();
    const users = await Query.builder(query, request);
    response.status(200).json(users);
  }

  async store({ request, response }) {
    const data = request.only(['username', 'email', 'password']);
    const user = await User.create(data);

    response.status(201).json(user);
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
    const data = request.only(['username', 'email', 'password']);
    const user = await User.find(id);

    if (!user) {
      response.status(404).json({
        message: 'User no encontrada.',
        id
      });
      return;
    }
    user.username = data.username || user.username;
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
}

module.exports = UserController;
