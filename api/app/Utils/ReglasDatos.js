'use strict';

const Alarma = use('App/Models/Alarma');
const Redis = use('Redis');
const moment = use('moment')

var ReglasDatos = {
  async sobrepasaLimite(historico, limite) {
    let alarma = {
      tendencia_id: historico.tendencia_id,
      codigo_producto: historico.codigo_producto,
      tipo: 1,
      fecha_creada : moment().format('YYYY-MM-DD HH:mm:ss')
    };
    let cantidadAlarmasSinRecocer = await Redis.get('alarmas_sin_reconocer');

     if (!cantidadAlarmasSinRecocer) {
       cantidadAlarmasSinRecocer = 0;
     }

    // Analizo limites superiores
    // Crear alarma en caso que supere el limite de especificacion
    if (historico.pv > limite.usl) {
      alarma.descripcion = 'Limite de especificación superado';
      alarma.prioridad = 40;
      await Redis.set('alarmas_sin_reconocer', cantidadAlarmasSinRecocer + 1);
      return await Alarma.create(alarma);
    }

    // Crear alarma en caso que supere el 3° limite SIGMA
    if (historico.pv > limite.lh_3sigma) {
      alarma.descripcion = '3° Limite sigma superado';
      alarma.prioridad = 30;
      await Redis.set('alarmas_sin_reconocer', cantidadAlarmasSinRecocer + 1);
      return await Alarma.create(alarma);
    }

    // Crear alarma en caso que supere el 2° limite SIGMA
    if (historico.pv > limite.lh_2sigma) {
      alarma.descripcion = '2° Limite sigma superado';
      alarma.prioridad = 20;
      await Redis.set('alarmas_sin_reconocer', cantidadAlarmasSinRecocer + 1);
      return await Alarma.create(alarma);
    }

    // Crear alarma en caso que supere el 1° limite SIGMA
    if (historico.pv > limite.lh_1sigma) {
      alarma.descripcion = '1° Limite sigma superado';
      alarma.prioridad = 10;
      await Redis.set('alarmas_sin_reconocer', cantidadAlarmasSinRecocer + 1);
      return await Alarma.create(alarma);
    }

    // Analizo limites inferiores
    // Crear alarma en caso que supere el limite de especificacion
    if (historico.pv < limite.lsl) {
      alarma.descripcion = 'Limite de especificación superado';
      alarma.prioridad = 40;
      await Redis.set('alarmas_sin_reconocer', cantidadAlarmasSinRecocer + 1);
      return await Alarma.create(alarma);
    }

    // Crear alarma en caso que supere el 3° limite SIGMA
    if (historico.pv < limite.ll_3sigma) {
      alarma.descripcion = '3° Limite sigma superado';
      alarma.prioridad = 30;
      await Redis.set('alarmas_sin_reconocer', cantidadAlarmasSinRecocer + 1);
      return await Alarma.create(alarma);
    }

    // Crear alarma en caso que supere el 2° limite SIGMA
    if (historico.pv < limite.ll_2sigma) {
      alarma.descripcion = '2° Limite sigma superado';
      alarma.prioridad = 20;
      await Redis.set('alarmas_sin_reconocer', cantidadAlarmasSinRecocer + 1);
      return await Alarma.create(alarma);
    }

    // Crear alarma en caso que supere el 1° limite SIGMA
    if (historico.pv < limite.ll_1sigma) {
      alarma.descripcion = '1° Limite sigma superado';
      alarma.prioridad = 10;
      await Redis.set('alarmas_sin_reconocer', cantidadAlarmasSinRecocer + 1);
      return await Alarma.create(alarma);
    }
  }
};

module.exports = ReglasDatos;
