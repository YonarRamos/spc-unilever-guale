'use strict';

const Mail = use('Mail');

var EnvioEmail = {
  async alarma(alarma) {
    // await Mail.raw('plain text email', message => {
    //   message.from('alarmas.unilver@gmail.com');
    //   message.to('juandavidlivingston@gmail.com');
    // });
  }
};

module.exports = EnvioEmail;
