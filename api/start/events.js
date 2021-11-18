const WebSocketHistoricosTendencia = require('../app/Jobs/WebSocketHistoricosTendencia');
const Adquisicion = require('../app/Jobs/Adquisicion');
const Database = use('Database');

initialCreate();
adquisicionRapida();
//adquisicionLenta();


async function adquisicionRapida() {
  try {
    setTimeout(async () => {
      console.log("Adquiriendo rapido")
      await Adquisicion.tomaDatos(true);
      //await WebSocketHistoricosTendencia.start();
      adquisicionRapida();
    }, 3000);

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

async function adquisicionLenta() {
  try {
    setTimeout(async () => {
      console.log("Adquiriendo lento")
      await Adquisicion.tomaDatos(false);
      //await WebSocketHistoricosTendencia.start();
      adquisicionLenta();
    }, 600000);

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}


async function initialCreate() {
  await Adquisicion.tomaDatos(true);
}
