var models = require('../models')


function insertDataToDb(data){
  return models.url.create(data).then(function(result){

    return result
    //console.log('result')
  })
}


module.exports = {
  insertDataToDb:insertDataToDb,
}
