'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('api/v1/', () => {
  return { greeting: 'API SPC Unilver - Systelec S.A' };
});

// Users
Route.get('api/v1/usuarios', 'UserController.index');
Route.get('api/v1/users/:id', 'UserController.show');
Route.post('api/v1/login', 'UserController.login')
Route.get('api/v1/rols', 'UserController.rols')
Route.get('api/v1/loginAutomatico' , 'UserController.loginAutomatico')
Route.post('api/v1/users', 'UserController.store').validator('User/StoreUser');
Route.put('api/v1/users/:id', 'UserController.update').validator('User/UpdateUser');
Route.delete('api/v1/users/:id', 'UserController.destroy');

// Tendencias
Route.get('api/v1/tendencias', 'TendenciaController.index');
Route.get('api/v1/tendencias/:id', 'TendenciaController.show');
Route.post('api/v1/tendencias', 'TendenciaController.store').validator('Tendencia/StoreTendencia');
Route.put('api/v1/tendencias/:id', 'TendenciaController.update');
Route.delete('api/v1/tendencias/:id', 'TendenciaController.destroy');
Route.get('api/v1/tendencias/:id/limite_historicos', 'TendenciaController.limiteHistoricos');
Route.post('api/v1/tendencias/:id/tv', 'TendenciaController.cambiarTV');
Route.get('api/v1/tendencias/:id/tags', 'TendenciaController.indexTags');
Route.get('api/v1/tendencias/:id/limites', 'TendenciaController.indexLimites');

// Tags
Route.get('api/v1/tags', 'TagController.index');
Route.get('api/v1/tags/:id', 'TagController.show');
Route.post('api/v1/tags', 'TagController.store').validator('Tag/StoreTag');
Route.put('api/v1/tags/:id', 'TagController.update').validator('Tag/UpdateTag');
Route.delete('api/v1/tags/:id', 'TagController.destroy');
Route.get('api/v1/tags/:id/historicos', 'TagController.indexHistoricos');

// Limites
Route.get('api/v1/limites', 'LimiteController.index');
Route.get('api/v1/limites/:id', 'LimiteController.show');
Route.post('api/v1/limites', 'LimiteController.store').validator('Limite/StoreLimite');
Route.put('api/v1/limites/:id', 'LimiteController.update');
Route.delete('api/v1/limites/:id', 'LimiteController.destroy');
Route.get('api/v1/limites/:id/historicos', 'LimiteController.indexHistoricos');

// Historicos
Route.get('api/v1/historicos', 'HistoricoController.index');

// Destinatario
Route.get('api/v1/destinatarios', 'DestinatarioController.index');
Route.get('api/v1/destinatarios/:id', 'DestinatarioController.show');
Route.post('api/v1/destinatarios', 'DestinatarioController.store').validator(
  'Destinatario/StoreDestinatario'
);
Route.put('api/v1/destinatarios/:id', 'DestinatarioController.update').validator(
  'Destinatario/UpdateDestinatario'
);
Route.delete('api/v1/destinatarios/:id', 'DestinatarioController.destroy');

// Alarmas
Route.get('api/v1/alarmas', 'AlarmaController.index');
Route.put('api/v1/alarmas/:id/reconocer', 'AlarmaController.reconocer');

// Productos
Route.get('api/v1/productos', 'ProductoController.index');
Route.get('api/v1/productos/:id', 'ProductoController.show');
Route.post('api/v1/productos', 'ProductoController.store').validator('Producto/StoreProducto');
Route.put('api/v1/productos/:id', 'ProductoController.update').validator('Producto/UpdateProducto');
Route.delete('api/v1/productos/:id', 'ProductoController.destroy');
Route.post('api/v1/productos/sincronizar_winncc', 'ProductoController.mergeWincc');

// Taques
Route.get('api/v1/tanques', 'TanqueController.index');
Route.get('api/v1/tanques/:id', 'TanqueController.show');
Route.post('api/v1/tanques', 'TanqueController.store').validator('Tanque/StoreTanque');
Route.put('api/v1/tanques/:id', 'TanqueController.update').validator('Tanque/UpdateTanque');
Route.delete('api/v1/tanques/:id', 'TanqueController.destroy');

// Tecnologias
Route.get('api/v1/tecnologias', 'TecnologiaController.index');
Route.get('api/v1/tecnologias/:id', 'TecnologiaController.show');
Route.post('api/v1/tecnologias', 'TecnologiaController.store').validator(
  'Tecnologia/StoreTecnologia'
);
Route.put('api/v1/tecnologias/:id', 'TecnologiaController.update').validator(
  'Tecnologia/UpdateTecnologia'
);
Route.delete('api/v1/tecnologias/:id', 'TecnologiaController.destroy');
Route.get('api/v1/tecnologias/:id/mixers', 'TecnologiaController.indexMixers');

// Mixers
Route.get('api/v1/mixers', 'MixerController.index');
Route.get('api/v1/mixers/:id', 'MixerController.show');
Route.post('api/v1/mixers', 'MixerController.store').validator('Mixer/StoreMixer');
Route.put('api/v1/mixers/:id', 'MixerController.update').validator('Mixer/UpdateMixer');
Route.delete('api/v1/mixers/:id', 'MixerController.destroy');
Route.get('api/v1/mixers/:id/productos', 'MixerController.indexProductos');

// MixerProductos
Route.get('api/v1/mixers_productos', 'MixerProductoController.index');
Route.get('api/v1/mixers_productos/:id', 'MixerProductoController.show');
Route.post('api/v1/mixers_productos', 'MixerProductoController.store');
Route.put('api/v1/mixers_productos/:id', 'MixerProductoController.update');
Route.delete('api/v1/mixers_productos/:id', 'MixerProductoController.destroy');

// TecnologiaMixers
Route.get('api/v1/tecnologias_mixers', 'TecnologiaMixerController.index');
Route.get('api/v1/tecnologias_mixers/:id', 'TecnologiaMixerController.show');
Route.post('api/v1/tecnologias_mixers', 'TecnologiaMixerController.store');
Route.put('api/v1/tecnologias_mixers/:id', 'TecnologiaMixerController.update');
Route.delete('api/v1/tecnologias_mixers/:id', 'TecnologiaMixerController.destroy');
