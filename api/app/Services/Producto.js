'use strict';

const Database = use('Database');

module.exports = {
  async merge() {
    const projectsIsReady = await Database.connection('wincc').raw(
      'select * from [master].[dbo].[CAConfig]'
    );
    const serverRunning = projectsIsReady.length > 0 ? projectsIsReady[0].Param1 : null;

    if (serverRunning) {
      const listProductos = await Database.connection('wincc').raw(
        `SELECT * FROM (SELECT A.VALUE AS codigo, B.VALUE as descripcion FROM [${serverRunning}].[dbo].[PERSTAGRTLIST] A
          INNER JOIN [${serverRunning}].[dbo].[PERSTAGRTLIST] B
          ON SUBSTRING(A.[TAGNAME], CHARINDEX('_', A.[TAGNAME]) + 1, 10) = SUBSTRING(B.[TAGNAME], CHARINDEX('_', B.[TAGNAME]) + 1, 10)
          WHERE A.TAGNAME LIKE 'ANIONICO%' AND A.TAGNAME LIKE '%COD%' AND B.TAGNAME LIKE 'ANIONICO%' AND B.TAGNAME LIKE '%DES%')AS PRODUCTO
          WHERE PRODUCTO.codigo <> ''`
      );
      for (const productoWINCC of listProductos) {
        const producto = await Database.connection('mssql')
          .table('productos')
          .where('codigo', productoWINCC.codigo)
          .first();

        if (producto) {
          if (producto.descripcion !== '') {
            await Database.table('productos')
              .where('id', producto.id)
              .update('descripcion', productoWINCC.descripcion);
          }
        } else {
          await Database.table('productos').insert(productoWINCC);
        }
      }
    }
  }
};
