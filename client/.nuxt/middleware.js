const middleware = {}

middleware['AUTH'] = require('..\\middleware\\AUTH.js');
middleware['AUTH'] = middleware['AUTH'].default || middleware['AUTH']

middleware['NOAUTH'] = require('..\\middleware\\NOAUTH.js');
middleware['NOAUTH'] = middleware['NOAUTH'].default || middleware['NOAUTH']

export default middleware
