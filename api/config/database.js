'use strict';

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers');

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: Env.get('DB_CONNECTION', 'mssql'),

  /*
  |--------------------------------------------------------------------------
  | Sqlite
  |--------------------------------------------------------------------------
  |
  | Sqlite is a flat file database and can be good choice under development
  | environment.
  |
  | npm i --save sqlite3
  |
  */
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: Helpers.databasePath(`${Env.get('DB_DATABASE', 'development')}.sqlite`)
    },
    useNullAsDefault: true
  },

  /*
  |--------------------------------------------------------------------------
  | MySQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for MySQL database.
  |
  | npm i --save mysql
  |
  */
  mysql: {
    client: 'mysql',
    connection: {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', ''),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'adonis')
    }
  },

  /*
  |--------------------------------------------------------------------------
  | PostgreSQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for PostgreSQL database.
  |
  | npm i --save pg
  |
  */
  pg: {
    client: 'pg',
    connection: {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', ''),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'adonis')
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Microsoft SQL Server
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for SQLServer database.
  |
  | npm i --save mssql
  |
  */
  mssql: {
    client: 'mssql',
    connection: {
      host: Env.get('DB_HOST', '127.0.0.1'),
      port: Env.get('DB_PORT', '1433'),
      user: Env.get('DB_USER', 'sysa'),
      password: Env.get('DB_PASSWORD', 'Edsd5450'),
      database: Env.get('DB_DATABASE', 'WebStatisticalProcessControl'),
      requestTimeout: 600000,// this part worked for me, 10 min timeout
      options: {
        useUTC: false
      },
      
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Microsoft SQL Server
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for SQLServer database.
  |
  | npm i --save mssql
  |
  */
  historian: {
    client: 'mssql',
    connection: {
      host: Env.get('DB_HOST_HISTORIAN', 'localhost'),
      port: Env.get('DB_PORT_HISTORIAN', ''),
      user: Env.get('DB_USER_HISTORIAN', 'root'),
      password: Env.get('DB_PASSWORD_HISTORIAN', ''),
      database: Env.get('DB_DATABASE_HISTORIAN', 'adonis'),
      options: {
        useUTC: false
      },
      requestTimeout: -1
    },
    pool: {
        max: 50,
        min: 2,
         acquireTimeout: 60 * 1000,
         createTimeoutMillis: 30000,
         acquireTimeoutMillis: 30000,
         idleTimeoutMillis: 30000,
        // reapIntervalMillis: 1000,
        // createRetryIntervalMillis: 100,
        propagateCreateError: false // <- default is true, set to false
    }
  },

  wincc: {
    client: 'mssql',
    connection: {
      host: Env.get('DB_HOST_WINCC', 'localhost'),
      port: Env.get('DB_PORT_WINCC', ''),
      user: Env.get('DB_USER_WINCC', 'root'),
      password: Env.get('DB_PASSWORD_WINCC', ''),
      database: Env.get('DB_DATABASE_WINCC', 'adonis'),
      options: {
        useUTC: false
      },
      requestTimeout: -1
    },
    pool: {
        max: 50,
        min: 2,
         acquireTimeout: 60 * 1000,
         createTimeoutMillis: 30000,
         acquireTimeoutMillis: 30000,
         idleTimeoutMillis: 30000,
        // reapIntervalMillis: 1000,
        // createRetryIntervalMillis: 100,
        propagateCreateError: false // <- default is true, set to false
    }
  }
};
