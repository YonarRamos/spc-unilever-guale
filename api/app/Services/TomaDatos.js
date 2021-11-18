'use strict';

const Database = use('Database');
const Tendencia = use('App/Models/Tendencia');

const _ = require('lodash');
const moment = require('moment');

class TomaDatos {
  async getHistoricos(variables ,desde ,hasta) {
    return new Promise(async function (resolve) {
     //  console.log(variables + 'ver variables')
   try {
    let tendencias = await Tendencia.query().fetch();
    tendencias = tendencias.toJSON()
    var arrPromises = variables.map( async function(variable) {
      //console.log(JSON.stringify(variable))
       var cont = 0;
        var text =""
      for(var i=0; i< variable['tag_name'].length; i++) {
        var caracter = variable['tag_name'].charAt(i);
        if(caracter ==  `\\`) {
          cont ++;
        }
       else if(cont > 0){
         text=text + caracter
        }
      }
      const tendencia = tendencias.filter( tend => tend.tag.includes(text));
      var codigo = tendencia.length ? tendencia[0].codigo_producto_actual : null
      var mixer = tendencia.length ? tendencia[0].mixer_id : null
      //consulto TagUID segun la ruta del tag 
      const str = "select TagUID  FROM [HistorianStorage].[IS].[VTagBrowsing] where Tagname like '%"+text+"%' order by Tagname"
      const vtag = await Database.connection('historian').raw(str)
      const str_codigo = "select TagUID  FROM [HistorianStorage].[IS].[VTagBrowsing] where Tagname like '%"+text+"%' order by Tagname"
      const vtagCodigo = await Database.connection('historian').raw(str_codigo)
      if(vtag.length>0){
        //consulto con el TagUID el valueFloat con el stored procedure
        var val = 0;
        if(variable.tipo == 2){ val = 3}
         const strValue = "EXEC	[IS].[udsp_getTagTable] @tagIds = N'"+vtag[val].TagUID+"', @TimeBegin = '"+desde+"', @TimeEnd = '"+hasta+"'"
         //console.log(strValue)
         const value = await Database.connection('historian').raw(strValue)
         //console.log(value)
          if(value.length >0){
            var arrValues = value.map(val =>{
              return({
                'Timestamp': val.Timestamp,
                'Archive_ID': variable.archive_id, 'RealValue': val.ValueFloat, 'Bloque_ID': "", 'Tipo': variable.tipo, 'Filtrado': variable.filtrado, 'tendecia_id': variable.tendecia_id, 'tag_name': variable.tag_name, 'codigo_producto': codigo, 'tk': mixer
               })
            })
            const resp = await Promise.all(arrValues)
            return resp
 
          }
        }
        
  })
  Promise.all(arrPromises).then((res) => {
    var values = []
    res.map(reorder => {if(reorder != undefined){reorder.map(item => values.push(item))}})
    return resolve(values)
  })
   }
  catch(error){
    console.log(error)
    resolve(error) 
  }
    })
   
  }

  //Traigo los datos del historian para analizar
  static async getData(variables ,desde ,hasta){
    return new Promise(async function (resolve, reject) {
      try {
        
        //Armo las consultas para el historian
        //variable utilizada en tortugita (where PhysicalDataSourceName = 'HCOSSV1')
        var strBrowsing = "select distinct TagUID, Tagname  FROM [HistorianStorage].[IS].[VTagBrowsing] where " 
        for await(const variable of variables){
        //  console.log(variable.codigo_producto)
          if(variable.sp){strBrowsing = strBrowsing + `Tagname like '%${variable.sp.tag_name}%' OR `}
          if(variable.pv){strBrowsing = strBrowsing + `Tagname like '%${variable.pv.tag_name}%' OR `}
          if(variable.codigo_producto){strBrowsing = strBrowsing + `Tagname like '%${variable.codigo_producto.tag_name}%' OR `}
          if(variable.filtro){strBrowsing = strBrowsing + `Tagname like '%${variable.filtro.tag_name}%' OR `}
        }
        strBrowsing = strBrowsing.slice(0,-3) 
        strBrowsing = strBrowsing + ' order by Tagname'
        //Consulta los UID de las variables necesarias
       
        const vtag = await Database.connection('historian').raw(strBrowsing)
        //armo el string para la consulta de los datos
        var strTable = "EXEC [IS].[udsp_getTagTable] @tagIds = N'"
        for await(const tag of vtag){
          strTable = strTable + `${tag.TagUID}, `
        }
        strTable = strTable.slice(0,-2)
        strTable = strTable + "', @TimeBegin = '"+desde+"', @TimeEnd = '"+hasta+"'"
        
        //consulto los datos
        const values = await Database.connection('historian').raw(strTable)
        var arrValues = values.map(res => {
          res.TagName = res.TagName.slice(14,res.TagName.length)
        })
        await Promise.all(arrValues)
        //Agrupo las variables para trabajarlas
        const valuesAgrupados = _.groupBy(values, 'TagName')
        resolve(valuesAgrupados)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    });
  }
}

module.exports = TomaDatos;
